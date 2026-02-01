import asyncio
import httpx
import json
import time
from datetime import datetime

class EnterpriseAgentClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8080"):
        self.api_key = api_key
        self.base_url = base_url
        self.client = httpx.AsyncClient(
            headers={"api-key": api_key},
            timeout=60.0
        )
    
    async def research(self, query: str) -> dict:
        """Execute research agent"""
        response = await self.client.post(
            f"{self.base_url}/agent/research",
            json={"content": query}
        )
        response.raise_for_status()
        return response.json()
    
    async def analyze(self, content: str, sources: list = None) -> dict:
        """Execute analysis agent"""
        response = await self.client.post(
            f"{self.base_url}/agent/analysis",
            json={"content": content, "sources": sources or []}
        )
        response.raise_for_status()
        return response.json()
    
    async def report(self, content: str, insights: list = None) -> dict:
        """Execute report agent"""
        response = await self.client.post(
            f"{self.base_url}/agent/report",
            json={"content": content, "insights": insights or []}
        )
        response.raise_for_status()
        return response.json()
    
    async def full_research_pipeline(self, query: str) -> dict:
        """Execute complete research pipeline"""
        print(f"🔍 Starting research for: {query}")
        
        # Step 1: Research
        print("📚 Step 1: Research Agent...")
        research_result = await self.research(query)
        print(f"✅ Research completed in {research_result['processing_time']}ms")
        
        # Step 2: Analysis
        print("🧠 Step 2: Analysis Agent...")
        analysis_result = await self.analyze(
            research_result['content'], 
            research_result['sources']
        )
        print(f"✅ Analysis completed in {analysis_result['processing_time']}ms")
        
        # Step 3: Report
        print("📄 Step 3: Report Agent...")
        report_result = await self.report(
            analysis_result['content'],
            analysis_result['insights']
        )
        print(f"✅ Report completed in {report_result['processing_time']}ms")
        
        total_time = (
            research_result['processing_time'] + 
            analysis_result['processing_time'] + 
            report_result['processing_time']
        )
        
        return {
            "query": query,
            "research": research_result,
            "analysis": analysis_result,
            "report": report_result,
            "total_processing_time": total_time,
            "timestamp": datetime.now().isoformat()
        }
    
    async def create_workflow(self, name: str, description: str, agent_sequence: list) -> str:
        """Create a custom workflow"""
        response = await self.client.post(
            f"{self.base_url}/workflow",
            json={
                "name": name,
                "description": description,
                "agent_sequence": agent_sequence
            }
        )
        response.raise_for_status()
        return response.json()["workflow_id"]
    
    async def execute_workflow(self, workflow_id: str, input_data: dict) -> dict:
        """Execute a custom workflow"""
        response = await self.client.post(
            f"{self.base_url}/workflow/{workflow_id}",
            json={"input_data": input_data}
        )
        response.raise_for_status()
        return response.json()
    
    async def get_metrics(self) -> dict:
        """Get usage metrics"""
        response = await self.client.get(f"{self.base_url}/metrics")
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        await self.client.aclose()

async def main():
    # Demo API key (in production, this would be securely stored)
    api_key = "demo-api-key-12345"
    
    client = EnterpriseAgentClient(api_key)
    
    try:
        print("🚀 Enterprise Agent Client Demo")
        print("=" * 50)
        
        # Interactive mode
        while True:
            print("\nOptions:")
            print("1. Research Query")
            print("2. Create Custom Workflow")
            print("3. View Metrics")
            print("4. Exit")
            
            choice = input("\nSelect option (1-4): ").strip()
            
            if choice == "1":
                query = input("Enter your research query: ")
                result = await client.full_research_pipeline(query)
                
                print(f"\n📋 FINAL REPORT:")
                print("=" * 50)
                print(result["report"]["content"])
                print("=" * 50)
                print(f"⏱️ Total time: {result['total_processing_time']}ms")
                
            elif choice == "2":
                name = input("Workflow name: ")
                description = input("Description: ")
                
                print("Available agents: research, analysis, report")
                sequence = input("Agent sequence (comma-separated): ").strip()
                agent_sequence = [
                    {"type": agent.strip(), "use_previous_result": i > 0}
                    for i, agent in enumerate(sequence.split(","))
                ]
                
                workflow_id = await client.create_workflow(name, description, agent_sequence)
                print(f"✅ Workflow created with ID: {workflow_id}")
                
            elif choice == "3":
                metrics = await client.get_metrics()
                print(f"\n📊 Your Metrics:")
                print(f"Total requests: {metrics['total_requests']}")
                print(f"Success rate: {metrics['success_rate']}")
                print(f"Avg processing time: {metrics['average_processing_time_ms']}ms")
                print(f"Organization: {metrics['organization']}")
                
            elif choice == "4":
                break
                
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())
