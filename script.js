function addMsg(who, text) {
  document.getElementById("chat").innerHTML += `<p class="${who}"><b>${who==='me'?'You':'HenaBot'}:</b> ${text}</p>`;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  // FIXED: Make HenaBot talk back with delay
  if(who === 'bot' && 'speechSynthesis' in window) {
    setTimeout(() => {
      window.speechSynthesis.cancel(); // stop previous speech
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1; // speed
      speech.pitch = 1; // voice tone
      speech.volume = 1; // MAX volume
      speech.lang = "en-US";

      // Pick a good voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if(englishVoice) speech.voice = englishVoice;

      window.speechSynthesis.speak(speech);
    }, 400); // wait 400ms after mic stops
  }
}

function startListening() {
  window.speechSynthesis.cancel(); // stop bot talking while listening
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
  else if(cmd.includes("answer") && cmd.includes("call")) {
    addMsg('bot', "Trying to answer call. You need Tasker for this");
  }
  else if(cmd.includes("time")) {
    addMsg('bot', "The time is " + new Date().toLocaleTimeString());
  }
  else if(cmd.includes("test voice")) {
    addMsg('bot', "Hello, this is HenaBot. Can you hear me?");
  }
  else {
    addMsg('bot', "I heard: " + cmd);
  }
}

// Wait for voices to load
window.speechSynthesis.onvoiceschanged = () => {};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("talkBtn").addEventListener("click", startListening);
  setTimeout(() => {
    addMsg('bot', "HenaBot Ready! Tap the mic and talk to me");
  }, 500);
});