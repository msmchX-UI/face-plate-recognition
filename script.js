const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');

// Function to start the back camera directly
function startBackCamera() {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // 'environment' for back camera
    }).then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;
        };
    }).catch(error => {
        console.error('Error accessing the camera:', error);
        alert('Could not access the camera. Please check permissions.');
    });
}

// Start the back camera immediately
startBackCamera();

// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(() => {
    console.log('Face-api.js models loaded successfully');
});