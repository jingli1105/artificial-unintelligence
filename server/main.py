from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    data: Optional[List[Dict[str, Any]]] = None

@app.post("/upload", status_code=201)
async def upload_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")
    print(f"Content type: {file.content_type}")
    print(f"File size: {file.size}")
    
    # Here you would process the file
    # For now, just return success
    return {"message": f"File {file.filename} uploaded successfully"}

@app.post("/query", response_model=QueryResponse)
async def query_data(request: QueryRequest):
    print(f"Received query: {request.query}")
    
    # Mock response - replace with your actual logic
    return QueryResponse(
        answer=f"I received your query: '{request.query}'. This is a mock response from the server.",
        data=[{"example": "data"}]
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)