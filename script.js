let voicesLoaded = false;

function addMsg(who, text) {
  document.getElementById("chat").innerHTML += `<p class="${who}"><b>${who==='me'?'You':'HenaBot'}:</b> ${text}</p>`;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  if(who === 'bot' && voicesLoaded) {
    setTimeout(() => {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;
      speech.lang = "en-US";
      const voices = window.speechSynthesis.getVoices();
      speech.voice = voices.find(v => v.name.includes('Google') && v.lang === 'en-US') || voices[0];
      window.speechSynthesis.speak(speech);
    }, 300);
  }
}

function unlockVoice() {
  // This empty speak "unlocks" chrome
  const speech = new SpeechSynthesisUtterance(" ");
  window.speechSynthesis.speak(speech);
  voicesLoaded = true;
  addMsg('bot', "Voice Unlocked! Now tap Talk");
}

function startListening() {
  if(!voicesLoaded) {
    addMsg('bot', "Tap Unlock Voice first");
    return;
  }
  window.speechSynthesis.cancel();
  addMsg('bot', "Listening...");
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    const cmd = e.results[0][0].transcript.toLowerCase();
    addMsg('me', cmd);
    handleCommand(cmd);
  };
  recognition.onerror = (e) => {
    addMsg('bot', "Mic Error: " + e.error);
  }
  recognition.start();
}

function handleCommand(cmd) {
  if(cmd.includes("whatsapp")) {
    addMsg('bot', "Opening WhatsApp for you");
    window.location.href = "whatsapp://";
  }
  else if(cmd.includes("camera")) {
    addMsg('bot', "Opening Camera");
    window.location.href = "intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end";
  }
  else if(cmd.includes("time")) {
    addMsg('bot', "The time is " + new Date().toLocaleTimeString());
  }
  else if(cmd.includes("test")) {
    addMsg('bot', "Hello, this is HenaBot speaking");
  }
  else {
    addMsg('bot', "I heard: " + cmd);
  }
}

// Load voices
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("unlockBtn").addEventListener("click", unlockVoice);
  document.getElementById("talkBtn").addEventListener("click", startListening);
});