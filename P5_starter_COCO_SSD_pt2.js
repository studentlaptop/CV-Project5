// 'cocoSsd' and 'tf' are available globally
// because we loaded them via script tags in index.html

const videoElement = document.getElementById('videoInput');
const canvas = document.getElementById('canvasOutput');
// Prefer camera resolution nearest to 1280x720.
const ctx = canvas.getContext('2d');
const constraints = {
  audio: false,
  video: { width: 640, height: 360 },
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

let model;

// Load the model first
cocoSsd.load().then((loadedModel) => {
  model = loadedModel;
  console.log("Model loaded");
});

// When the video starts playing
videoElement.addEventListener("loadeddata", () => {
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  detectFrame();
});

async function detectFrame() {
  if (!model) {
    requestAnimationFrame(detectFrame);
    return;
  }

  // Draw video frame
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Run detection
  const predictions = await model.detect(videoElement);

  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;

    // Rectangle
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Label background
    ctx.fillStyle = "red";
    ctx.fillRect(x, y - 20, width, 20);

    // Label text
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(
        `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`,
        x + 4,
        y - 5
    );
  });

  // Loop forever
  requestAnimationFrame(detectFrame);
}


