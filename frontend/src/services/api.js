import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const API_KEY = 'demo-api-key-12345';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || error.message);
  }
);

// API Functions
export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const researchAgent = async (query) => {
  const response = await api.post('/agent/research', {
    content: query,
  });
  return response.data;
};

export const analysisAgent = async (content, sources = []) => {
  const response = await api.post('/agent/analysis', {
    content,
    sources,
  });
  return response.data;
};

export const reportAgent = async (content, insights = []) => {
  const response = await api.post('/agent/report', {
    content,
    insights,
  });
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getAgents = async () => {
  const response = await api.get('/agents');
  return response.data;
};

export const createWorkflow = async (workflowData) => {
  const response = await api.post('/workflow', workflowData);
  return response.data;
};

export const getWorkflows = async () => {
  const response = await api.get('/workflows');
  return response.data;
};

export const executeWorkflow = async (workflowId, inputData) => {
  const response = await api.post(`/workflow/${workflowId}`, { inputData });
  return response.data;
};

export default api;
