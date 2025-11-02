let speech = new SpeechSynthesisUtterance();
let voices = [];

function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voices");
  voiceSelect.innerHTML = "";

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  // Set default voice
  if (voices.length > 0) {
    speech.voice = voices[0];
  }
}

// Load voices (some browsers load asynchronously)
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices(); // Call it once for browsers that already have voices loaded

document.querySelector("button").addEventListener("click", () => {
  const text = document.querySelector("textarea").value;
  const selectedVoiceIndex = document.getElementById("voices").value;

  if (!text.trim()) return; // Avoid empty text

  speech.text = text;
  speech.voice = voices[selectedVoiceIndex];
  window.speechSynthesis.cancel(); // Stop previous speech
  window.speechSynthesis.speak(speech);
});
