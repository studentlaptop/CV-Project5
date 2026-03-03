// 'cocoSsd' and 'tf' are available globally
// because we loaded them via script tags in index.html

const img = document.getElementById('img');

// Wait until the image is fully loaded
img.onload = async () => {
  // Load the model
  const model = await cocoSsd.load();

  // Run detection
  const predictions = await model.detect(img);

  console.log('Predictions:', predictions);
};
