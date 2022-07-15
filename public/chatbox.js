//---to display base HTML of chatbox on the page--
const chatBase = `<div class="chatBox">
    <div class="chatBoxHeader">
        Chat Box
        <span class="chatBoxClose">-</span>
    </div>
    <div class="chatBoxBody">
        <div id="chatLogs">
        </div>
    </div>
    <div class="chatInput">
        <form>
            <input type="text" id="inputBox" placeholder="Send a message..." />
            <button type="submit" id="SubmitBtn">Go</button>
        </form>
    </div>
</div>`
const chatbox = document.getElementById('chat-box-wrapper-all')
chatbox.innerHTML = chatBase
//-----------------------------------------------
chatLogs = document.getElementById('chatLogs')
sendBtn = document.getElementById('SubmitBtn')
input = document.getElementById('inputBox')

const socket = io('http://localhost:2345')
socket.on("connection")
socket.on('receive_message', (data) => {
    receivedMessage(data);
})
socket.on('disconnect', (text) => {
    leftTheChat(text)
})
const receivedMessage = (payload) => {
    console.log(payload)
    addOtherUserMsg(payload)
}
const sendMessage = () => {
    if (input.value == '') {
        return
    }
    console.log(input.value)
    socket.emit('send_message', input.value)
    addMeMsg(input.value)
    input.value = ''
}



function addMeMsg(text) {
    chatLogs.innerHTML += `<div class="chatMsgMe"><div class="chatMsgMeUser"><span>Me:</span></div><div class="chatMsgMeText">${text}</div></div>`
}
function addOtherUserMsg(data) {
    chatLogs.innerHTML += `<div class="chatMsgOther"><div class="chatMsgOtherUser"><span>${(data.user).substring(1, 5)}...:</span></div><div class="chatMsgOtherText">${data.text}</div></div>`
}
function leftTheChat(text) {
    chatLogs.innerHTML += `<div class="chatMsgLeave"><div class="chatMsgLeaveUser"><span>${text}... has left the chat</span></div></div>`
}



sendBtn.addEventListener('click', function (e) {
    e.preventDefault()
    sendMessage();
})