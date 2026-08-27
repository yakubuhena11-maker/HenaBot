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

async function handleCommand(cmd) {
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
    // FINAL FIX: Use api.co which allows GitHub Pages
    addMsg('bot', "Let me check that for you");
    try {
      const query = encodeURIComponent(cmd);
      const res = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json&no_html=1`);
      const data = await res.json();
      
      let answer = data.AbstractText;
      
      if(answer && answer.length > 10) {
        addMsg('bot', answer);
      } else {
        // If no answer, just google it
        addMsg('bot', `I don't have that. Opening Google for: ${cmd}`);
        window.open(`https://www.google.com/search?q=${query}`);
      }
    } catch(e) {
      addMsg('bot', "My search is blocked. But I can still open Google for you");
      window.open(`https://www.google.com/search?q=${encodeURIComponent(cmd)}`);
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("unlockBtn").addEventListener("click", unlockVoice);
  document.getElementById("talkBtn").addEventListener("click", startListening);
});