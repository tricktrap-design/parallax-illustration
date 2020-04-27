let canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let loadingScreen = document.getElementById("loading");

let isLoaded = false;
let loadCounter = 0;

let background = new Image();
let moon = new Image();
let shadow = new Image();
let character = new Image();
let mask = new Image();
let particles = new Image();

let layerList = [

    {
        'image': background,
        'src': "./img/01-background-alt.png",
        'z_index': -4.25,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': moon,
        'src': "./img/02-moon.png",
        'z_index': -3,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': shadow,
        'src': "./img/03-shadow.png",
        'z_index': -1.25,
        'position': { x: 0, y: 0 },
        'blend': "multiply",
        'opacity': 0.3
    },
    {
        'image': character,
        'src': "./img/04-character-alt.png",
        'z_index': -0.5,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': mask,
        'src': "./img/05-mask.png",
        'z_index': 0,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': particles,
        'src': "./img/06-particles.png",
        'z_index': 0.2,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    }
];

layerList.forEach(layer => {
    layer.image.onload = function () {
        loadCounter += 1;
        if (loadCounter >= layerList.length) {
            requestAnimationFrame(drawCanvas);
            loadingScreen.classList.add("hidden");
        }
    }
    layer.image.src = layer.src;
});

function drawCanvas() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.height);

    // Canvas rotation

    // Rotation calculation
    let rotateX = (pointer.y * -0.06) + (motion.y * -0.8);
    let rotateY = (pointer.x * 0.06) + (motion.x * 0.8);

    // Rotating canvas
    canvas.style.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";


    layerList.forEach(layer => {

        layer.position = getOffset(layer);
        // Blend modes
        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = "normal";
        }

        // Opacity
        context.globalAlpha = layer.opacity;

        // Position layers
        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });

    requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {

    const touchMultiplier = 0.1;
    let touchOffsetX = pointer.x * layer.z_index * touchMultiplier;
    let touchOffsetY = pointer.y * layer.z_index * touchMultiplier;

    const motionMultiplier = 2.5;
    let motionOffsetX = motion.x * layer.z_index * motionMultiplier;
    let motionOffsetY = motion.y * layer.z_index * motionMultiplier;

    let offset = {
        x: touchOffsetX + motionOffsetX,
        y: touchOffsetY + motionOffsetY
    };

    return offset;
}

//////////////////////// Touch controls ////////////////////////

let moving = false;

let pointerInitial = {
    x: 0,
    y: 0
}

let pointer = {
    x: 0,
    y: 0
}

canvas.addEventListener("touchstart", pointerStart);
canvas.addEventListener("mousedown", pointerStart);

function pointerStart(event) {

    moving = true;
    // console.log("screen touched")
    if (event.type == "touchstart") {

        // console.log("screen touched")
        pointerInitial.x = event.touches[0].clientX;
        pointerInitial.y = event.touches[0].clientY;
        // console.log(pointerInitial);

    } else if (event.type == "mousedown") {

        // console.log("screen dragged")
        pointerInitial.x = event.clientX;
        pointerInitial.y = event.clientY;
    }
}

window.addEventListener("touchmove", pointerMove, { passive: false });
window.addEventListener("mousemove", pointerMove, { passive: false });

function pointerMove(event) {

    event.preventDefault();
    if (moving) {

        let currentX = 0;
        let currentY = 0;
        if (event.type == "touchmove") {

            currentX = event.touches[0].clientX;
            currentY = event.touches[0].clientY;

        } else if (event.type == "mousemove") {

            currentX = event.clientX;
            currentY = event.clientY;

        }

        pointer.x = currentX - pointerInitial.x;
        pointer.y = currentY - pointerInitial.y;
    }
}

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
});

canvas.addEventListener("mousemove", (event) => {
    event.preventDefault();
});

window.addEventListener("touchend", (event) => {
    endGesture();
});

window.addEventListener("mouseup", (event) => {
    endGesture();
    // moving = false;
});

function endGesture() {

    moving = false;
    pointer.x = 0;
    pointer.y = 0;
}

//////////////////////// Motion controls ////////////////////////

let motionInitial = {
    x: 0,
    y: 0
}

let motion = {
    x: 0,
    y: 0
}

window.addEventListener("deviceorientation", () => {

    // Check orientation
    if (!motionInitial.x && !motionInitial.y) {
        motionInitial.x = event.beta;
        motionInitial.y = event.gamma;
    }

    if (window.orientation == 0) {
        // Portrait mode
        motion.x = event.gamma - motionInitial.y;
        motion.y = event.beta - motionInitial.x;

    } else if (window.orientation == 90) {
        // Landscape left mode
        motion.x = event.beta - motionInitial.x;
        motion.y = -event.gamma + motionInitial.y;

    } else if (window.orientation == -90) {
        // Landscape right mode
        motion.x = -event.beta + motionInitial.x;
        motion.y = event.gamma - motionInitial.y;

    } else {
        // Reverse portrait mode
        motion.x = -event.gamma + motionInitial.y;
        motion.y = -event.beta + motionInitial.x;

    } {

    }
});

window.addEventListener("orientationchange", (event) => {
    motionInitial.x = 0;
    motionInitial.y = 0;
});

// iOS 13 Support

window.addEventListener("touchend", () => {
    if (window.DeviceOrientationEvent) {
        DeviceOrientationEvent.requestPermission();
    }
});