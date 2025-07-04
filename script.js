const video = document.getElementById('video');

// Function to start the back camera
function startCamera() {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // 'environment' for back camera
    }).then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };
    }).catch(error => {
        console.error('Error accessing the camera:', error);
        alert('Camera access failed. Please check browser permissions or HTTPS setup.');
    });
}

// Start the camera immediately
startCamera();