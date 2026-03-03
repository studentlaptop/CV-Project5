// 'cocoSsd' and 'tf' are available globally
// because we loaded them via script tags in index.html

const imgElement = document.getElementById('imageSrc');
const inputElement = document.getElementById('fileInput');
const canvas = document.getElementById('canvasOutput');
const ctx = canvas.getContext('2d');


inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
});

// Wait until the image is fully loaded
imgElement.onload = async () => {
  canvas.width = imgElement.width;
  canvas.height = imgElement.height;
  ctx.drawImage(imgElement, 0, 0);

  // Load the model
  const model = await cocoSsd.load();

  // Run detection
  const predictions = await model.detect(imgElement);

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


