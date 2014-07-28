var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

canvas.width = map.width;
canvas.height = map.height;

function clearCanvas() {
    canvas.width = canvas.width;
}

function square(xi, yi, xf, yf, color) {
    ctx.fillStyle = color || "#000";
    ctx.fillRect(xi, yi, xf, yf);
}

function circle(xi, yi, r, color) {
    ctx.beginPath();
    ctx.arc(xi, yi, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color || "#000";
    ctx.fill();
}

function line(xi, yi, xf, yf, color) {
    ctx.strokeStyle = color || "#000";
    ctx.moveTo(xi, yi);
    ctx.lineTo(xf, yf);
    ctx.stroke();
}

function arrow(p, color) {

}

// effects

var storedBackground;

function background() {

    clearCanvas();

    if (storedBackground) {
        ctx.putImageData(storedBackground, 0, 0);
    } else {

        ctx.lineWidth = 2;

        square(0, 0, map.width, map.height, "#555"); // dark grey

        var x = -50, y = map.height;

        while (x < map.width) {
            line(x, y, x + 70, 0, "#666");
            line(x, y, x + 60, 0, "#666");
            line(0, x + 70, x, y, "#666");
            line(0, x + 60, x, y, "#666");
            line(x, 0, map.width, x, "#666");
            line(x, 0, map.width, x, "#666");
            x += 35;
        }

        storedBackground = ctx.getImageData(0, 0, map.width, map.height);

    } // end else

}

