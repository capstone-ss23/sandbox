var isMouseDown = false;
var mouseDownX = 0;
var mouseDownY = 0;
var line_width = 0;

var hue = 0;
var saturation = 100;
var lightness = 50;

function init() {
    // find canvas
    var canvas = document.getElementById("drawing");
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    //  attach event listeners
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);

    // get sliders
    var line_width_slider = document.getElementById("line_width");
    var hue_slider = document.getElementById("hue");

    // set current values
    line_width = line_width_slider.value;
    hue = hue_slider.value;

    // set hue slider to current color
    hue_slider.style.accentColor = cssColor(hue, saturation, lightness)

    // attatch slider handlers
    line_width_slider.oninput = function() {line_width = this.value; } 
    hue_slider.oninput = function() { 
        hue = this.value;
        this.style.accentColor = cssColor(hue, saturation, lightness)
    } 

}

// adapted from https://stackoverflow.com/a/62862049
function cssColor(h, s, l) {
    return 'hsl(H, S%, L%)'
        .replace(/H/, h)
        .replace(/S/, s)
        .replace(/L/, l);
}

function mouseDown(event) {
    x = event.clientX;
    y = event.clientY;

    // get context
    var canvas = document.getElementById("drawing");
    var ctx = canvas.getContext("2d");

    // draw circle at pointer
    ctx.beginPath();
    ctx.arc(x, y, line_width, 0, 2 * Math.PI, false);
    ctx.fillStyle = cssColor(hue, saturation, lightness);
    ctx.fill();

    // set mouse down
    isMouseDown = true;
    mouseDownX = x;
    mouseDownY = y;
}

function mouseUp(event) {
    isMouseDown = false;
}

function mouseMove(event) {
    x = event.clientX;
    y = event.clientY;

    if (isMouseDown) {
        // get context
        var canvas = document.getElementById("drawing");
        var ctx = canvas.getContext("2d");

        console.log(mouseDownX, mouseDownY);

        // draw line to pointer
        ctx.beginPath();
        ctx.moveTo(mouseDownX, mouseDownY);
        ctx.lineTo(x, y);
        ctx.lineWidth = 2 * line_width;
        ctx.strokeStyle = cssColor(hue, saturation, lightness);
        ctx.fillStyle = cssColor(hue, saturation, lightness);
        ctx.stroke();

        // draw circle at end of pointer
        ctx.beginPath();
        ctx.arc(x, y, line_width, 0, 2 * Math.PI, false);
        ctx.fillStyle = cssColor(hue, saturation, lightness);
        ctx.fill();

        // refresh mousedown coords
        mouseDownX = x;
        mouseDownY = y;
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