let voicesLoaded = false; 
window.speechSynthesis.onvoiceschanged = () => { 
  window.speechSynthesis.getVoices(); 
  voicesLoaded = true; 
};

function speak(text) {
  if(!voicesLoaded) return;
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  speech.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  speech.voice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || voices[0];
  window.speechSynthesis.speak(speech);
}

function addMsg(who, text) {
  document.getElementById("chat").innerHTML += `<p class="${who}"><b>${who==='me'?'You':'HenaBot'}:</b> ${text}</p>`;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  if(who === 'bot') speak(text);
}

function unlockVoice() {
  speak("Voice unlocked");
  addMsg('bot', "Voice Unlocked! Now you can talk to me");
}

function startListening() {
  window.speechSynthesis.cancel();
  addMsg('bot', "Listening...");
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    const cmd = e.results[0][0].transcript;
    addMsg('me', cmd);
    handleCommand(cmd);
  };
  recognition.onerror = (e) => {
    addMsg('bot', "Mic Error: " + e.error);
  }
  recognition.start();
}

function handleCommand(cmd) {
  const lower = cmd.toLowerCase();
  
  if(lower.includes("whatsapp")) {
    addMsg('bot', "Opening WhatsApp for you");
    window.location.href = "whatsapp://";
  } 
  else if(lower.includes("camera")) {
    addMsg('bot', "Opening Camera");
    window.location.href = "intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end";
  } 
  else if(lower.includes("time")) {
    addMsg('bot', "The time is " + new Date().toLocaleTimeString());
  } 
  else {
    // FINAL: No API. Just Google it and say it
    addMsg('bot', `Searching Google for: ${cmd}`);
    speak(`Searching Google for ${cmd}`);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(cmd)}`);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("unlockBtn").addEventListener("click", unlockVoice);
  document.getElementById("talkBtn").addEventListener("click", startListening);
});