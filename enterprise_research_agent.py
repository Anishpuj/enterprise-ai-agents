from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from langchain_ollama import ChatOllama
import uvicorn
import requests
import json
import time
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db, APIRequest, User
from auth import get_api_user, check_rate_limit

app = FastAPI(title="Enterprise Research Agent API", version="2.0.0")

class Message(BaseModel):
    content: str

class Response(BaseModel):
    content: str
    sources: list = []
    request_id: str = ""
    processing_time: int = 0
    tokens_used: int = 0

model = ChatOllama(model="llama3.2")

def search_web(query: str) -> dict:
    """Enterprise web search with multiple sources"""
    try:
        # Primary: DuckDuckGo
        duckduckgo_results = search_duckduckgo(query)
        
        # Fallback: Wikipedia API for academic topics
        wiki_results = search_wikipedia(query)
        
        # Combine results
        all_results = duckduckgo_results + wiki_results
        
        return {"results": all_results[:5], "success": True}
    except Exception as e:
        return {"results": [], "success": False, "error": str(e)}

def search_duckduckgo(query: str) -> list:
    try:
        url = "https://api.duckduckgo.com/"
        params = {"q": query, "format": "json", "no_html": 1, "skip_disambig": 1}
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        results = []
        if data.get("Abstract"):
            results.append({"title": "DuckDuckGo Abstract", "content": data["Abstract"], "url": ""})
        if data.get("RelatedTopics"):
            for topic in data["RelatedTopics"][:3]:
                if isinstance(topic, dict) and "Text" in topic:
                    results.append({
                        "title": topic.get("FirstURL", "Source"), 
                        "content": topic["Text"],
                        "url": topic.get("FirstURL", "")
                    })
        return results
    except:
        return []

def search_wikipedia(query: str) -> list:
    try:
        url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + query.replace(" ", "_")
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return [{
                "title": "Wikipedia",
                "content": data.get("extract", ""),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page", "")
            }]
    except:
        pass
    return []

@app.post("/research_agent", response_model=Response)
async def research_agent(
    message: Message, 
    api_key: str = Header(..., description="Your API key"),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    
    # Authentication and rate limiting
    user = get_api_user(api_key, db)
    check_rate_limit(user, db)
    
    # Generate request ID
    request_id = f"req_{int(time.time())}_{user.id[:8]}"
    
    try:
        # Enhanced research prompt
        prompt = f"""You are an enterprise research assistant. Provide comprehensive analysis based on the search results.

User Query: {message.content}

Search Results: {json.dumps(search_web(message.content), indent=2)}

Provide a detailed response including:
1. Direct answer to the user's question
2. Key findings from search results
3. Analysis of information quality and reliability
4. Limitations and gaps in available information
5. Follow-up questions or areas for further investigation

Format your response professionally with clear sections."""
        
        response = model.invoke(prompt)
        search_data = search_web(message.content)
        
        processing_time = int((time.time() - start_time) * 1000)
        tokens_used = len(response.content.split())  # Simple token estimation
        
        # Log the request
        api_request = APIRequest(
            user_id=user.id,
            agent_type="research",
            input_data=message.content,
            output_data=response.content[:1000],  # Truncate for storage
            processing_time=processing_time,
            tokens_used=tokens_used,
            status="completed"
        )
        db.add(api_request)
        db.commit()
        
        return Response(
            content=response.content,
            sources=[result["title"] for result in search_data["results"]],
            request_id=request_id,
            processing_time=processing_time,
            tokens_used=tokens_used
        )
        
    except Exception as e:
        # Log failed request
        api_request = APIRequest(
            user_id=user.id,
            agent_type="research",
            input_data=message.content,
            output_data=str(e),
            processing_time=int((time.time() - start_time) * 1000),
            status="failed"
        )
        db.add(api_request)
        db.commit()
        
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow(), "agent": "research"}

@app.get("/metrics")
async def get_metrics(api_key: str = Header(...), db: Session = Depends(get_db)):
    user = get_api_user(api_key, db)
    
    # Get user's usage metrics
    total_requests = db.query(APIRequest).filter(APIRequest.user_id == user.id).count()
    successful_requests = db.query(APIRequest).filter(
        APIRequest.user_id == user.id, 
        APIRequest.status == "completed"
    ).count()
    
    avg_processing_time = db.query(APIRequest.processing_time).filter(
        APIRequest.user_id == user.id,
        APIRequest.status == "completed"
    ).all()
    
    avg_time = sum([p[0] for p in avg_processing_time]) / len(avg_processing_time) if avg_processing_time else 0
    
    return {
        "user_id": user.id,
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "success_rate": f"{(successful_requests/total_requests*100):.1f}%" if total_requests > 0 else "0%",
        "average_processing_time_ms": int(avg_time),
        "organization": user.organization.name if user.organization else "Individual"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
