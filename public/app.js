window.addEventListener('load', () => {
    //--------------------socket.io
    //client site socket connection
    //Open and connect socket
    let socket = io();
    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    //--------------------1
    //post data to server
    //name,rate & button
    document.getElementById('button_rating').addEventListener('click', () => {

        let name = document.getElementById('flick_name');
        name.value = name.value.toUpperCase();
        let num = document.getElementById('flick_rating').value;
        // console.log(name);
        // console.log(num);

        //avoid empty string
        if (name.value.trim() !== '' && num !== '/') {
            let obj = {
                "name": name.value,
                "rate": num
            };
            let jsonData = JSON.stringify(obj);

            fetch('/flicks', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: jsonData
            })

                .then(response => response.json())
                .then(data => { console.log(data) })
        }

        //set name & rating value to default
        name.value = '';
        document.getElementById('flick_rating').value = "/";
    })

    //--------------------2
    //fetch data from server
    //fetch time, name & rating
    document.getElementById('flick_rec').addEventListener('click', () => {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('flick_info').innerHTML = '';
                console.log(data.data);

                // Reverse the array to display data from the last to the first
                data.data.reverse();

                for (let i = 0; i < data.data.length; i++) {
                    let string = "[" + data.data[i].date + "]\n" + " : " + data.data[i].name + " : " + data.data[i].rate + "/5";
                    let element = document.createElement('p');
                    element.innerHTML = string;
                    document.getElementById('flick_info').appendChild(element);
                }
            })
    })

    //--------------------3
    //Code to SEND a socket message to the Server
    let name = document.getElementById('name_input');
    let msg = document.getElementById('msg_input');
    let button = document.getElementById('button_send');

    button.addEventListener('click', () => {

        let msgName = name.value;
        let msgMsg = msg.value;
        let msgObj = { 'name': msgName, "msg": msgMsg };

        if (name.value.trim() !== '' && msg.value !== '') {
            //Send the message object to the server
            socket.emit('msg', msgObj);
        }
        msg.value = '';
    })


    //--------------------4
    //Code to RECEIVE a socket message from the server
    let chatBox = document.getElementById('chat_box');

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);

        //Create a message string and page element
        let inMsg = data.name + ": " + data.msg;
        let msg = document.createElement('p');
        msg.innerHTML = inMsg;

        // // Assign a class based on the user
        // if (data.name === name.value) {
        //     msg.classList.add('own-message'); // Your own messages will have the 'own-message' class
        // } else {
        //     msg.classList.add('other-message'); // Others' messages will have the 'other-message' class
        // }

        //Add the element with the message to the page
        // chatBox.appendChild(msg);

        //add message on top of another
        chatBox.prepend(msg);

        //Add auto scroll for the chat box
        // chatBox.scrollTop = chatBox.scrollHeight;
    })

})

// //--------------------p5.js
// //--------------------5
// function setup() {
//     createCanvas(windowWidth, windowHeight);

//     socket.on('data', function (obj) {
//         console.log(obj);
//         drawPos(obj);
//     });
// }

// function mouseMoved() {
//     //Grab mouse position
//     let mousePos = { x: mouseX, y: mouseY };
//     //Send mouse position object to the server
//     socket.emit('data', mousePos);
// }

// //Expects an object with x and y properties
// function drawPos(pos) {
//     fill(white);
//     ellipse(pos.x, pos.y, 10, 10);
// }