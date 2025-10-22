const textInput = document.getElementById('text-input');
const imageInput = document.getElementById('image-input');
const errorDiv = document.getElementById('error-message');
const memeText = document.getElementById('meme-text');
const memeImage = document.getElementById('meme-image');
const downloadBtn = document.getElementById('download-btn');

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

textInput.addEventListener('keyup', () => {
  memeText.innerHTML = textInput.value;
  localStorage.setItem('memeText', textInput.value);
});

function errorMessage(message) {
  if (!message || message === undefined) {
    errorDiv.innerHTML = '';
    errorDiv.style.display = 'none';
    return;
  }

  errorDiv.innerText = message;
  errorDiv.style.display = 'block';
  errorDiv.style.margin = '10px';
}

function loadSelectedImage(file) {
  const image = file.files[0];
  const allowedFiles = ['image/jpeg', 'image/png'];

  if (!allowedFiles.includes(image.type)) {
    errorMessage('Select a valid image type file (JPEG, PNG or WEBP)');
    return;
  }

  if (image.size > MAX_IMAGE_SIZE) {
    errorMessage('Image size exceeds the allowed limit (3 MB)');
    return;
  }

  errorMessage();
  downloadBtn.classList.remove('disabled');

  const reader = new FileReader();

  reader.onload = (event) => {
    memeImage.src = event.target.result;
    localStorage.setItem('memeImage', event.target.result);
    errorMessage.style.display = 'none';
  };

  reader.readAsDataURL(image);
}

function createMemeImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  const x = (600 - memeImage.width) / 2;
  const y = (400 - memeImage.height) / 2;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(memeImage, x, y, memeImage.width, memeImage.height);

  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'black';
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 5;

  ctx.fillText(memeText.innerText.toUpperCase(), canvas.width / 2, 15);
  return canvas.toDataURL('image/jpeg');
}

function downloadMeme(dataURL) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'meme.png';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

imageInput.addEventListener('change', (event) => {
  loadSelectedImage(event.target);
});

downloadBtn.addEventListener('click', () => {
  if (!memeImage.src) {
    errorMessage('Please select an image before downloading');
    return;
  }

  const dataURL = createMemeImage();
  downloadMeme(dataURL);
});

window.addEventListener('load', () => {
  const storedImage = localStorage.getItem('memeImage');
  const storedText = localStorage.getItem('memeText');

  if (storedImage) memeImage.src = storedImage;

  if (storedText) memeText.innerHTML = storedText;

  if (!storedImage) downloadBtn.classList.add('disabled');

  textInput.value = '';
});
