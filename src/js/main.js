const inputFile = document.getElementById('inputFile');
const form = document.querySelector('.file-input')
const block = document.querySelector('.block');
const btns = document.querySelector('.btns');
const createTextBtn = document.getElementById('addTextBtn')
const createMemBtn = document.getElementById('createBtn')
const memeText = document.getElementById('memeText')
const controls = document.querySelector('.controls')
const fontSize = document.getElementById('fontSize');
const fontColor = document.getElementById('fontColor')

inputFile.addEventListener('change', function(){
  const file = this.files[0];
  if(file){
    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    block.insertAdjacentElement('afterbegin', img)
    createTextBtn.classList.toggle('hidden')
    createMemBtn.classList.toggle('hidden')
    form.classList.add('hidden')
  }
})

function autoResize() {
  this.style.width = (this.scrollWidth) + 'px';
}

memeText.addEventListener('input', autoResize);

fontSize.addEventListener('input', function(){
  memeText.style.fontSize = this.value + 'px';
  memeText.style.width = (memeText.scrollWidth) + 'px';
})

fontColor.addEventListener('input', function(){
  memeText.style.color = this.value;
})

textStyle.addEventListener('change', function() {
  switch (this.value) {
      case 'normal':
          memeText.style.fontStyle = 'normal';
          memeText.style.fontWeight = 'normal';
          break;
      case 'bold':
          memeText.style.fontStyle = 'normal';
          memeText.style.fontWeight = 'bold';
          break;
      case 'italic':
          memeText.style.fontStyle = 'italic';
          memeText.style.fontWeight = 'normal';
          break;
  }
});

createTextBtn.addEventListener('click', function(){
  memeText.classList.remove('hidden');
  controls.classList.remove('hidden');
})

//Drag n drop
memeText.addEventListener('mousedown', function(event) {
  shiftX = event.clientX - memeText.getBoundingClientRect().left;
  shiftY = event.clientY - memeText.getBoundingClientRect().top;

  document.addEventListener('mousemove', onMouseMove);
  memeText.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(event) {
  let newLeft = event.clientX - shiftX - block.getBoundingClientRect().left;
  let newTop = event.clientY - shiftY - block.getBoundingClientRect().top;

  const rightEdge = block.clientWidth - memeText.clientWidth;
  const bottomEdge = block.clientHeight - memeText.clientHeight;

  if (newLeft < 0) newLeft = 0;
  if (newTop < 0) newTop = 0;
  if (newLeft > rightEdge) newLeft = rightEdge;
  if (newTop > bottomEdge) newTop = bottomEdge;

  memeText.style.left = newLeft + 'px';
  memeText.style.top = newTop + 'px';
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  memeText.removeEventListener('mouseup', onMouseUp);
}

memeText.ondragstart = function() {
  return false;
};

//Сохранение мема на локальном компьютере
createMemBtn.addEventListener('click', function() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const img = block.querySelector('img');

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const computedStyle = getComputedStyle(memeText);
  const fontSize = computedStyle.fontSize.replace('px', '');
  const fontColor = computedStyle.color;
  const fontStyle = computedStyle.fontStyle;
  const fontWeight = computedStyle.fontWeight;
  console.log(fontSize, fontColor, fontStyle, fontWeight)
  ctx.font = `${fontWeight} ${fontSize}px ${fontStyle} Arial`
  ctx.fillStyle = fontColor;
  ctx.fillText(memeText.value, memeText.offsetLeft, memeText.offsetTop);

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'meme.png';

  link.click();
});