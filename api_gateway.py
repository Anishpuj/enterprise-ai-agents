from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import asyncio
import json
import time
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db, User, Workflow, APIRequest
from auth import get_api_user, check_rate_limit
import uvicorn

app = FastAPI(title="Enterprise Agent Gateway", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class WorkflowRequest(BaseModel):
    workflow_id: str
    input_data: dict

class WorkflowResponse(BaseModel):
    workflow_id: str
    results: list
    total_processing_time: int
    request_id: str
    status: str

class AgentRequest(BaseModel):
    content: str
    sources: list = []
    insights: list = []
    workflow_id: str = None

class AgentResponse(BaseModel):
    content: str
    agent_type: str
    processing_time: int
    request_id: str

# Agent endpoints
AGENT_ENDPOINTS = {
    "research": "http://localhost:8001/research_agent",
    "analysis": "http://localhost:8002/analysis_agent", 
    "report": "http://localhost:8003/report_agent"
}

@app.post("/agent/{agent_type}", response_model=AgentResponse)
async def call_agent(
    agent_type: str,
    request: AgentRequest,
    api_key: str = Header(...),
    db: Session = Depends(get_db)
):
    if agent_type not in AGENT_ENDPOINTS:
        raise HTTPException(status_code=404, detail=f"Agent {agent_type} not found")
    
    user = get_api_user(api_key, db)
    check_rate_limit(user, db)
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Prepare request body based on agent type
            request_body = {"content": request.content}
            if agent_type == "analysis":
                request_body["sources"] = request.sources
            elif agent_type == "report":
                request_body["insights"] = request.insights
            
            response = await client.post(
                AGENT_ENDPOINTS[agent_type],
                json=request_body,
                headers={"api-key": api_key}
            )
            response.raise_for_status()
            result = response.json()
            
            return AgentResponse(
                content=result.get("content", ""),
                agent_type=agent_type,
                processing_time=result.get("processing_time", 0),
                request_id=result.get("request_id", "")
            )
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Agent service unavailable: {str(e)}")

@app.post("/workflow/{workflow_id}", response_model=WorkflowResponse)
async def execute_workflow(
    workflow_id: str,
    request: WorkflowRequest,
    api_key: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_api_user(api_key, db)
    check_rate_limit(user, db)
    
    # Get workflow definition
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.owner_id == user.id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    if not workflow.is_active:
        raise HTTPException(status_code=400, detail="Workflow is not active")
    
    try:
        agent_sequence = json.loads(workflow.agent_sequence)
        results = []
        total_time = 0
        request_id = f"workflow_{int(time.time())}_{user.id[:8]}"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            for agent_config in agent_sequence:
                agent_type = agent_config["type"]
                content = request.input_data.get("content", "")
                
                # Pass previous results to next agent if configured
                if agent_config.get("use_previous_result") and results:
                    content = results[-1]["content"]
                
                response = await client.post(
                    AGENT_ENDPOINTS[agent_type],
                    json={"content": content},
                    headers={"api-key": api_key}
                )
                response.raise_for_status()
                result = response.json()
                
                results.append({
                    "agent": agent_type,
                    "content": result.get("content", ""),
                    "processing_time": result.get("processing_time", 0),
                    "sources": result.get("sources", [])
                })
                
                total_time += result.get("processing_time", 0)
        
        return WorkflowResponse(
            workflow_id=workflow_id,
            results=results,
            total_processing_time=total_time,
            request_id=request_id,
            status="completed"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")

@app.get("/agents")
async def list_agents(api_key: str = Header(...)):
    user = get_api_user(api_key, db)
    return {
        "available_agents": list(AGENT_ENDPOINTS.keys()),
        "endpoints": AGENT_ENDPOINTS
    }

@app.get("/workflows")
async def list_workflows(api_key: str = Header(...), db: Session = Depends(get_db)):
    user = get_api_user(api_key, db)
    workflows = db.query(Workflow).filter(Workflow.owner_id == user.id).all()
    
    return {
        "workflows": [
            {
                "id": w.id,
                "name": w.name,
                "description": w.description,
                "is_active": w.is_active,
                "created_at": w.created_at
            }
            for w in workflows
        ]
    }

@app.post("/workflow")
async def create_workflow(
    workflow_data: dict,
    api_key: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_api_user(api_key, db)
    
    workflow = Workflow(
        owner_id=user.id,
        name=workflow_data["name"],
        description=workflow_data.get("description", ""),
        agent_sequence=json.dumps(workflow_data["agent_sequence"])
    )
    
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    
    return {"workflow_id": workflow.id, "status": "created"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": "api_gateway",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
