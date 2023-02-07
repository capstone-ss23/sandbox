var ispointerDown = false;
var line_width = 0;
var pressureEnabled = true;
var n = 0;
var hasMoved = false;

let points = [];
let averaged_points = [];

function Point(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

function togglePressure() {
    pressureEnabled = !pressureEnabled;
}

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
    initSlider("smoothing", function() { n = this.value; });
}

// adapted from https://stackoverflow.com/a/62862049
function cssColor(h, s, l) {
    return 'hsl(H, S%, L%)'
        .replace(/H/, h)
        .replace(/S/, s)
        .replace(/L/, l);
}

function getLineWidth(event) {
    switch (event.pointerType) {
        case 'mouse':
            return line_width | 0;
        case 'pen':
        case 'touch':
            return pressureEnabled ? line_width * event.pressure | 0 : line_width | 0;
    }
}

function arithmeticMean(arr) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_w = 0;
    for (const a of arr) {
        sum_x += a.x | 0;
        sum_y += a.y | 0;
        sum_w += a.w | 0;
    }
    return new Point(sum_x / arr.length, sum_y / arr.length, sum_w / arr.length);
}

function drawPoint(ctx, point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.w, 0, 2 * Math.PI, false);
    ctx.fillStyle = cssColor(hue, saturation, lightness);
    ctx.fill();
}

function drawLine(ctx, from, to) {
    var dir = new Point(to.x - from.x, to.y - from.y);
    var angle = Math.atan2(dir.y, dir.x) - Math.PI / 2;

    ctx.beginPath();
    ctx.arc(to.x, to.y, to.w / 2, angle, angle + Math.PI);
    ctx.arc(from.x, from.y, from.w / 2, angle + Math.PI, angle);
    ctx.closePath()

    ctx.fillStyle = cssColor(hue, saturation, lightness);
    ctx.fill();
}

function drawSplines(ctx, points) {
    var xc = points[0].x;
    var yc = points[0].y;

    for (i = 1; i < points.length - 2; i++) {
        ctx.beginPath();

        ctx.moveTo(xc, yc);
        xc = (points[i].x + points[i + 1].x) / 2;
        yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);

        ctx.lineWidth = points[i - 1].w;
        ctx.strokeStyle = 'red';
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

    ctx.lineWidth = points[i].w;
    ctx.strokeStyle = 'red';
    ctx.lineCap = 'round';
    ctx.stroke();
}

function pointerDown(event) {
    x = event.clientX;
    y = event.clientY;

    averaged_points.length = 0;

    // set mouse down
    ispointerDown = true;
    hasMoved = false;
}

function pointerUp(event) {
    ispointerDown = false;
    points.length = 0;
    average = new Point(0, 0);
    drawn_curve = false;

    var canvas = document.getElementById("drawing");
    var ctx = canvas.getContext("2d");

    if (!hasMoved) drawPoint(ctx, new Point(x, y, getLineWidth(event) / 2));

    // drawSplines(ctx, averaged_points);
}

function pointerMove(event) {
    x = event.clientX;
    y = event.clientY;
    hasMoved = true;

    if (ispointerDown) {
        // get context
        var canvas = document.getElementById("drawing");
        var ctx = canvas.getContext("2d");

        // add point to buffer
        points.push(new Point(x, y, getLineWidth(event)));

        if (points.length == n) {
            points.shift();
            var loc = arithmeticMean(points);
            averaged_points.push(loc);

            var from = averaged_points.at(-2);
            var to = averaged_points.at(-1);
            drawLine(ctx, from, to);
        }
    }
}

// adapted from https://stackoverflow.com/a/44487883
function saveCanvas() {
    // get canvas
    var canvas = document.getElementById("drawing");

    // get download link
    var link = document.getElementById("download_link");
    // set download name
    link.setAttribute('download', 'canvas.png');
    // set download content
    link.setAttribute(
        'href',
        canvas.toDataURL("image/png")
            .replace("image/png", "image/octet-stream")
    );
    // click download link
    link.click();
}