const canvas = document.getElementById("my-canvas"),
  ctx = canvas.getContext("2d"),
  toolBtns = document.querySelectorAll(".tools"),
  fillcolor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveBtn = document.querySelector(".save-img");

//gloabal variables
let prevMouseX,
  prevMouseY,
  snapshot,
  isdrawing = false,
  brushWidth = 3,
  selectedTool = "brush",
  selectedColor = "#000";

  const setCanvasBackground = ()=>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillstyle back to the selectedColor, it'll be the brush color
  }
window.addEventListener("load", () => {
  //setting height and width....offsetwidht/height return viewable height
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
    if(!fillcolor.checked){
         // strokeRect (x-coodinate ,y-coordinate, width , height)
        return ctx.strokeRect(e.offsetX, e.offsetY,prevMouseX - e.offsetX,prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY );
};

const drawCircle = (e)=>{
    ctx.beginPath();
    // let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2)+Math.pow((prevMouseX - e.offsetX), 2));
    ctx.arc(e.offsetX, e.offsetY, Math.abs(e.offsetX-prevMouseX) , 0, 2*Math.PI);
    if(!fillcolor.checked){
        return ctx.stroke();
    }
    ctx.fill();
};

const drawTriangle = (e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) //creating bottom line of triangle
    ctx.closePath(); //closing path so the third line draw automatically
    fillcolor.checked ? ctx.fill() : ctx.stroke();
};

const startDrawing = (e) => {
  isdrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath(); //create new path to draw
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  //copying canvas data and pasiing as snapshot value..this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); //it returns an image data object that copies the pixel data getImageData(x,y,width,height)
};

const drawing = (e) => {
  if (!isdrawing) return;
  //adding copied canvas data on the canvas
  ctx.putImageData(snapshot, 0, 0); //this method puts the image data back onto the canvas

  if (selectedTool === "brush" || selectedTool === "eraser") {
    //if selected tool is eraser then set strokestyle to white
    //to paint white on the existing canvas else set the stroke color to selected color
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff":selectedColor;
    //The offset property returns the relative horizontal coordinate of the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating line acccording to mouse pointer
    ctx.stroke(); //drawing line with color(ink)
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if(selectedTool ==="circle"){
    drawCircle(e);
  } else if(selectedTool ==="triangle"){
    drawTriangle(e);
  }

};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    //removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});


sizeSlider.addEventListener("change", ()=> brushWidth = sizeSlider.value);  //passing slider value as brush size
colorBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color"); //this method gets the computed CSS properties and values of an HTML element.
    })
});

colorPicker.addEventListener("change", ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height); //clearing whole canvas
    setCanvasBackground();
});

saveBtn.addEventListener("click", ()=>{
    const link = document.createElement("a");  //creating <a> element
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL(); //passing canvasData as link href value
    link.click(); //clicking link to download image

});
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", () => (isdrawing = false));
