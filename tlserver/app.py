from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from translate import translate
import os
import subprocess
from typing import Optional
import uuid


# app = Flask(__name__)
# CORS(app)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@asynccontextmanager
async def lifespan(app: FastAPI):
   yield
   subprocess.run(["./cleanup.sh"])

@app.get("/")
async def root():
    return "TL Server"

@app.post("/translate")
async def translate_file(file: Optional[UploadFile] = File(None), language: str = Form(...)):
    if file is None:
        raise HTTPException(status_code=400, detail="No file found")
    file_uuid = str(uuid.uuid4())
    original_file_path = f"original{file_uuid}.webm"
    converted_file_path = f"converted{file_uuid}.wav"

    # Save the file
    try:
        with open(original_file_path, "wb") as buffer:
            buffer.write(await file.read())
    except Exception as e:
        print(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Error saving file")
    
    # Convert the file using FFmpeg
    try:
        subprocess.run(["ffmpeg", "-y", "-f", "webm", "-i", original_file_path, "-acodec", "pcm_s16le", converted_file_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error during file conversion: {e}")
        raise HTTPException(status_code=500, detail="Error during file conversion")
    
    # Ensure the converted file exists
    if not os.path.exists(converted_file_path):
        print(f"Converted file {converted_file_path} does not exist")
        raise HTTPException(status_code=500, detail="File not found after conversion")
    
    # Process the converted file for translation
    try:
        translated_text = await translate(converted_file_path, language)
    except Exception as e:
        print(f"Error during translation: {e}")
        raise HTTPException(status_code=500, detail="Error during translation")
    
    # Delete the files
    try:
        os.remove(original_file_path)
        os.remove(converted_file_path)
    except Exception as e:
        print(f"Error deleting files: {e}")
    
    return {"translatedText": translated_text}

if __name__ == '__main__':
    app.run(port=8000, debug=True, threaded=True)
