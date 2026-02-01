import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { getMetrics } from '../services/api';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Mock data for charts (in real app, this would come from API)
  const usageData = [
    { name: 'Mon', requests: 45, success: 42 },
    { name: 'Tue', requests: 52, success: 50 },
    { name: 'Wed', requests: 38, success: 36 },
    { name: 'Thu', requests: 65, success: 63 },
    { name: 'Fri', requests: 48, success: 47 },
    { name: 'Sat', requests: 30, success: 29 },
    { name: 'Sun', requests: 25, success: 24 },
  ];

  const agentUsage = [
    { name: 'Research Agent', value: 45, color: '#3b82f6' },
    { name: 'Analysis Agent', value: 30, color: '#10b981' },
    { name: 'Report Agent', value: 25, color: '#f59e0b' },
  ];

  const responseTimeData = [
    { time: '00:00', time_ms: 15000 },
    { time: '04:00', time_ms: 12000 },
    { time: '08:00', time_ms: 18000 },
    { time: '12:00', time_ms: 22000 },
    { time: '16:00', time_ms: 20000 },
    { time: '20:00', time_ms: 16000 },
    { time: '23:59', time_ms: 14000 },
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
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary">Generate Report</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.total_requests || 0}</p>
              <p className="text-xs text-green-600">+12% from last week</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.success_rate || '0%'}</p>
              <p className="text-xs text-green-600">+2% improvement</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.average_processing_time_ms || 0}ms</p>
              <p className="text-xs text-yellow-600">-5% faster</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-xs text-gray-600">Demo account</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <div className="agent-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#3b82f6" name="Total Requests" />
              <Bar dataKey="success" fill="#10b981" name="Successful" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Usage Pie Chart */}
        <div className="agent-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agentUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {agentUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="agent-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="time_ms" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Response Time (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Stats Table */}
      <div className="agent-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Research Agent
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  45
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  97.8%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15.7s
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Analysis Agent
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  30
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  96.7%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  23.3s
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Report Agent
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  25
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  100%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  20.7s
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
