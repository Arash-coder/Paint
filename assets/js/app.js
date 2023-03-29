const menu = document.getElementById('menu_toggle')
const sidebar = document.getElementById('side_bar')
const paintcontainer = document.getElementById('body_paint')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toolbtns = document.querySelectorAll('.shape')
const fillColor = document.getElementById('fill_color')
const brushSize = document.getElementById('brush_size')
const colorBtns = document.querySelectorAll('.shape_color .color')
const colorPicker = document.getElementById('color_picker')
const clearBtn = document.querySelector('.clear_button')
const saveBtn = document.querySelector('.save_button')


let isDrawing = false;
let selectedTool = 'brush'
let brushWidth = 5;
let prevMouseX, prevmouseY, snapshot;
let color = '#000'

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = color
}

window.addEventListener('load', (e) => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

brushSize.addEventListener('change', () => brushWidth = brushSize.value)

const drawRec = (e) => {
    if (fillColor.checked) {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevmouseY - e.offsetY);
    }
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevmouseY - e.offsetY);
}

const drawCicle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevmouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevmouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevmouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

toolbtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const els = document.querySelector('.shape_active');
        if (els) {
            els.classList.remove('shape_active')
        }
        btn.classList.add('shape_active');
        selectedTool = btn.id;
    })
})

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX;
    prevmouseY = e.offsetY;
    ctx.beginPath()
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}


const drawing = (e) => {
    if (!isDrawing) return;

    ctx.putImageData(snapshot, 0, 0)

    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        ctx.strokeStyle = selectedTool === 'eraser' ? "#fff" : selectedTool
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'rectangle') {
        drawRec(e);
    } else if (selectedTool === 'circle') {
        drawCicle(e);
    } else {
        drawTriangle(e);
    }
}

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const els = document.querySelector('.color_active')
        if (els) {
            els.classList.remove('color_active')
        }
        btn.classList.add('color_active')
        color = window.getComputedStyle(btn).getPropertyValue('background-color')
    })
})

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click()
})

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground()
})
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', drawing);
