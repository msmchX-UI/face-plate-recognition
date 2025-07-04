const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');

// Function to start the back camera after explicit confirmation
function startCamera() {
    const confirmPermission = confirm("This site needs access to your camera to function. Do you want to allow camera access?");
    if (confirmPermission) {
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
            alert('Camera access failed. Please check browser permissions or HTTPS setup.');
        });
    } else {
        alert("Camera access denied. You won't be able to use this feature.");
    }
}

// Start the camera immediately with a permission request
startCamera();

// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(() => {
    console.log('Face-api.js models loaded successfully');
});