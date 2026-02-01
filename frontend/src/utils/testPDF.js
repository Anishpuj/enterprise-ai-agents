// Test PDF functionality
import { generatePDFReport } from './pdfGenerator';

// Mock data for testing
const mockResults = {
  research: {
    content: "This is a test research content about artificial intelligence and its applications in modern technology.",
    processing_time: 15000,
    request_id: "test_req_123",
    sources: ["https://example.com/source1", "https://example.com/source2"]
  },
  analysis: {
    content: "Analysis of the research content reveals several key insights about AI technology trends and future developments.",
    processing_time: 23000,
    confidence: "high",
    insights: ["AI is rapidly evolving", "Machine learning is key", "Ethical considerations important"]
  },
  report: {
    content: "Executive Summary:\n\nThis comprehensive report analyzes the current state of artificial intelligence technology and its impact on various industries. The research indicates significant growth in AI adoption across multiple sectors.\n\nKey Findings:\n- AI technology is advancing rapidly\n- Industry adoption is increasing\n- Ethical considerations are becoming more important\n\nRecommendations:\n1. Invest in AI research and development\n2. Focus on ethical AI implementation\n3. Monitor regulatory developments",
    processing_time: 20000,
    report_type: "comprehensive",
    timestamp: new Date().toISOString()
  }
};

export const testPDFGeneration = async () => {
  try {
    console.log('Testing PDF generation...');
    const fileName = await generatePDFReport(mockResults, "Test Query: What is AI?");
    console.log('PDF generated successfully:', fileName);
    return fileName;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};
