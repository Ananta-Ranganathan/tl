Live Transcription and Translation Extension

Introduction
TL (short for Translation Layer) is a web application comprising both server and client components. The server is built with FastAPI and Flask, while the client is designed as a browser extension.

Server
The server side of TL handles audio file processing and translation. It includes a FastAPI application (app.py) which receives audio files, processes them, and returns translated text. Key components include:

app.py: The main FastAPI application.
translate.py: Module for handling the translation process.
requirements.txt: Lists all Python dependencies.
startup.sh and cleanup.sh: Scripts for setting up and cleaning up the server environment.
Installation
Install dependencies (should do this in a virtualenv obviously):
pip install -r requirements.txt
Start the server:
./startup.sh


Client
The client is a browser extension that interacts with the server. It includes:

popup.html and popup.js: The frontend interface for interacting with the server.
manifest.json: Configuration file for the browser extension.

Go to ://extensions and click the load unpacked thingy (might have to turn on developer mode or something) and then upload the client files and it should be able to run in your browser

Usage
After setting up both server and client components, users can load the browser extension and click on its icon in the toolbar while any media is playing in a tab. The client will automatically capture the audio in chunks and upload them to the backend. The server processes these files and returns translated text for the client to render in the popup window.

Contributing
This is just a hobby project I made for my own use watching video game streams and news broadcasts... no real reason for anyone else to contribute

License
CC0 I guess I don't really care

For the FastAPI auto-generated documentation, simply run your FastAPI application and navigate to /docs or /redoc on your local server (like http://127.0.0.1:8000/docs). These endpoints provide interactive API documentation and alternative ReDoc documentation, respectively.

