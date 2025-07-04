const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');
const frontCameraBtn = document.getElementById('frontCameraBtn');
const backCameraBtn = document.getElementById('backCameraBtn');

// Function to start the camera with the specified facingMode
function startCamera(facingMode) {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode } // 'user' for front, 'environment' for back
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

// Event listeners for button clicks
frontCameraBtn.addEventListener('click', () => {
    startCamera('user'); // Front-facing camera
});

backCameraBtn.addEventListener('click', () => {
    startCamera('environment'); // Rear-facing camera
});

// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(() => {
    console.log('Face-api.js models loaded successfully');
});