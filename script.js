const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');
const startFrontCamera = document.getElementById('startFrontCamera');
const startBackCamera = document.getElementById('startBackCamera');

// Function to start the camera stream
function startCamera(facingMode) {
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

// Event listeners for buttons
startFrontCamera.addEventListener('click', () => {
  startCamera('user'); // Front-facing camera
});

startBackCamera.addEventListener('click', () => {
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