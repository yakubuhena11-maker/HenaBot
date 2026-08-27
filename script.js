function addMsg(who, text) { 
  document.getElementById("chat").innerHTML += `<p class="${who}">${who==='me'?'You':'Bot'}: ${text}</p>`; 
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight; 
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
    addMsg('bot', "Opening WhatsApp"); 
    window.location.href = "whatsapp://"; 
  } 
  else if(cmd.includes("camera")) { 
    addMsg('bot', "Opening Camera"); 
    window.location.href = "intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end"; 
  } 
  else if(cmd.includes("answer") && cmd.includes("call")) { 
    addMsg('bot', "Trying to answer call... Need Tasker for this"); 
  } 
  else if(cmd.includes("time")) { 
    addMsg('bot', "The time is " + new Date().toLocaleTimeString()); 
  } 
  else { 
    addMsg('bot', "I heard: " + cmd); 
  } 
}

// THIS LINE MAKES THE BUTTON WORK
document.getElementById("talkBtn").addEventListener("click", startListening);