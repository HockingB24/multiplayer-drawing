window.onload = function () {


    //Get canvas and ctx
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var blackBtn = document.getElementById("black");
    var redBtn = document.getElementById("red");
    var orangeBtn = document.getElementById("orange");
    var yellowBtn = document.getElementById("yellow");
    var greenBtn = document.getElementById("green");
    var blueBtn = document.getElementById("blue");
    var violetBtn = document.getElementById("violet");
    var usersConnectedText = document.getElementById('usersConnected');
    var clearCanvasBtn = document.getElementById('clearCanvas');
    var currButton = blackBtn;
    currButton.style.border = "5px solid #000000";
    
    //set previous to null
    var prevX = null;
    var prevY = null;
    var lineCreate = false;
    var socket = io();
    var drawCoords = {
        prevX: null,
        prevY: null,
        currX: null,
        currY: null
    };
    var colorInfo = {
        color: null,
        button: null
    };
    var usersConnected = 0;
    //CHange color events
    blackBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'black';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'black';
        socket.emit('change color', colorInfo);
    });
    redBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'red';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'red';
        socket.emit('change color', colorInfo);
    });
    orangeBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'orange';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'orange';
        socket.emit('change color', colorInfo);
    });
    yellowBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'yellow';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'yellow';
        socket.emit('change color', colorInfo);
    });
    greenBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'green';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'green';
        socket.emit('change color', colorInfo);
    });
    blueBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'blue';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'blue';        
        socket.emit('change color', colorInfo);
    });
    violetBtn.addEventListener("click", (e) => {
        ctx.strokeStyle = 'purple';
        colorInfo.color = ctx.strokeStyle;
        colorInfo.button = 'violet';
        socket.emit('change color', colorInfo);
    });

    //Line draw event listeners
    c.addEventListener("mousedown", (e) => lineCreate = true);
    c.addEventListener("mouseup", (e) => {
        lineCreate = false;
        prevX = null;
        prevY = null;
    });
    //on mouse move, actual line drawing
    c.addEventListener("mousemove", (e) => {
        if (lineCreate != true){
            return;
        }

        let bound = c.getBoundingClientRect();

        if (prevX == null && prevY == null){
            prevX = e.clientX - bound.left - c.clientLeft;
            prevY = e.clientY - bound.top - c.clientTop;
        }

        currX = e.clientX - bound.left - c.clientLeft;
        currY = e.clientY - bound.top - c.clientTop;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.stroke();

        //Implement draw coordinates to send over socket.io
        drawCoords.prevX = prevX;
        drawCoords.prevY = prevY;
        drawCoords.currX = currX;
        drawCoords.currY = currY;

        //Call socket.io 
        socket.emit('line draw', drawCoords);

        prevX = currX;
        prevY = currY;
    })

    //Clear canvas listenere
    clearCanvasBtn.addEventListener("click", (e) => {
        socket.emit('clear canvas');
    })




    //Socket return events
    socket.on('line draw', function(drawCoords) {
        ctx.beginPath();
        ctx.moveTo(drawCoords.prevX, drawCoords.prevY);
        ctx.lineTo(drawCoords.currX, drawCoords.currY);
        ctx.stroke();
    })
    socket.on('change color', function(colorInfo) {
        if (currButton != null){
            currButton.style.border = '';
        }
        //console.log(colorInfo.color);
        ctx.strokeStyle = colorInfo.color;
        currButton = document.getElementById(colorInfo.button);
        currButton.style.border = "5px solid #000000";
    })
    socket.on('user connect', (usersConnected) => {
        usersConnectedText.innerText = "Users Connected: " + usersConnected;
        //console.log(usersConnected);
    })
    socket.on('user disconnect', (usersConnected) => {
        //console.log(usersConnected);
        usersConnectedText.innerText = "Users Connected: " + usersConnected;
    })
    socket.on('clear canvas', () => {
        ctx.clearRect(0,0, c.width, c.height);
    })
}
  