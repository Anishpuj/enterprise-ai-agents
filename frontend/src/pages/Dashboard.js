import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, BookOpen, Zap, Shield, Database, Globe, FileText, Brain, TrendingUp, Info, Cpu, Network } from 'lucide-react';
import { getMetrics } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const statCards = [
    {
      title: 'Total Requests',
      value: metrics?.total_requests || 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Success Rate',
      value: metrics?.success_rate || '0%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Response Time',
      value: `${metrics?.average_processing_time_ms || 0}ms`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Organization',
      value: metrics?.organization || 'Demo',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const agents = [
    {
      name: 'Research Agent',
      status: 'active',
      port: 8001,
      description: 'Web search and information gathering',
      lastRequest: '2 minutes ago',
    },
    {
      name: 'Analysis Agent',
      status: 'active',
      port: 8002,
      description: 'Content analysis and insights',
      lastRequest: '5 minutes ago',
    },
    {
      name: 'Report Agent',
      status: 'active',
      port: 8003,
      description: 'Professional report generation',
      lastRequest: '8 minutes ago',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium text-gray-700">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works Section */}
      <div className="agent-card">
        <div className="flex items-center space-x-2 mb-6">
          <Info className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">How It Works</h2>
        </div>
        
        <div className="space-y-8">
          {/* Architecture Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Network className="h-5 w-5 mr-2 text-primary-600" />
              System Architecture
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                    <Globe className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <h4 className="font-semibold text-gray-900">Frontend</h4>
                    <p className="text-sm text-gray-600 mt-1">React Web App</p>
                    <p className="text-xs text-gray-500">Port 3000</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                    <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h4 className="font-semibold text-gray-900">API Gateway</h4>
                    <p className="text-sm text-gray-600 mt-1">Authentication & Routing</p>
                    <p className="text-xs text-gray-500">Port 8080</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                    <Cpu className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-900">AI Agents</h4>
                    <p className="text-sm text-gray-600 mt-1">Multi-Agent System</p>
                    <p className="text-xs text-gray-500">Ports 8001-8003</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Process */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary-600" />
              AI Research Workflow
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Research Agent</h4>
                  <p className="text-sm text-gray-600 mt-1">Performs web searches using DuckDuckGo and Wikipedia to gather comprehensive information about your query.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Web Search</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Data Collection</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Source Verification</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Analysis Agent</h4>
                  <p className="text-sm text-gray-600 mt-1">Analyzes the research findings for quality, extracts key insights, and provides confidence levels.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Quality Assessment</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Insight Extraction</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confidence Scoring</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Report Agent</h4>
                  <p className="text-sm text-gray-600 mt-1">Generates a professional, structured report with executive summary, findings, and recommendations.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Report Generation</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Executive Summary</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">PDF Export</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary-600" />
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Enterprise Security</h4>
                  <p className="text-sm text-gray-600">API key authentication, rate limiting, and request logging</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Database className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Data Persistence</h4>
                  <p className="text-sm text-gray-600">SQLite database for users, requests, and audit trails</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">PDF Export</h4>
                  <p className="text-sm text-gray-600">Professional PDF reports with comprehensive formatting</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Analytics Dashboard</h4>
                  <p className="text-sm text-gray-600">Real-time metrics and performance monitoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Technology Stack
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Backend</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>FastAPI:</strong> High-performance web framework</li>
                    <li>• <strong>LangChain:</strong> LLM integration framework</li>
                    <li>• <strong>Ollama:</strong> Local LLM server (llama3.2)</li>
                    <li>• <strong>SQLAlchemy:</strong> Database ORM</li>
                    <li>• <strong>JWT:</strong> Authentication tokens</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Frontend</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>React 18:</strong> Modern UI framework</li>
                    <li>• <strong>Tailwind CSS:</strong> Utility-first styling</li>
                    <li>• <strong>Lucide Icons:</strong> Beautiful icon library</li>
                    <li>• <strong>Recharts:</strong> Data visualization</li>
                    <li>• <strong>jsPDF:</strong> PDF generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary-600" />
              Quick Start Guide
            </h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-xs mr-3">1</span>
                  <span>Navigate to the <strong>Research</strong> page from the navigation menu</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-xs mr-3">2</span>
                  <span>Enter your research query in the input field (e.g., "What is quantum computing?")</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-xs mr-3">3</span>
                  <span>Click "Start Research" and watch the AI agents process your request</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-xs mr-3">4</span>
                  <span>Review the comprehensive report with research, analysis, and insights</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-xs mr-3">5</span>
                  <span>Download the professional PDF report for sharing and documentation</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Status */}
      <div className="agent-card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Agent Status</h2>
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`h-3 w-3 rounded-full ${
                  agent.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <h3 className="font-medium text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Port {agent.port}</p>
                <p className="text-xs text-gray-400">{agent.lastRequest}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="agent-card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Research completed</p>
              <p className="text-xs text-gray-500">Query: "What is artificial intelligence?"</p>
            </div>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Analysis completed</p>
              <p className="text-xs text-gray-500">Quality assessment and insights generated</p>
            </div>
            <span className="text-xs text-gray-400">5 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Report generated</p>
              <p className="text-xs text-gray-500">Executive summary created</p>
            </div>
            <span className="text-xs text-gray-400">8 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
