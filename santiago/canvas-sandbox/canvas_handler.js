var ispointerDown = false;
var line_width = 0;
var pressureEnabled = true;
var n = 0;
var hasMoved = false;
var num_paths = 0;

var tool = "pen";

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

function changeTool(radio) {
    tool = radio.value;
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
    // find svg
    var svg = document.getElementById("drawing-svg");

    // set canvas size
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    // set svg size
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);

    // attach event listeners
    addListeners(canvas);
    addListeners(svg);

    // initialize sliders
    initSlider("line_width", function() { line_width = this.value; });
    initSlider("hue", function() { hue = this.value; this.style.accentColor = cssColor(hue, saturation, lightness); });
    initSlider("smoothing", function() { n = this.value; });
}

function addListeners(obj) {
    obj.addEventListener("pointerdown", pointerDown, false);
    obj.addEventListener("pointerup", pointerUp, false);
    obj.addEventListener("pointermove", pointerMove, false);
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
function pathIdFromPoint(x, y) {
    var topmost_path = document.elementsFromPoint(x, y).find(el => el.tagName == "path");
    return topmost_path.getAttribute("data-id");
}
    var xc = points[0].x;
    var yc = points[0].y;

    for (i = 1; i < points.length - 2; i++) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); // ctx.beginPath();

        var string = `M ${xc},${yc} `; // ctx.moveTo(xc, yc);

        xc = (points[i].x + points[i + 1].x) / 2;
        yc = (points[i].y + points[i + 1].y) / 2;

        string += `Q ${points[i].x},${points[i].y} ${xc},${yc}` // ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);

        path.setAttributeNS(null, "d", string);
        path.setAttributeNS(null, "stroke", cssColor(hue, saturation, lightness)); // ctx.strokeStyle = 'red';
        path.setAttributeNS(null, "stroke-linecap", 'round'); // ctx.lineCap = 'round';
        path.setAttributeNS(null, "stroke-width", points[i - 1].w); // ctx.lineWidth = points[i - 1].w;
        path.setAttributeNS(null, "fill", "transparent");
        document.getElementById("drawing-svg").appendChild(path); // ctx.stroke();
    }
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); // ctx.beginPath();
    string = `M ${xc},${yc} `; // ctx.moveTo(xc, yc);
    string += `Q ${points[i].x},${points[i].y} ${points[i + 1].x},${points[i + 1].y}` // ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    path.setAttributeNS(null, "d", string);

    path.setAttributeNS(null, "stroke-width", points[i].w); // ctx.lineWidth = points[i].w;
    path.setAttributeNS(null, "stroke", cssColor(hue, saturation, lightness)); // ctx.strokeStyle = 'red';
    path.setAttributeNS(null, "stroke-linecap", 'round'); // ctx.lineCap = 'round';
    path.setAttributeNS(null, "fill", "transparent");
    document.getElementById("drawing-svg").appendChild(path); // ctx.stroke();
    num_paths += 1;
}

function deletePath(path_id) {
    // delete all elements with path id
    document.querySelectorAll(`path[data-id="${path_id}"]`)
        .forEach(e => e.remove());
}

function pointerDown(event) {
    x = event.clientX;
    y = event.clientY;

    averaged_points.length = 0;

    // set mouse down
    ispointerDown = true;
    hasMoved = false;

    switch(tool) {
        case "eraser":
            deletePath(pathIdFromPoint(x, y));
            break;
    }
}

function pointerUp(event) {
    ispointerDown = false;
    points.length = 0;
    average = new Point(0, 0);
    drawn_curve = false;

    var canvas = document.getElementById("drawing");
    var ctx = canvas.getContext("2d");

    switch(tool) {
        case "pen":
            if (!hasMoved) drawPoint(ctx, new Point(x, y, getLineWidth(event) / 2));
            // draw path
            drawSplines(averaged_points);
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            break;
    }
}

function penMove(ctx, x, y, line_width) {
    // add point to buffer
    points.push(new Point(x, y, line_width));

    if (points.length == n) {
        points.shift();
        var loc = arithmeticMean(points);
        averaged_points.push(loc);

        var from = averaged_points.at(-2);
        var to = averaged_points.at(-1);
        drawLine(ctx, from, to);
    }
}

function pointerMove(event) {
    x = event.clientX;
    y = event.clientY;
    hasMoved = true;

    if (ispointerDown) {
        // get context
        var canvas = document.getElementById("drawing");
        var ctx = canvas.getContext("2d");

        switch(tool) {
            case "pen":
                penMove(ctx, x, y, getLineWidth(event));
                break;
            case "eraser":
                deletePath(pathIdFromPoint(x, y));
                break;
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

// adapted from https://stackoverflow.com/a/46403589
function saveSVG() {
    // get svg
    var svg = document.getElementById("drawing-svg");

    // generate content
    var blob = new Blob(
        [
            '<?xml version="1.0" standalone="no"?>\n',
            svg.outerHTML,
        ],
        { type: "image/svg+xml;charset=utf-8" }
    );

    // create download link
    var link = document.createElement("a");
    // set download name
    link.setAttribute('download', 'canvas.svg');
    // set download content
    link.setAttribute(
        'href',
        URL.createObjectURL(blob)
    );
    // add download link to body
    document.body.appendChild(link);
    // click it
    link.click();
    // delete it
    document.body.removeChild(link);
}