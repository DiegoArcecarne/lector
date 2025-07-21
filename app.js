/* app.js — versión con Pausa / Reanudar funcional */

const synth   = window.speechSynthesis;
let   utter   = null;                 // Utterance en curso

const fileInput  = document.getElementById('file');
const rateSlider = document.getElementById('rate');
const rateVal    = document.getElementById('val');
const box        = document.getElementById('box');

/* -------- Cargar archivo .txt local -------- */
fileInput.onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  f.text().then(text => box.value = text);
};

/* -------- Cambiar velocidad sobre la marcha -------- */
rateSlider.oninput = e => {
  const v = parseFloat(e.target.value);
  rateVal.textContent = v.toFixed(1);
  if (utter) utter.rate = v;          // Se aplica a la próxima frase
};

/* -------- ▶ Leer / Reanudar -------- */
document.getElementById('play').onclick = () => {

  /* 1. Reanudar si está en pausa */
  if (synth.paused) {
    synth.resume();
    return;
  }

  /* 2. Ignorar si ya está hablando */
  if (synth.speaking) return;

  /* 3. Crear un nuevo utterance */
  const text = box.value.trim();
  if (!text) {
    alert('Selecciona un archivo .txt primero');
    return;
  }
  utter = new SpeechSynthesisUtterance(text);
  utter.rate = parseFloat(rateSlider.value);
  synth.speak(utter);
};

/* -------- ⏸ Pausa -------- */
document.getElementById('pause').onclick = () => {
  if (synth.speaking && !synth.paused) synth.pause();
};

/* -------- ■ Detener -------- */
document.getElementById('stop').onclick = () => {
  synth.cancel();   // Vacía la cola
  utter = null;     // Obliga a crear uno nuevo la próxima vez
};
