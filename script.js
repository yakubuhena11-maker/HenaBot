function addMsg(who, text) { 
  document.getElementById("chat").innerHTML += `<p class="${who}"><b>${who==='me'?'You':'HenaBot'}:</b> ${text}</p>`; 
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight; 
  
  // NEW: Make HenaBot talk back
  if(who === 'bot' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // stop previous speech
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1; // speed
    speech.pitch = 1.1; // voice tone
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  }
} 

function startListening() { 
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
  else { 
    addMsg('bot', "I heard: " + cmd); 
  } 
}

// Wait for page to load before connecting button
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("talkBtn").addEventListener("click", startListening);
  addMsg('bot', "HenaBot Ready! Tap the mic and talk to me");
});