
# Live Transcription and Translation Extension

## Introduction
**TL (Translation Layer)** is a web application with both server and client components. The server is built using FastAPI, and the client is designed as a browser extension.

## Server
The server handles audio file processing and translation. It includes:
- `app.py`: The main FastAPI application.
- `translate.py`: Handles the translation process.
- `requirements.txt`: Lists all Python dependencies.
- `startup.sh` and `cleanup.sh`: Scripts for setup and cleanup.

### Installation
1. **Install dependencies** (preferably in a virtual environment):
   ```sh
   pip install -r requirements.txt
   ```
2. **Start the server**:
   ```sh
   ./startup.sh
   ```

## Client
The client is a browser extension that interacts with the server, including:
- `popup.html` and `popup.js`: Frontend interface.
- `manifest.json`: Browser extension configuration.

### Setup
Go to `chrome://extensions`, enable Developer Mode, and use the "Load unpacked" option to upload the client files.

## Usage
After setup, users can activate the browser extension while media plays in a tab. The client captures audio in chunks, sends them to the server, and displays translated text in a popup window.

## Contributing
This is a personal hobby project. Contributions are not actively sought.

## License
Licensed under CC0.

## Documentation
For FastAPI documentation, run the application and visit `http://127.0.0.1:8000/docs` or `/redoc`.

## TODO
- Nothing for now 

## Acknowledgements
Friends have commented on the output as:
- Ya it's actually pretty accurate
- THAFS JINDA GOOD

Thank you to Facebook Research for making the Seamless model because my own trained models kinda sucked and were not scalable to many languages! Yann LeCun is my hero.
