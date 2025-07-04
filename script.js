const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');

// Function to start the back camera
function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' } // Back camera
  }).then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;
      detectFaces(); // Start face detection
    };
  }).catch(error => {
    console.error('Error accessing the camera:', error);
    alert('Camera access failed. Please check permissions or HTTPS setup.');
  });
}

// Function to detect faces
async function detectFaces() {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(overlay, displaySize);

  video.addEventListener('play', () => {
    const intervalId = setInterval(async () => {
      // Detect faces
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      ctx.clearRect(0, 0, overlay.width, overlay.height); // Clear the canvas
      faceapi.draw.drawDetections(overlay, resizedDetections); // Draw detection box
      faceapi.draw.drawFaceLandmarks(overlay, resizedDetections); // Draw landmarks

      if (detections.length === 0) {
        console.log('No faces detected.');
      }
    }, 100); // Every 100ms

    video.addEventListener('pause', () => {
      clearInterval(intervalId); // Stop detection if video pauses
    });
  });
}

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(() => {
  console.log('Face-api.js models loaded successfully');
  startCamera(); // Start the camera after models are loaded
});