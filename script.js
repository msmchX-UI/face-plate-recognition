const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');
const selectFrontCamera = document.getElementById('selectFrontCamera');
const selectBackCamera = document.getElementById('selectBackCamera');

// Function to request camera access based on the selected facingMode
function requestCameraPermission(facingMode) {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode } // 'user' for front camera, 'environment' for back camera
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

// Event listeners for camera selection buttons
selectFrontCamera.addEventListener('click', () => {
    requestCameraPermission('user'); // Front-facing camera
});

selectBackCamera.addEventListener('click', () => {
    requestCameraPermission('environment'); // Rear-facing camera
});

// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(() => {
    console.log('Face-api.js models loaded successfully');
});