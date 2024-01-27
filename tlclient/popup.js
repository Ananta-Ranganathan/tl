let isRecording = false;
const options = { mimeType: 'audio/webm' };
let stream;
let intervalId = null; // To manage the interval

function sendAudio(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');

    fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data received");
        console.log(data);
        document.getElementById('translatedText').textContent += data.translatedText + " ";
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

        mediaRecorder.start(6000); // Start recording for 5 seconds

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
    document.getElementById('translatedText').textContent = "Transcribing..." + "\n";

    chrome.tabCapture.capture({ audio: true, video: false }, function(capturedStream) {
        if (capturedStream) {
            stream = capturedStream;
            const audio = new Audio();
            audio.srcObject = capturedStream;
            audio.play();
            startRecordingChunk();
            intervalId = setInterval(startRecordingChunk, 6000); // Start a new chunk every 6 seconds
        } else if (chrome.runtime.lastError) {
            console.error('Error capturing tab:', chrome.runtime.lastError);
        }
    });
});

document.getElementById('clearButton').addEventListener('click', function() {
    if (!isRecording) return;
    document.getElementById('translatedText').textContent = "Transcribing..." + "\n";
});
