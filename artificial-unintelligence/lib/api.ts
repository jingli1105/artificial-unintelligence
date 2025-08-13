// TypeScript types matching FastAPI models
export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  answer: string;
  data?: Array<Record<string, unknown>> | null;
}

// API base URL - adjust this to match your FastAPI server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Mock data for testing
const MOCK_RESPONSES = [
  "I can help you analyze the transcript you uploaded. What specific information are you looking for? The document contains detailed discussions about various aspects of your project, including timelines, resource allocation, and strategic decisions that were made during the meeting.",
  "Based on the transcript, I found several key discussion points. The main topics covered were project timelines, budget considerations, and team responsibilities. The participants spent considerable time discussing implementation strategies and addressing potential challenges that could arise during the execution phase. There were also important decisions made regarding resource allocation and priority setting for different project components.",
  "The transcript shows that participants discussed implementation strategies and potential challenges in great detail. Would you like me to elaborate on any specific aspect? I noticed there were extensive conversations about technical requirements, stakeholder management, and risk mitigation strategies that could be particularly relevant to your current planning phase.",
  "From what I can see in the uploaded document, there were several action items and decisions made throughout the meeting. Let me break those down for you: First, the team established clear milestones and deadlines. Second, they allocated specific responsibilities to different team members. Third, they identified potential risks and developed mitigation strategies. Finally, they set up regular check-in meetings to monitor progress and address any issues that might arise.",
  "The conversation in the transcript covered both technical and business aspects of the project comprehensively. What particular area interests you most? I can provide detailed insights into the technical specifications discussed, the business requirements that were outlined, the budget constraints that were identified, or the timeline expectations that were established during this important planning session."
];

// Mock functions
async function mockUploadFile(file: File): Promise<void> {
  console.log('MOCK: Uploading file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  console.log('MOCK: File uploaded successfully');
}

async function mockQueryData(query: string): Promise<QueryResponse> {
  console.log('MOCK: Processing query:', query);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
  
  const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  return {
    answer: randomResponse,
    data: [
      { topic: "Budget", mentioned: true },
      { topic: "Timeline", mentioned: true },
      { topic: "Resources", mentioned: false }
    ]
  };
}

// Upload file to /upload endpoint
export async function uploadFile(file: File): Promise<void> {
  console.log('Uploading to:', `${API_BASE_URL}/upload`);
  console.log('File:', file.name, file.type, file.size);
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    console.log('Upload successful');
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.log('Server unavailable, using mock upload');
      return mockUploadFile(file);
    }
    throw error;
  }
}

// Query data from /query endpoint
export async function queryData(query: string): Promise<QueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Query failed: ${response.statusText}`);
    }

    return response.json() as Promise<QueryResponse>;
  } catch (error) {
    console.error('Query error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.log('Server unavailable, using mock query');
      return mockQueryData(query);
    }
    throw error;
  }
}