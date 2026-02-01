from fastapi import FastAPI, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from database import get_db, User, APIRequest, Organization
from auth import get_current_user
import json
from datetime import datetime, timedelta

app = FastAPI(title="Enterprise Agent Dashboard")

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    # This would require authentication in production
    # For demo, we'll show aggregated stats
    
    # Get overall stats
    total_users = db.query(User).count()
    total_requests = db.query(APIRequest).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    # Get requests in last 24 hours
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_requests = db.query(APIRequest).filter(APIRequest.created_at >= yesterday).count()
    
    # Get agent usage stats
    research_requests = db.query(APIRequest).filter(APIRequest.agent_type == "research").count()
    analysis_requests = db.query(APIRequest).filter(APIRequest.agent_type == "analysis").count()
    report_requests = db.query(APIRequest).filter(APIRequest.agent_type == "report").count()
    
    # Get organization stats
    org_stats = db.query(Organization).all()
    
    context = {
        "request": request,
        "total_users": total_users,
        "total_requests": total_requests,
        "active_users": active_users,
        "recent_requests": recent_requests,
        "research_requests": research_requests,
        "analysis_requests": analysis_requests,
        "report_requests": report_requests,
        "org_stats": org_stats,
        "timestamp": datetime.utcnow()
    }
    
    return templates.TemplateResponse("dashboard.html", context)

@app.get("/api/stats")
async def get_api_stats(db: Session = Depends(get_db)):
    # Return JSON stats for AJAX calls
    last_7_days = datetime.utcnow() - timedelta(days=7)
    
    daily_stats = []
    for i in range(7):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        requests_count = db.query(APIRequest).filter(
            APIRequest.created_at >= day_start,
            APIRequest.created_at <= day_end
        ).count()
        
        daily_stats.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "requests": requests_count
        })
    
    return {
        "daily_stats": daily_stats[::-1],  # Reverse to show oldest first
        "agent_distribution": {
            "research": db.query(APIRequest).filter(APIRequest.agent_type == "research").count(),
            "analysis": db.query(APIRequest).filter(APIRequest.agent_type == "analysis").count(),
            "report": db.query(APIRequest).filter(APIRequest.agent_type == "report").count()
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
