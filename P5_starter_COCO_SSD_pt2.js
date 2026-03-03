// 'cocoSsd' and 'tf' are available globally
// because we loaded them via script tags in index.html

const videoElement = document.getElementById('videoInput');
const canvas = document.getElementById('canvasOutput');
// Prefer camera resolution nearest to 1280x720.
const ctx = canvas.getContext('2d');
const constraints = {
  audio: true,
  video: { width: 1280, height: 720 },
};

navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      videoElement.srcObject = mediaStream;
      videoElement.onloadedmetadata = () => {
        videoElement.play();
      };
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`${err.name}: ${err.message}`);
    });

// Wait until the webcam feed is fully loaded
videoElement.onload = async () => {
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  ctx.drawImage(videoElement, 0, 0);

  // Load the model
  const model = await cocoSsd.load();

  // Run detection
  const predictions = await model.detect(videoElement);

  console.log('Predictions:', predictions);

  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;
// Draw rectangle
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
// Draw label background
    ctx.fillStyle = "red";
    ctx.fillRect(x, y - 20, width, 20);
// Draw label text
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(
        `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`,
        x + 4,
        y - 5
    );
  });
};


