const video = document.getElementById('video');
const canvas = document.getElementById('overlay');

async function startVideo() {
  try {
    const constraints = {
      video: {
        facingMode: 'user', // Use the front-facing camera
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (err) {
    console.error('Error accessing webcam:', err);
    alert('Unable to access the webcam. Please check your browser settings and permissions.');
  }
}

async function loadModels() {
  // Load models from the hosted '/models' directory
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    console.log('Models loaded successfully');
  } catch (err) {
    console.error('Error loading models:', err);
    alert('Unable to load models. Please check the /models directory.');
  }
}

async function detectFaces() {
  const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    try {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    } catch (err) {
      console.error('Error detecting faces:', err);
    }
  }, 100);
}

video.addEventListener('play', detectFaces);

loadModels().then(startVideo);