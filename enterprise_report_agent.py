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

app = FastAPI(title="Enterprise Report Agent API", version="2.0.0")

class Message(BaseModel):
    content: str
    insights: list = []

class Response(BaseModel):
    content: str
    report_type: str = "comprehensive_analysis"
    timestamp: str = ""
    request_id: str = ""
    processing_time: int = 0
    tokens_used: int = 0

model = ChatOllama(model="llama3.2")

def generate_report_metadata(content: str, insights: list) -> dict:
    """Generate enterprise report metadata"""
    word_count = len(content.split())
    sections = []
    
    # Identify report sections
    content_lower = content.lower()
    if 'executive summary' in content_lower:
        sections.append('Executive Summary')
    if 'key findings' in content_lower or 'findings' in content_lower:
        sections.append('Key Findings')
    if 'analysis' in content_lower:
        sections.append('Analysis')
    if 'conclusions' in content_lower:
        sections.append('Conclusions')
    if 'recommendations' in content_lower:
        sections.append('Recommendations')
    
    # Determine report complexity
    complexity = "comprehensive" if word_count > 800 else "detailed" if word_count > 400 else "summary"
    
    return {
        "word_count": word_count,
        "sections": sections,
        "complexity": complexity,
        "insights_count": len(insights),
        "estimated_read_time": f"{word_count // 200 + 1} min"
    }

@app.post("/report_agent", response_model=Response)
async def report_agent(
    message: Message, 
    api_key: str = Header(..., description="Your API key"),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    
    # Authentication and rate limiting
    user = get_api_user(api_key, db)
    check_rate_limit(user, db)
    
    # Generate request ID
    request_id = f"report_{int(time.time())}_{user.id[:8]}"
    
    try:
        # Generate report metadata
        metadata = generate_report_metadata(message.content, message.insights)
        
        # Enhanced report generation prompt
        prompt = f"""You are an enterprise report writer. Create a professional, comprehensive report based on the provided analysis.

Analysis Content: {message.content}
Key Insights: {', '.join(message.insights) if message.insights else 'None provided'}
Report Complexity: {metadata['complexity']}
Word Count Target: {metadata['word_count'] + 200}  # Expand for comprehensive coverage

Create a professional enterprise report with the following structure:

1. **EXECUTIVE SUMMARY**
   - Brief overview of key findings
   - Main conclusions and implications
   - Critical recommendations (3-5 bullet points)

2. **KEY FINDINGS**
   - Detailed presentation of main discoveries
   - Data-driven insights with supporting evidence
   - Comparative analysis or benchmarks where relevant

3. **DETAILED ANALYSIS**
   - Methodology and approach used
   - In-depth examination of patterns and trends
   - Risk assessment and mitigation strategies

4. **CONCLUSIONS**
   - Summary of analytical results
   - Business implications and impact assessment
   - Limitations and constraints identified

5. **RECOMMENDATIONS**
   - Actionable next steps (prioritized by impact)
   - Resource requirements and timelines
   - Success metrics and KPIs for implementation

6. **APPENDICES** (if applicable)
   - Technical details and data sources
   - Additional supporting documentation
   - Glossary of terms

Report Requirements:
- Professional business tone and formatting
- Clear headings and subheadings
- Bullet points for key information
- Data-driven statements where possible
- Action-oriented language in recommendations
- Total length: {metadata['word_count'] + 200}-{metadata['word_count'] + 500} words

Format the report for executive-level audience with clarity and precision."""

        response = model.invoke(prompt)
        
        processing_time = int((time.time() - start_time) * 1000)
        tokens_used = len(response.content.split())
        
        # Log the request
        api_request = APIRequest(
            user_id=user.id,
            agent_type="report",
            input_data=f"Analysis length: {len(message.content)}, Insights: {len(message.insights)}",
            output_data=response.content[:1000],
            processing_time=processing_time,
            tokens_used=tokens_used,
            status="completed"
        )
        db.add(api_request)
        db.commit()
        
        return Response(
            content=response.content,
            report_type=metadata['complexity'],
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            request_id=request_id,
            processing_time=processing_time,
            tokens_used=tokens_used
        )
        
    except Exception as e:
        # Log failed request
        api_request = APIRequest(
            user_id=user.id,
            agent_type="report",
            input_data=f"Analysis length: {len(message.content)}",
            output_data=str(e),
            processing_time=int((time.time() - start_time) * 1000),
            status="failed"
        )
        db.add(api_request)
        db.commit()
        
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow(), "agent": "report"}

@app.get("/metrics")
async def get_metrics(api_key: str = Header(...), db: Session = Depends(get_db)):
    user = get_api_user(api_key, db)
    
    # Get user's report metrics
    total_requests = db.query(APIRequest).filter(
        APIRequest.user_id == user.id, 
        APIRequest.agent_type == "report"
    ).count()
    
    successful_requests = db.query(APIRequest).filter(
        APIRequest.user_id == user.id, 
        APIRequest.agent_type == "report",
        APIRequest.status == "completed"
    ).count()
    
    avg_processing_time = db.query(APIRequest.processing_time).filter(
        APIRequest.user_id == user.id,
        APIRequest.agent_type == "report",
        APIRequest.status == "completed"
    ).all()
    
    avg_time = sum([p[0] for p in avg_processing_time]) / len(avg_processing_time) if avg_processing_time else 0
    
    return {
        "user_id": user.id,
        "agent_type": "report",
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "success_rate": f"{(successful_requests/total_requests*100):.1f}%" if total_requests > 0 else "0%",
        "average_processing_time_ms": int(avg_time),
        "organization": user.organization.name if user.organization else "Individual"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
