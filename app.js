/* app.js – versión 3: arranque inmediato + Pausa/Reanudar sólido */

const synth = window.speechSynthesis;
let   queue = [];          // frases individuales
let   idx   = 0;           // índice actual
let   paused = false;      // bandera de pausa

/* ---------- referentes en el DOM ---------- */
const fileInput  = document.getElementById('file');
const rateSlider = document.getElementById('rate');
const rateVal    = document.getElementById('val');
const box        = document.getElementById('box');

/* ---------- cargar archivo ---------- */
fileInput.onchange = e => {
  const f = e.target.files[0];
  if (!f) return;

  f.text().then(text => {
    box.value = text;
    queue = splitText(text);
    idx = 0;
  });
};

/* ---------- fraccionar texto ---------- */
function splitText(text) {
  return text
    .split(/(?:\r?\n)+|(?<=[.!?])\s+/)   // salto de línea o punto
    .map(t => t.trim())
    .filter(Boolean);
}

/* ---------- control de velocidad ---------- */
rateSlider.oninput = e => {
  const v = parseFloat(e.target.value);
  rateVal.textContent = v.toFixed(1);
};

/* ---------- reproducir ---------- */
document.getElementById('play').onclick = () => {
  /* Reanudar si estaba pausado */
  if (paused) {
    synth.resume();
    paused = false;
    return;
  }

  /* Si ya está hablando, ignorar */
  if (synth.speaking) return;

  if (!queue.length) {
    alert('Carga primero un archivo .txt');
    return;
  }
  idx = Math.max(0, idx);  // asegúrate

  speakNext();
};

/* ---------- hablar la frase idx y encadenar ---------- */
function speakNext() {
  if (idx >= queue.length) return;

  const utt = new SpeechSynthesisUtterance(queue[idx]);
  utt.rate = parseFloat(rateSlider.value);

  utt.onend = () => {
    idx++;
    if (!paused) speakNext();   // sigue encadenando si no está en pausa/stop
  };

  synth.speak(utt);
}

/* ---------- pausa ---------- */
document.getElementById('pause').onclick = () => {
  if (synth.speaking) {
    synth.pause();
    paused = true;
  }
};

/* ---------- detener ---------- */
document.getElementById('stop').onclick = () => {
  synth.cancel();
  paused = false;
  idx = 0;
};
