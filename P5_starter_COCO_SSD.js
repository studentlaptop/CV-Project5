// 'cocoSsd' and 'tf' are available globally
// because we loaded them via script tags in index.html

let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
});
// Wait until the image is fully loaded
imgElement.onload = async () => {
  // Load the model
  const model = await cocoSsd.load();

  // Run detection
  const predictions = await model.detect(imgElement);

  console.log('Predictions:', predictions);
};
