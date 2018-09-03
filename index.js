	
"use strict";

const keyboard = new Keyboard();

const gl = document.getElementById("c").getContext("webgl");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
const m4 = twgl.m4;
twgl.setDefaults({ attribPrefix: "a_" });

gl.canvas.width  = 640;
gl.canvas.height = 480;

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const lineProgramInfo = twgl.createProgramInfo(gl, ["vs_line", "fs_line"]);

const board = [

    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 1, 1, 1]

];

// the plane object we want to render
// we will use a basic pure white shader
const planeBufferInfo = twgl.primitives.createPlaneBufferInfo(gl, 10, 10);

const camera = m4.identity();
const view = m4.identity();
const viewProjection = m4.identity();

const myplanearrays = {

    position: [

        -20.0, -20.0, 0.0,
        -20.0, 20.0, 0.0,
        20.0, -20.0, 0.0,

        -20.0, 20.0, 0.0,
        20.0, -20.0, 0.0,
        20.0, 20.0, 0.0
        
    ]

}
const myplaneBufferInfo = twgl.createBufferInfoFromArrays(gl, myplanearrays);

const uniforms = {

    u_viewInverse: camera,
    u_world: m4.identity(),
    u_worldInverseTranspose: m4.identity(),
    u_worldViewProjection: m4.identity(),

    u_matrix: m4.identity(),

    u_color: [0.5, 0.5, 0.0, 1.0],

    u_time: 0
};

const planePosition = [0, 0, 0];


const xlinearrays = {

    position: [
        0.0, 0.0, 0.0,
        20.0, 0.0, 0.0
    ]
}
const ylinearrays = {

    position: [
        0.0, 0.0, 0.0,
        0.0, 20.0, 0.0
    ]
}
const xlinebufferinfo = twgl.createBufferInfoFromArrays(gl, xlinearrays);
const zlinebufferinfo = twgl.createBufferInfoFromArrays(gl, ylinearrays);

const xlineuniforms = {

    u_matrix: m4.identity(),

    u_color: [1.0, 0.0, 0.0, 1.0]
}

const ylineuniforms = {

    u_matrix: m4.identity(),

    u_color: [0.0, 1.0, 0.0, 1.0]
}

const cameraPosition = [0.0, 0.0, 0.0];

function render(time) {

    time *= 0.001;

    if (keyboard.left.isDown) {

        cameraPosition[0] += 1;

    }
    if (keyboard.right.isDown) {

        cameraPosition[0] -= 1;

    }
    if (keyboard.down.isDown) {

        cameraPosition[1] -= 1;

    }
    if (keyboard.up.isDown) {

        cameraPosition[1] += 1;

    }

	//twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const aspect = gl.canvas.width / gl.canvas.height;
    //const projection = m4.ortho(-aspect, aspect, 1, -1, -1, 1);
    const projection = m4.ortho(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, -1, 1);
    
    //const viewOffset = [-gl.canvas.width / 2, -gl.canvas.height / 2, 0];
    m4.translate(projection, cameraPosition, projection);


    // --- draw quad

    uniforms.u_worldViewProjection = projection;
    uniforms.u_time = time;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, myplaneBufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, myplaneBufferInfo);

    // ---

    //// for each board position, render a quad
    //// only if the value is 1
    //for (let y = 0; y < board.length; y++) {

    //    for (let x = 0; x < board[0].length; x++) {

    //        if (board[y][x] === 1) {

    //            // render

    //            // prepare matrix with proper translation
    //            //const world = uniforms.u_world;
    //            //m4.identity(world);
    //            //m4.scale(world, [0.5, 0.5, 0.5], world);
    //            //m4.translate(world, [-x * 2, 0, -y * 2], world);
    //            //m4.transpose(m4.inverse(world, uniforms.u_worldInverseTranspose), uniforms.u_worldInverseTranspose);
    //            //m4.multiply(viewProjection, uniforms.u_world, uniforms.u_worldViewProjection);


    //            //uniforms.u_time = time;

    //            const world = m4.identity();
    //            m4.scale(world, [10, 10, 10], world);
    //            m4.translate(world, [10, 10, 10], world);
    //            m4.multiply(projection, world, uniforms.u_matrix);

    //            uniforms.u_matrix = projection;

    //            gl.useProgram(lineProgramInfo.program);
    //            twgl.setBuffersAndAttributes(gl, lineProgramInfo, planeBufferInfo);
    //            twgl.setUniforms(lineProgramInfo, uniforms);
    //            twgl.drawBufferInfo(gl, planeBufferInfo);

    //        }

    //    }

    //}

    /*
     * 
    // x
    planePosition[0] = Math.sin(time) * 2;

    // z
    planePosition[2] = Math.cos(time) * 2;
    
    const world = uniforms.u_world;
    m4.identity(world);
    m4.scale(world, [0.5, 0.5, 0.5], world);
    m4.translate(world, planePosition, world);
    //m4.rotateY(world, time, world);
    m4.transpose(m4.inverse(world, uniforms.u_worldInverseTranspose), uniforms.u_worldInverseTranspose);
    m4.multiply(viewProjection, uniforms.u_world, uniforms.u_worldViewProjection);

    uniforms.u_time = time;

	gl.useProgram(programInfo.program);
	twgl.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
	twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, planeBufferInfo);
	




    */


    xlineuniforms.u_matrix = projection;
    ylineuniforms.u_matrix = projection;

    gl.useProgram(lineProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, lineProgramInfo, xlinebufferinfo);
    twgl.setUniforms(lineProgramInfo, xlineuniforms);
    twgl.drawBufferInfo(gl, xlinebufferinfo, gl.LINES);

    gl.useProgram(lineProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, lineProgramInfo, zlinebufferinfo);
    twgl.setUniforms(lineProgramInfo, ylineuniforms);
    twgl.drawBufferInfo(gl, zlinebufferinfo, gl.LINES);

	requestAnimationFrame(render);
		
}

requestAnimationFrame(render);	
