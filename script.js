const WIDTH = 1200;
const HEIGHT = 700;

const wrapper =
document.getElementById(
    "canvasWrapper"
);

const layers = [];

for(let i=0;i<3;i++){

    const canvas =
    document.createElement(
        "canvas"
    );

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    canvas.className =
    "layer";

    wrapper.appendChild(
        canvas
    );

    layers.push(canvas);
}

let currentLayer = 0;

const history = [];
const redoHistory = [];

let drawing = false;

let startX = 0;
let startY = 0;

let zoom = 1;

function getCanvas(){

    return layers[
        currentLayer
    ];
}

function getCtx(){

    return getCanvas()
    .getContext("2d");
}

function saveState(){

    history.push(

        layers.map(
            layer =>
            layer.toDataURL()
        )

    );

    if(history.length > 50)
        history.shift();

    redoHistory.length = 0;
}

saveState();

function getPos(e){

    const rect =
    getCanvas()
    .getBoundingClientRect();

    if(e.touches){

        return {

            x:
            (e.touches[0].clientX
            - rect.left) / zoom,

            y:
            (e.touches[0].clientY
            - rect.top) / zoom
        };
    }

    return {

        x:
        (e.clientX
        - rect.left) / zoom,

        y:
        (e.clientY
        - rect.top) / zoom
    };
}

function startDraw(e){

    drawing = true;

    const p =
    getPos(e);

    startX = p.x;
    startY = p.y;

    saveState();
}

function moveDraw(e){

    if(!drawing)
        return;

    const tool =
    document.getElementById(
        "tool"
    ).value;

    if(tool !== "brush"
    && tool !== "eraser")
        return;

    const p =
    getPos(e);

    const ctx =
    getCtx();

    ctx.lineWidth =
    document.getElementById(
        "size"
    ).value;

    ctx.strokeStyle =
    document.getElementById(
        "color"
    ).value;

    const brush =
    document.getElementById(
        "brushType"
    ).value;

    ctx.globalAlpha = 1;

    if(brush==="airbrush")
        ctx.globalAlpha=0.1;

    if(brush==="marker")
        ctx.globalAlpha=0.3;

    if(tool==="eraser"){

        ctx.globalCompositeOperation =
        "destination-out";

    }else{

        ctx.globalCompositeOperation =
        "source-over";
    }

    ctx.lineCap="round";

    ctx.lineTo(p.x,p.y);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(p.x,p.y);
}
function stopDraw(e){

    drawing = false;

    getCtx().beginPath();
}

layers.forEach(canvas=>{

    canvas.addEventListener(
        "mousedown",
        startDraw
    );

    canvas.addEventListener(
        "mousemove",
        moveDraw
    );

    canvas.addEventListener(
        "mouseup",
        stopDraw
    );

    canvas.addEventListener(
        "touchstart",
        startDraw
    );

    canvas.addEventListener(
        "touchmove",
        moveDraw
    );

    canvas.addEventListener(
        "touchend",
        stopDraw
    );
});

document
.getElementById(
    "layerSelect"
)
.onchange = e => {

    currentLayer =
    Number(e.target.value);
};

document
.getElementById(
    "zoomIn"
)
.onclick = () => {

    zoom *= 1.2;

    layers.forEach(c=>{

        c.style.transform =
        `scale(${zoom})`;

    });
};

document
.getElementById(
    "zoomOut"
)
.onclick = () => {

    zoom /= 1.2;

    layers.forEach(c=>{

        c.style.transform =
        `scale(${zoom})`;

    });
};

document
.getElementById(
    "darkMode"
)
.onclick = () => {

    document.body
    .classList.toggle(
        "dark"
    );
};

document
.getElementById(
    "savePNG"
)
.onclick = () => {

    const temp =
    document.createElement(
        "canvas"
    );

    temp.width = WIDTH;
    temp.height = HEIGHT;

    const ctx =
    temp.getContext("2d");

    layers.forEach(layer=>{

        ctx.drawImage(
            layer,
            0,
            0
        );

    });

    const a =
    document.createElement(
        "a"
    );

    a.href =
    temp.toDataURL(
        "image/png"
    );

    a.download =
    "drawing.png";

    a.click();
};
