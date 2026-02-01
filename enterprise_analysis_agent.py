from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from langchain_ollama import ChatOllama
import uvicorn
import json
import time
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db, APIRequest, User
from auth import get_api_user, check_rate_limit

app = FastAPI(title="Enterprise Analysis Agent API", version="2.0.0")

class Message(BaseModel):
    content: str
    sources: list = []

class Response(BaseModel):
    content: str
    insights: list = []
    confidence: str = "medium"
    request_id: str = ""
    processing_time: int = 0
    tokens_used: int = 0

model = ChatOllama(model="llama3.2")

def analyze_content_quality(content: str, sources: list) -> dict:
    """Enterprise-grade content analysis"""
    quality_score = 0
    factors = []
    
    # Source credibility analysis
    if sources:
        credible_sources = [s for s in sources if any(keyword in s.lower() for keyword in 
            ['wikipedia', 'academic', 'research', 'university', 'government'])]
        quality_score += len(credible_sources) * 20
        factors.append(f"Found {len(credible_sources)} credible sources")
    
    # Content depth analysis
    word_count = len(content.split())
    if word_count > 500:
        quality_score += 30
        factors.append("Comprehensive content depth")
    elif word_count > 200:
        quality_score += 15
        factors.append("Moderate content depth")
    
    # Structure analysis
    if any(indicator in content.lower() for indicator in 
        ['introduction', 'conclusion', 'summary', 'analysis', 'findings']):
        quality_score += 25
        factors.append("Well-structured content")
    
    # Data and evidence
    if any(indicator in content.lower() for indicator in 
        ['according to', 'research shows', 'data indicates', 'evidence suggests']):
        quality_score += 25
        factors.append("Evidence-based content")
    
    confidence_level = "high" if quality_score >= 70 else "medium" if quality_score >= 40 else "low"
    
    return {
        "quality_score": min(quality_score, 100),
        "confidence": confidence_level,
        "factors": factors
    }

@app.post("/analysis_agent", response_model=Response)
async def analysis_agent(
    message: Message, 
    api_key: str = Header(..., description="Your API key"),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    
    # Authentication and rate limiting
    user = get_api_user(api_key, db)
    check_rate_limit(user, db)
    
    # Generate request ID
    request_id = f"analysis_{int(time.time())}_{user.id[:8]}"
    
    try:
        # Perform content quality analysis
        quality_analysis = analyze_content_quality(message.content, message.sources)
        
        # Enhanced analysis prompt
        prompt = f"""You are an enterprise data analysis expert. Perform comprehensive analysis of the provided research content.

Research Content: {message.content}
Sources: {', '.join(message.sources) if message.sources else 'None provided'}
Content Quality Score: {quality_analysis['quality_score']}/100
Quality Factors: {', '.join(quality_analysis['factors'])}

Provide a detailed analysis including:

1. **Key Insights and Patterns**
   - Main themes and patterns identified
   - Critical information extracted
   - Relationships between concepts

2. **Information Quality Assessment**
   - Credibility evaluation of sources
   - Content completeness analysis
   - Identification of potential biases

3. **Gap Analysis**
   - Missing information or incomplete coverage
   - Areas requiring further investigation
   - Contradictions or inconsistencies found

4. **Strategic Insights**
   - Business implications (if applicable)
   - Actionable recommendations
   - Risk factors or considerations

5. **Confidence Assessment**
   - Overall confidence in findings (high/medium/low)
   - Limitations of the analysis
   - Recommendations for validation

Format your response as a professional analysis report with clear sections and bullet points."""

        response = model.invoke(prompt)
        
        # Extract insights from the response
        insights = [
            f"Content quality scored {quality_analysis['quality_score']}/100",
            f"Analysis confidence: {quality_analysis['confidence']}",
            f"Processed {len(message.sources)} sources",
            "Strategic insights generated",
            "Risk assessment completed"
        ]
        
        processing_time = int((time.time() - start_time) * 1000)
        tokens_used = len(response.content.split())
        
        # Log the request
        api_request = APIRequest(
            user_id=user.id,
            agent_type="analysis",
            input_data=f"Content length: {len(message.content)}, Sources: {len(message.sources)}",
            output_data=response.content[:1000],
            processing_time=processing_time,
            tokens_used=tokens_used,
            status="completed"
        )
        db.add(api_request)
        db.commit()
        
        return Response(
            content=response.content,
            insights=insights,
            confidence=quality_analysis['confidence'],
            request_id=request_id,
            processing_time=processing_time,
            tokens_used=tokens_used
        )
        
    except Exception as e:
        # Log failed request
        api_request = APIRequest(
            user_id=user.id,
            agent_type="analysis",
            input_data=f"Content length: {len(message.content)}",
            output_data=str(e),
            processing_time=int((time.time() - start_time) * 1000),
            status="failed"
        )
        db.add(api_request)
        db.commit()
        
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow(), "agent": "analysis"}

@app.get("/metrics")
async def get_metrics(api_key: str = Header(...), db: Session = Depends(get_db)):
    user = get_api_user(api_key, db)
    
    # Get user's analysis metrics
    total_requests = db.query(APIRequest).filter(
        APIRequest.user_id == user.id, 
        APIRequest.agent_type == "analysis"
    ).count()
    
    successful_requests = db.query(APIRequest).filter(
        APIRequest.user_id == user.id, 
        APIRequest.agent_type == "analysis",
        APIRequest.status == "completed"
    ).count()
    
    avg_processing_time = db.query(APIRequest.processing_time).filter(
        APIRequest.user_id == user.id,
        APIRequest.agent_type == "analysis",
        APIRequest.status == "completed"
    ).all()
    
    avg_time = sum([p[0] for p in avg_processing_time]) / len(avg_processing_time) if avg_processing_time else 0
    
    return {
        "user_id": user.id,
        "agent_type": "analysis",
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "success_rate": f"{(successful_requests/total_requests*100):.1f}%" if total_requests > 0 else "0%",
        "average_processing_time_ms": int(avg_time),
        "organization": user.organization.name if user.organization else "Individual"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
