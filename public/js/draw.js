window.onload = function () {

    //Get canvas and ctx
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

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

    c.addEventListener("mousedown", (e) => lineCreate = true);
    c.addEventListener("mouseup", (e) => {
        lineCreate = false;
        prevX = null;
        prevY = null;
    });

    //on mouse move
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

    socket.on('line draw', function(drawCoords) {
        ctx.moveTo(drawCoords.prevX, drawCoords.prevY);
        ctx.lineTo(drawCoords.currX, drawCoords.currY);
        ctx.stroke();
    })



}
  