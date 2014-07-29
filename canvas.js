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
    ctx.closePath();
}

function line(xi, yi, xf, yf, color) {
    ctx.beginPath();
    ctx.strokeStyle = color || "#000";
    ctx.moveTo(xi, yi);
    ctx.lineTo(xf, yf);
    ctx.stroke();
    ctx.closePath();
}

// effects

var storedBackground;

function background() {

    clearCanvas();

    if (storedBackground) {
        ctx.putImageData(storedBackground, 0, 0);
    } else {

        ctx.lineWidth = 3;

        square(0, 0, map.width, map.height, "#333"); // dark grey

        var x = -50, y = map.height;

        while (x < map.width) {
            line(x, y, x + 70, 0, "#666");
            line(x, y, x + 60, 0, "#666");
            line(0, x + 70, x, y, randomRGB());
            line(0, x + 60, x, y, randomRGB());
            line(x, 0, map.width, x, randomRGB());
            line(x, 0, map.width, x, randomRGB());
            x += 35;
        }

        var background = ctx.getImageData(0, 0, map.width, map.height);
        // make slightly transparent
        for (var i = 3; i < (4 * map.width * map.height); i += 4) { // every 4th pixel is the transparent data point
            background.data[i] = 85;
        }

        // store the canvas as an image so that the computations don't need to be run every time
        storedBackground = background;

        ctx.putImageData(storedBackground, 0, 0);

    } // end else

}

