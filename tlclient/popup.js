let isRecording = false;
const options = { mimeType: 'audio/webm' };
let stream;
let intervalId = null;
const MAX_TRANSCRIPT_LENGTH = 500;
const translatedTextElement = document.getElementById('translatedText');
const languageDropdown = document.getElementById('languageDropdown');

function sendAudio(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    const selectedLanguage = languageDropdown.value;
    formData.append('language', selectedLanguage);

    fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data received");
        console.log(data);
        if (data.translatedText) {
            translatedTextElement.textContent += data.translatedText + " "
            if (translatedTextElement.textContent.length > MAX_TRANSCRIPT_LENGTH) {
                translatedTextElement.textContent = data.translatedText + " "
            }
        };
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function startRecordingChunk() {
    if (stream && isRecording) {
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                console.log("Sending audio chunk");
                sendAudio(event.data);
            }
        };

        mediaRecorder.start(6000);

        setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }, 6000);

        console.log("Started recording chunk");
    }
}

document.getElementById('startButton').addEventListener('click', function() {
    if (isRecording) return;
    isRecording = true;
    console.log("Starting");
    translatedTextElement.textContent = "Transcribing!" + "\n";

    chrome.tabCapture.capture({ audio: true, video: false }, function(capturedStream) {
        if (capturedStream) {
            stream = capturedStream;
            const audio = new Audio();
            audio.srcObject = capturedStream;
            audio.play();
            startRecordingChunk();
            intervalId = setInterval(startRecordingChunk, 6000);
        } else if (chrome.runtime.lastError) {
            console.error('Error capturing tab:', chrome.runtime.lastError);
        }
    });
});

document.getElementById('clearButton').addEventListener('click', function() {
    if (!isRecording) return;
    translatedTextElement.textContent = "Transcribing!" + "\n";
});
