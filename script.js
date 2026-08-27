function addMsg(who, text) { 
  document.getElementById("chat").innerHTML += `<p class="${who}">${who==='me'?'You':'Bot'}: ${text}</p>`; 
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight; 
} 

function startListening() { 
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)(); 
  recognition.lang = "en-US"; 
  recognition.onresult = (e) => { 
    const cmd = e.results[0][0].transcript.toLowerCase(); 
    addMsg('me', cmd); 
    handleCommand(cmd); 
  }; 
  recognition.start(); 
  addMsg('bot', "Listening..."); 
} 

function handleCommand(cmd) { 
  // SMART COMMANDS - understands many ways to say it

  if(cmd.includes("whatsapp") || cmd.includes("wa")) { 
    addMsg('bot', "Opening WhatsApp"); 
    window.location.href = "whatsapp://"; 
  } 
  else if(cmd.includes("camera") || cmd.includes("picture") || cmd.includes("photo")) { 
    addMsg('bot', "Opening Camera"); 
    window.location.href = "intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end"; 
  } 
  else if(cmd.includes("answer") && cmd.includes("call")) { 
    addMsg('bot', "Trying to answer call... Connect Tasker for this to work"); 
    window.location.href = "tasker://answer_call"; 
  } 
  else if(cmd.includes("reject") || cmd.includes("decline")) { 
    addMsg('bot', "Rejecting call"); 
    window.location.href = "tasker://reject_call"; 
  } 
  else if(cmd.includes("time")) { 
    addMsg('bot', "The time is " + new Date().toLocaleTimeString()); 
  } 
  else if(cmd.includes("call") && cmd.includes("back")) { 
    addMsg('bot', "Got it. I’ll remind you to call back later"); 
    // Later we’ll connect this to Tasker + Alarm 
  } 
  else if(cmd.includes("text") || cmd.includes("message") || cmd.includes("send")) { 
    let msg = cmd.replace("text", "").replace("message", "").replace("send", "").trim(); 
    addMsg('bot', `Opening WhatsApp with: ${msg}`); 
    window.location.href = `https://wa.me/?text=${encodeURIComponent(msg)}`; 
  }
  else if(cmd.includes("assist") || cmd.includes("help") || cmd.includes("what can you do")) {
    addMsg('bot', "I can: open whatsapp, open camera, answer call, send text, tell time. Just say it!");
  }
  else { 
    addMsg('bot', "I heard: " + cmd + ". Try 'help me' to see what I can do"); 
  } 
}