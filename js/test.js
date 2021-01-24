
/* INITIALIZATION CODE
  (calls only on init)
*/

canvas = document.getElementsByTagName("canvas")[0];
gl = canvas.getContext("webgl") || canvas.getContext("expiremental-webgl");
if(gl){
    console.log("we got that webgl shit");
}else{ 
    console.log("huh, gotta find that shit");
}

//creates the shader
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

//links the shaders into a program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }


//get the text for the two different shader parts
var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

//create shader from the text of the two parts
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

//call shader
var program = createProgram(gl, vertexShader, fragmentShader);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 

var positions = [
  0, 0, 
  0, 0.5,
  0.7, 0 
];

//copies positions array (once converted into strong type)
//into the gl ARRAY_BUFFER (the gl.STATIC_DRAW just hints that the data in this array wont
//be changed much)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

/*
  RENDERING 
  (called every frame)
*/

//webglUtils.resizeCanvasToDisplaySize(gl.canvas);
gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

//clear the canvas 
gl.clearColor(0,0,0,0); 
gl.clear(gl.COLOR_BUFFER_BIT);

//Tell it to use out program to execute 
gl.useProgram(program);
//turn on an attribute that we can use to submit data to the buffer
gl.enableVertexAttribArray(positionAttributeLocation); 

//specify how the data needs to be pulled out 
//bind the position buffer 
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
var size =2; //two components per iteration 
var type = gl.FLOAT //data is 32bit floats
var normalize = false; //don't normalize data 
var stride = 0; //0 = moves forward size * sizeof(type) each iteration to get to the next position
var offset = 0; //start at the beginning of the buffer 
gl.vertexAttribPointer(
  positionAttributeLocation, size, type, normalize, stride, offset);

var primitiveType = gl.TRIANGLES; 
var offset =0; 
var count = 3; 
gl.drawArrays(primitiveType, offset, count);
