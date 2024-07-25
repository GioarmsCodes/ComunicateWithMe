document.addEventListener('DOMContentLoaded', () => {
  // Richiesta di accesso al microfono
  navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
           v = audioContext.createBiquadFilter();
           v.type = "highpass";
           v.frequency.value = "10000";       

          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.fftSize = 2048;
          //microphone.connect(v);
          microphone.connect(analyser);
          //analyser.connect(v)
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);

          const frequencyData = new Uint8Array(analyser.frequencyBinCount);

          scriptProcessor.onaudioprocess = () => {
              analyser.getByteFrequencyData(frequencyData);
              const frequency = getDominantFrequency(frequencyData, audioContext.sampleRate);
              document.getElementById('frequency').textContent = `Frequenza: ${frequency.toFixed(2)} Hz`;
          };
      })
      .catch(err => {
          console.error('Errore di accesso al microfono:', err);
      });
});

function getDominantFrequency(frequencyData, sampleRate) {
  let maxIndex = 0;
  let maxValue = -Infinity;

  for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
          maxValue = frequencyData[i];
          maxIndex = i;
      }
  }

  const nyquist = sampleRate / 2;
  const frequency = (maxIndex * nyquist) / frequencyData.length;

  doc = document.getElementById("body");

  led = document.getElementById("light");

  if (frequency > 650 && frequency < 750){
    // stato di reset
    //doc.style="background-color: grey;";
  }else if(frequency > 3000 && frequency < 4000){ // red
    led.src = "images/green.png";
  }else if(frequency > 7000 && frequency < 8000){ // green
    led.src = "images/red.png";
  }

  return frequency;
}
