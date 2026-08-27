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
  if(cmd.includes("open whatsapp")) {
    addMsg('bot', "Opening WhatsApp");
    window.location.href = "whatsapp://";
  }
  else if(cmd.includes("answer call") || cmd.includes("pick call")) {
    addMsg('bot', "Trying to answer call... Connect Tasker for this to work");
    window.location.href = "tasker://answer_call";
  }
  else if(cmd.includes("reject call")) {
    addMsg('bot', "Rejecting call");
    window.location.href = "tasker://reject_call";
  }
  else if(cmd.includes("time")) {
    addMsg('bot', "The time is " + new Date().toLocaleTimeString());
  }
  else if(cmd.includes("camera")) {
    addMsg('bot', "Opening Camera");
    window.location.href = "intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end";
  }
  else {
    addMsg('bot', "I heard: " + cmd + ". Try 'answer call' or 'open whatsapp'");
  }
}