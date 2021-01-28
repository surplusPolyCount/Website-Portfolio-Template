
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
    console.log("error!: " + gl.getShaderInfoLog(shader));
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

function createProgramFromHTMLids(gl, vertId, fragID){
  //get the text for the two different shader parts
  var vertexShaderSource = document.querySelector(vertId).text;
  var fragmentShaderSource = document.querySelector(fragID).text;

  //create shader from the text of the two parts
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  return createProgram(gl, vertexShader, fragmentShader);
}


//call shader
var program = createProgramFromHTMLids(gl, "#vertex-shader-2d", "#fragment-shader-2d");

//lookup where vert data needs to go
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
//lookup unions
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");
var translationUniformLocation = gl.getUniformLocation(program, "u_translation");

//Bind the position buffer
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//set up variables for drawing rectangle 
var translation = [100, 20]; 
var width = 100; 
var height = 50;
var color = [Math.random(), Math.random(), Math.random(), 1];


drawScene();

function drawScene(){
  //tell webgl to convert from clip space to pixels
  gl.viewport(0,0, gl.canvas.width, gl.canvas.height);  

  //clear the canvas 
  gl.clearColor(0,0,0,0); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  //tell prgm to use our shaders
  gl.useProgram(program);

  //turn on an attribute that we can use to submit data to the buffer
  gl.enableVertexAttribArray(positionAttributeLocation); 
  
  //bind the position buffer 
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 

  // Setup a rectangle
  //setRectangle(gl, translation[0], translation[1], width, height);
  setGeometry(gl);

  //specify how the data needs to be pulled out 
  var size = 2; //two components per iteration 
  var type = gl.FLOAT //data is 32bit floats
  var normalize = false; //don't normalize data 
  var stride = 0; //0 = moves forward size * sizeof(type) each iteration to get to the next position
  var offset = 0; //start at the beginning of the buffer 

  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
  // set the resolution
  gl.uniform2f(
    resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  //set the color
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
  gl.uniform2f(translationUniformLocation, translation[0], translation[1]);

  var primitiveType = gl.TRIANGLES; 
  var offset = 0; 
  var count  = 6*3; 

  gl.drawArrays(
    primitiveType, offset, count);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  //copies positions array (once converted into strong type)
  //into the gl ARRAY_BUFFER (the gl.STATIC_DRAW just hints that the 
  //data in this array wont be changed much)
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
      ]),
      gl.STATIC_DRAW);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
              // left column
              0, 0,
              30, 0,
              0, 150,
              0, 150,
              30, 0,
              30, 150,
     
              // top rung
              30, 0,
              100, 0,
              30, 30,
              30, 30,
              100, 0,
              100, 30,
     
              // middle rung
              30, 60,
              67, 60,
              30, 90,
              30, 90,
              67, 60,
              67, 90,
          ]),
          gl.STATIC_DRAW);
}

