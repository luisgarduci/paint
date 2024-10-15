const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const inputColor = document.querySelector(".input__color")
const tools = document.querySelectorAll(".button__tool")
const sizeButtons = document.querySelectorAll(".button__size")
const buttonClear = document.querySelector(".button__clear")
const buttonSave = document.querySelector(".button__save")

let firstDraw = [];

let color = "black";

let brushSize = 20

let isPainting = false

let activeTool = "brush"

inputColor.addEventListener("change", ({ target }) => {
    ctx.fillStyle = target.value
    color = target.value;
})


window.addEventListener("load", () => {
    const save = JSON.parse(localStorage.getItem("save"));
     savedraw(save);
     console.log(save);
})


canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
    isPainting = true

    if (activeTool == "brush") {
        draw(clientX, clientY)
    }

    if (activeTool == "rubber") {
        erase(clientX, clientY)
    }
})

canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (isPainting) {
        if (activeTool == "brush") {
            draw(clientX, clientY)
            console.log(clientX, clientY)
            const saves = JSON.parse(localStorage.getItem("save"))
            if (saves === null) {
                firstDraw.push([clientX, clientY, color, brushSize])
                localStorage.setItem("save", JSON.stringify(firstDraw))
            }
            else {
                saves.push([clientX, clientY, color, brushSize])
                localStorage.setItem("save", JSON.stringify(saves))
            }
            
            
        }

        if (activeTool == "rubber") {
            erase(clientX, clientY)
            
        }
    }
})

canvas.addEventListener("mouseup", ({ clientX, clientY }) => {
    isPainting = false
})

const draw = (x, y) => {
    ctx.globalCompositeOperation = "source-over"
    ctx.beginPath()
    ctx.arc(
        x - canvas.offsetLeft,
        y - canvas.offsetTop,
        brushSize / 2,
        0,
        2 * Math.PI
    )
    ctx.fill();
}

const savedraw = (save) => {
    save.forEach(element => {
        ctx.fillStyle = element[2];
        ctx.globalCompositeOperation = "source-over"
        ctx.beginPath()
        ctx.arc(
           element[0] - canvas.offsetLeft,
           element[1] - canvas.offsetTop,
            element[3] / 2,
            0,
            2 * Math.PI
        )
        ctx.fill();
    })
}

const erase = (x, y) => {
    let save = JSON.parse(localStorage.getItem("save"));

    save.forEach(element => {
        if (element[0] === x && element[1] === y) {
            console.log("APAGANDO...");
            const teste = element.splice(0, 4)
            console.log(teste)
            localStorage.setItem("save", JSON.stringify(save));
        }
    })
    

    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(
        x - canvas.offsetLeft,
        y - canvas.offsetTop,
        brushSize / 2,
        0,
        2 * Math.PI
    )
    ctx.fill()
    
}

const selectTool = ({ target }) => {
    const selectedTool = target.closest("button")
    const action = selectedTool.getAttribute("data-action")

    if (action) {
        tools.forEach((tool) => tool.classList.remove("active"))
        selectedTool.classList.add("active")
        activeTool = action
    }
}

const selectSize = ({ target }) => {
    const selectedTool = target.closest("button")
    const size = selectedTool.getAttribute("data-size")

    sizeButtons.forEach((tool) => tool.classList.remove("active"))
    selectedTool.classList.add("active")
    brushSize = size
}

tools.forEach((tool) => {
    tool.addEventListener("click", selectTool)
})

sizeButtons.forEach((button) => {
    button.addEventListener("click", selectSize)
})

buttonClear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem("save");
})


