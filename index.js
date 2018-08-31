	
"use strict";
	
const gl = document.getElementById("c").getContext("webgl");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
const m4 = twgl.m4;
twgl.setDefaults({ attribPrefix: "a_" });

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const board = [

    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1]

];


// the plane object we want to render
// we will use a basic pure white shader
const planeBufferInfo = twgl.primitives.createPlaneBufferInfo(gl, 2, 2);

console.log(planeBufferInfo);

const camera = m4.identity();
const view = m4.identity();
const viewProjection = m4.identity();

const uniforms = {

    u_viewInverse: camera,
    u_world: m4.identity(),
    u_worldInverseTranspose: m4.identity(),
    u_worldViewProjection: m4.identity(),

    u_time: 1

};

const planePosition = [0, 0, 0];
       	
function render(time) {

    time *= 0.001;

	twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 100);
    //const projection = m4.ortho(-1.0, 1.0, -1.0, 1.0, 0.1, 100);
    const eye = [0, 20, 0];
    const target = [0, 0, 0];
    const up = [0, 0, 1];

    m4.lookAt(eye, target, up, camera);
    m4.inverse(camera, view);
    m4.multiply(projection, view, viewProjection);

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
		
	requestAnimationFrame(render);
		
}
	
requestAnimationFrame(render);	
