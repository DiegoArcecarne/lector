/* app.js – versión mínima funcional (Play / Pausa / Detener) */

const synth = window.speechSynthesis;
let utter = null;                              // Utterance actual

const $     = id => document.getElementById(id);
const rate  = () => parseFloat($('#rate').value);

/* -------- cargar archivo .txt -------- */
$('#file').onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  f.text().then(t => $('#box').value = t);
};

/* -------- cambiar velocidad -------- */
$('#rate').oninput = e => {
  $('#val').textContent = e.target.value;
  if (utter) utter.rate = rate();              // se aplica en la frase siguiente
};

/* -------- ▶ Play / Reanudar -------- */
$('#play').onclick = () => {

  // 1) Reanudar si estaba pausado
  if (synth.paused) { synth.resume(); return; }

  // 2) Si ya está hablando, no hagas nada
  if (synth.speaking) return;

  // 3) Crear un utterance nuevo
  const txt = $('#box').value.trim();
  if (!txt) return alert('Carga un .txt o escribe texto');

  utter = new SpeechSynthesisUtterance(txt);
  utter.rate = rate();
  synth.speak(utter);
};

/* -------- ⏸ Pausa -------- */
$('#pause').onclick = () => synth.pause();

/* -------- ■ Detener -------- */
$('#stop').onclick  = () => { synth.cancel(); utter = null; };
