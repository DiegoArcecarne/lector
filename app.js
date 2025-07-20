const synth = window.speechSynthesis;
let utter;           // Utterance en curso

const fileInput = document.getElementById('file');
const rateSlider = document.getElementById('rate');
const rateVal    = document.getElementById('val');
const box        = document.getElementById('box');

fileInput.onchange = e=>{
  const f = e.target.files[0];
  if(!f) return;
  f.text().then(t=> box.value = t);
};

rateSlider.oninput = e=>{
  rateVal.textContent = e.target.value;
  if(utter) utter.rate = parseFloat(e.target.value);
};

document.getElementById('play').onclick = ()=>{
  if(!box.value) return alert('Selecciona un .txt primero');
  utter = new SpeechSynthesisUtterance(box.value);
  utter.rate = parseFloat(rateSlider.value);
  synth.speak(utter);
};

document.getElementById('pause').onclick = ()=> synth.pause();
document.getElementById('stop').onclick  = ()=> { synth.cancel(); utter=null };
