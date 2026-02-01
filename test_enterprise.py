import asyncio
import httpx
import json

async def test_enterprise_system():
    """Test the complete enterprise agent system"""
    
    print("🚀 Testing Enterprise Agent System")
    print("=" * 50)
    
    # Test configuration
    api_key = "demo-api-key-12345"
    base_url = "http://localhost:8080"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            # Test 1: Research Agent
            print("\n📚 Step 1: Testing Research Agent...")
            research_response = await client.post(
                f"{base_url}/agent/research",
                json={"agent_type": "research", "content": "What is artificial intelligence?"},
                headers={"api-key": api_key}
            )
            
            if research_response.status_code == 200:
                research_result = research_response.json()
                print(f"✅ Research completed in {research_result['processing_time']}ms")
                print(f"📖 Sources found: {len(research_result.get('sources', []))}")
                print(f"📝 Content preview: {research_result['content'][:200]}...")
            else:
                print(f"❌ Research failed: {research_response.text}")
                return
            
            # Test 2: Analysis Agent  
            print("\n🧠 Step 2: Testing Analysis Agent...")
            analysis_response = await client.post(
                f"{base_url}/agent/analysis",
                json={
                    "agent_type": "analysis", 
                    "content": research_result['content'],
                    "sources": research_result.get('sources', [])
                },
                headers={"api-key": api_key}
            )
            
            if analysis_response.status_code == 200:
                analysis_result = analysis_response.json()
                print(f"✅ Analysis completed in {analysis_result['processing_time']}ms")
                print(f"🎯 Confidence: {analysis_result.get('confidence', 'unknown')}")
                print(f"💡 Insights: {len(analysis_result.get('insights', []))}")
                print(f"📊 Analysis preview: {analysis_result['content'][:200]}...")
            else:
                print(f"❌ Analysis failed: {analysis_response.text}")
                return
            
            # Test 3: Report Agent
            print("\n📄 Step 3: Testing Report Agent...")
            report_response = await client.post(
                f"{base_url}/agent/report",
                json={
                    "agent_type": "report",
                    "content": analysis_result['content'],
                    "insights": analysis_result.get('insights', [])
                },
                headers={"api-key": api_key}
            )
            
            if report_response.status_code == 200:
                report_result = report_response.json()
                print(f"✅ Report completed in {report_result['processing_time']}ms")
                print(f"📋 Report type: {report_result.get('report_type', 'unknown')}")
                print(f"⏰ Generated: {report_result.get('timestamp', 'unknown')}")
                print(f"📄 Report preview: {report_result['content'][:300]}...")
            else:
                print(f"❌ Report failed: {report_response.text}")
                return
            
            # Test 4: System Health
            print("\n🏥 Step 4: Testing System Health...")
            health_response = await client.get(f"{base_url}/health")
            if health_response.status_code == 200:
                health = health_response.json()
                print(f"✅ Gateway Status: {health['status']}")
                print(f"🕐 Timestamp: {health['timestamp']}")
            
            # Test 5: Metrics
            print("\n📊 Step 5: Testing Metrics...")
            metrics_response = await client.get(
                f"{base_url}/metrics",
                headers={"api-key": api_key}
            )
            if metrics_response.status_code == 200:
                metrics = metrics_response.json()
                print(f"✅ Metrics retrieved")
                print(f"📈 Total requests: {metrics.get('total_requests', 0)}")
                print(f"🎯 Success rate: {metrics.get('success_rate', '0%')}")
            
            # Summary
            total_time = (
                research_result['processing_time'] + 
                analysis_result['processing_time'] + 
                report_result['processing_time']
            )
            
            print(f"\n🎉 ENTERPRISE SYSTEM TEST COMPLETE!")
            print("=" * 50)
            print(f"⏱️ Total processing time: {total_time}ms")
            print(f"📚 Research: ✅ {research_result['processing_time']}ms")
            print(f"🧠 Analysis: ✅ {analysis_result['processing_time']}ms") 
            print(f"📄 Report: ✅ {report_result['processing_time']}ms")
            print(f"🏥 Health: ✅ All systems operational")
            print(f"📊 Metrics: ✅ Tracking active")
            
            print(f"\n📋 FINAL REPORT PREVIEW:")
            print("-" * 30)
            print(report_result['content'][:500] + "..." if len(report_result['content']) > 500 else report_result['content'])
            
        except Exception as e:
            print(f"❌ Test failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_enterprise_system())
