
const socket = io();

//let textbok =document.querySelector("#sendmessage");
let messagearea =document.querySelector(".messagearea");
var name="user";



    
    function sendbtn() {
        var textbok =document.getElementById("sendmessage").value;
        sendmessage(textbok);
        console.log(textbok);
     }
     
// document.querySelector('#sendmessage').window.addEventListener('keypress', function (e) {
//     if (e.key === 'Enter') {
     
//     }
// });


function sendmessage(message){
    var d = new Date();
    let msg={
        user:name,
        message:message.trim(),
        time:d.toLocaleString(),
    }
    //append message
    appendMessage(msg,'outgoing');
    document.getElementById("sendmessage").value='';
    //send to server
    socket.emit('message',msg);
}
function appendMessage(msg,type){
    let maindiv =document.createElement('div');
    let cssclass =type;
    maindiv.classList.add(cssclass,'message');

    let msgdesign=`
    <p class="msg_time_send">${msg.time}
    <span>(${msg.user})</span>
    </p>
    <div class="msg_cotainer_send">
   ${msg.message}
   
        </div>
    `
    maindiv.innerHTML=msgdesign;
    document.querySelector("#messagearea").appendChild(maindiv);
}
//recive message
socket.on('message',(msg)=>{
    console.log(msg);
    appendMessage(msg,'incomming');
   })