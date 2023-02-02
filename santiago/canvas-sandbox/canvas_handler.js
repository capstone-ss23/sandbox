var ispointerDown = false;
var pointerDownX = 0;
var pointerDownY = 0;
var line_width = 0;
var pressureEnabled = false;
var drawBezier = false;

var hue = 0;
var saturation = 100;
var lightness = 50;

/**
 * Initialize a slider.
 * @param {string} slider_id HTML ID of slider
 * @param {Function} func Function to run on each slider update
 */
function initSlider(slider_id, func) {
    // get slider by id
    var slider = document.getElementById(slider_id);
    // set input function and immediately call it
    slider.oninput = func;
    slider.oninput();
}

function init() {
    // find canvas
    var canvas = document.getElementById("drawing");

    // set canvas size
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    // attach event listeners
    canvas.addEventListener("pointerdown", pointerDown, false);
    canvas.addEventListener("pointerup", pointerUp, false);
    canvas.addEventListener("pointermove", pointerMove, false);

    // initialize sliders
    initSlider("line_width", function() { line_width = this.value; });
    initSlider("hue", function() { hue = this.value; this.style.accentColor = cssColor(hue, saturation, lightness); });

}

// adapted from https://stackoverflow.com/a/62862049
function cssColor(h, s, l) {
    return 'hsl(H, S%, L%)'
        .replace(/H/, h)
        .replace(/S/, s)
        .replace(/L/, l);
}

function togglePressure() {
    pressureEnabled = !pressureEnabled;
}

function toggleSmoothing() {
    drawBezier = !drawBezier;
}

function pointerDown(event) {
    x = event.clientX;
    y = event.clientY;

    // get context
    var canvas = document.getElementById("drawing");
    var ctx = canvas.getContext("2d");

    // draw circle at pointer
    drawPoint(ctx, x, y, getLineWidth(event));

    // set mouse down
    ispointerDown = true;
    pointerDownX = x;
    pointerDownY = y;
}

function getLineWidth(event) {
    switch (event.pointerType) {
        case 'mouse':
            return line_width;
        case 'pen':
        case 'touch':
            return pressureEnabled ? line_width * event.pressure : line_width;
    }}

function pointerUp(event) {
    ispointerDown = false;
    points.length = 0;

}

function drawPoint(ctx, x, y, radius) {
    // draw point at coords
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = cssColor(hue, saturation, lightness);
    ctx.fill();
}

function drawLine(ctx, x, y, line_width) {
    // draw line to pointer
    ctx.beginPath();
    ctx.moveTo(pointerDownX, pointerDownY);
    ctx.lineTo(x, y);
    ctx.lineWidth = 2 * line_width;
    ctx.strokeStyle = cssColor(hue, saturation, lightness);
    ctx.fillStyle = cssColor(hue, saturation, lightness);
    ctx.stroke();

    // draw circle at end of pointer
    drawPoint(ctx, x, y, line_width);
}

let points = [];

function drawCurve(ctx, x, y, line_width) {
    // drawPoint(event, ctx, x, y);
    points.push([x, y]);

    if (points.length == 4) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.bezierCurveTo(
            points[1][0], points[1][1],
            points[2][0], points[2][1],
            points[3][0], points[3][1],
        );
        ctx.lineWidth = 2 * line_width;
        ctx.strokeStyle = cssColor(hue, saturation, lightness);
        ctx.stroke();

        points.splice(0, points.length - 1);
    }

}

function pointerMove(event) {
    x = event.clientX;
    y = event.clientY;

    if (ispointerDown) {
        // get context
        var canvas = document.getElementById("drawing");
        var ctx = canvas.getContext("2d");

        if (drawBezier) {
            drawCurve(ctx, x, y, getLineWidth(event));
        } else {
            drawLine(ctx, x, y, getLineWidth(event));
        }

        // refresh pointerDown coords
        pointerDownX = x;
        pointerDownY = y;
    }
}

// adapted from https://stackoverflow.com/a/44487883
function saveCanvas() {
    // get canvas
    var canvas = document.getElementById("drawing");

    // get download link
    var link = document.getElementById("download_link");
    link.setAttribute('download', 'canvas.png');
    link.setAttribute(
        'href',
        canvas.toDataURL("image/png")
            .replace("image/png", "image/octet-stream")
    );
    link.click();
}