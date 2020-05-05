let socket=io();

$(()=>{
    let chatinput = $('#chatinput');
    let sendbutton = $('#sendbutton');
    let c_user = $('#username')[0].innerHTML;
    
    sendbutton.click(() => {
        //getting username of person to send the msg from input chat message
        let indexOfAt = chatinput[0].value.indexOf("@");
        if(indexOfAt == -1){
            alert(`Please mention reveiver's username in your message`);
            console.log(indexOfAt)
        }
        else{
            indexOfAt = indexOfAt + 1;
            let indexOfSpace = chatinput[0].value.indexOf(" ", indexOfAt);
            let toName;
            if(indexOfSpace == -1){
                indexOfSpace = chatinput[0].value.length;
            }
            toName = chatinput[0].value.substring(indexOfAt, indexOfSpace);
            socket.emit('chatsend', {
                from: c_user,
                to: toName,
                msg: chatinput.val()
            })
            chatinput[0].value = "";
        }
    })

    socket.on('chat_display', (data)=>{
        if(data.to == c_user || data.from == c_user)[
            $('#msgList').append(`<li>${data.from}: ${data.message}</li>`)
        ]
    })
})