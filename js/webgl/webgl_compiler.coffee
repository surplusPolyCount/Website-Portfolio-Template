class WebGLCompiler
  constructor: (@gl, @shaders) ->

  createProgramWithShaders: (vertexShaderName, fragmentShaderName) ->
    vertexShader = @_createShader(vertexShaderName)
    fragmentShader = @_createShader(fragmentShaderName)
    @_createProgram(vertexShader, fragmentShader)

  _createShader: (shaderName) ->
    shaderSource = @shaders["#{shaderName}.glsl"]
    unless shaderSource
      throw "Unknown shader: #{shaderName}"

    @_compileShader(shaderSource, @_typeForShader(shaderName))

  _typeForShader: (name) ->
    if name.indexOf("vertex") != -1
      @gl.VERTEX_SHADER
    else if name.indexOf("fragment") != -1
      @gl.FRAGMENT_SHADER
    else
      throw "Unknown shader type for #{name}"

  _compileShader: (shaderSource, shaderType) ->
    shader = @gl.createShader(shaderType)
    @gl.shaderSource(shader, shaderSource)
    @gl.compileShader(shader)

    unless @gl.getShaderParameter(shader, @gl.COMPILE_STATUS)
      error = @gl.getShaderInfoLog(shader)
      console.error(error)
      throw "Could not compile shader. Error: #{error}"

    shader

  _createProgram: (vertexShader, fragmentShader) ->
    program = @gl.createProgram()
    @gl.attachShader(program, vertexShader)
    @gl.attachShader(program, fragmentShader)
    @gl.linkProgram(program)

    unless @gl.getProgramParameter(program, @gl.LINK_STATUS)
      error = @gl.getProgramInfoLog(program)
      console.error(error)
      throw "Program failed to link. Error: #{error}"

    program