import React, { useState } from 'react';
import { Search, Send, FileText, Brain, Download, Loader2 } from 'lucide-react';
import { researchAgent, analysisAgent, reportAgent } from '../services/api';
import { generatePDFReport } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

const Research = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const steps = [
    { name: 'Research', icon: Search, description: 'Gathering information from web sources' },
    { name: 'Analysis', icon: Brain, description: 'Analyzing content quality and extracting insights' },
    { name: 'Report', icon: FileText, description: 'Generating professional report' },
  ];

  const handleResearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a research query');
      return;
    }

    setLoading(true);
    setResults(null);
    setActiveStep(0);

    try {
      // Step 1: Research
      setActiveStep(0);
      const researchResult = await researchAgent(query);
      
      // Step 2: Analysis
      setActiveStep(1);
      const analysisResult = await analysisAgent(
        researchResult.content,
        researchResult.sources
      );
      
      // Step 3: Report
      setActiveStep(2);
      const reportResult = await reportAgent(
        analysisResult.content,
        analysisResult.insights
      );

      setResults({
        research: researchResult,
        analysis: analysisResult,
        report: reportResult,
      });

      toast.success('Research completed successfully!');
    } catch (error) {
      toast.error('Research failed: ' + error.message);
    } finally {
      setLoading(false);
      setActiveStep(0);
    }
  };

  const handleDownloadPDF = async () => {
    if (!results) {
      toast.error('No research results to download');
      return;
    }

    setDownloadingPDF(true);
    try {
      const fileName = await generatePDFReport(results, query);
      toast.success(`PDF report downloaded: ${fileName}`);
    } catch (error) {
      toast.error('Failed to generate PDF: ' + error.message);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const suggestions = [
    'What is machine learning?',
    'Latest trends in artificial intelligence',
    'How does quantum computing work?',
    'Impact of AI on job market',
    'Future of renewable energy',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Research Platform</h1>
        {results && (
          <button 
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="btn-primary flex items-center space-x-2"
          >
            {downloadingPDF ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download Full Report</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="agent-card">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="Enter your research query..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleResearch}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <div className="loading-spinner h-5 w-5"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span>{loading ? 'Processing...' : 'Research'}</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Suggested queries:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {loading && (
        <div className="agent-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Steps</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-primary-600'
                      : 'bg-gray-300'
                  }`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {isActive && (
                    <div className="loading-spinner h-5 w-5"></div>
                  )}
                  {isCompleted && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Research Complete!</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your comprehensive report is ready. Total processing time: {
                    (results.research?.processing_time || 0) + 
                    (results.analysis?.processing_time || 0) + 
                    (results.report?.processing_time || 0)
                  }ms
                </p>
              </div>
              <button 
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="btn-primary flex items-center space-x-2"
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Research Results */}
          <div className="agent-card">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Research Results</h3>
              <span className="text-sm text-gray-500">
                ({results.research.processing_time}ms)
              </span>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {results.research.content}
              </div>
            </div>
            {results.research.sources && results.research.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Sources:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {results.research.sources.map((source, index) => (
                    <li key={index}>• {source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="agent-card">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Analysis</h3>
              <span className="text-sm text-gray-500">
                ({results.analysis.processing_time}ms)
              </span>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {results.analysis.content}
              </div>
            </div>
            {results.analysis.insights && results.analysis.insights.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Insights:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {results.analysis.insights.map((insight, index) => (
                    <li key={index}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Report Results */}
          <div className="agent-card">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Final Report</h3>
              <span className="text-sm text-gray-500">
                ({results.report.processing_time}ms)
              </span>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {results.report.content}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Generated: {results.report.timestamp}
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloadingPDF}
                  className="btn-secondary text-sm flex items-center space-x-2"
                >
                  {downloadingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                <button className="btn-secondary text-sm">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
