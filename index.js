"use strict";
	
const keyboard = new Keyboard();
const gl = document.getElementById("c").getContext("webgl");
const m4 = twgl.m4;

//twgl.setDefaults({ attribPrefix: "a_" });

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.canvas.width  = 640;
gl.canvas.height = 480;

// canvas where the letters will be drawn
const charctx = document.createElement("canvas").getContext("2d");
charctx.canvas.width  = 16;
charctx.canvas.height = 16;

document.getElementsByTagName("body")[0].appendChild(charctx.canvas);

function drawCharacter(ctx, char) {

    let rectSize = Math.floor(16/5);

    let c = char.toUpperCase();

    if (Letters[c]) {

        ctx.save();
        ctx.fillStyle = "rgba(255, 0, 255, 255)"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "rgba(255, 255, 255, 255)"


        for (let y = 0; y < Letters[c].length; y++) {

            for (let x = 0; x < Letters[c][y].length; x++) {

                //console.log(`x: ${x}, y: ${y}, value: ${Letters[c][y][x]}`);

                if (Letters[c][y][x] === 1) {

                    ctx.fillRect(x * rectSize, y * rectSize, rectSize, rectSize);

                    //console.log(`Painted at ${x * rectSize}, ${y * rectSize}, ${rectSize}, ${rectSize}`);

                }

            }

        }

        ctx.restore();

    } else {

        console.warn(`char '${char}' does not exist in letters dictionary.`);

    }

}

const textures = twgl.createTextures(gl,

    {

        fromCanvas:
        {
            mag: gl.NEAREST,
            min: gl.NEAREST,

            src: charctx.canvas

        },

        fromArray:
        {

            mag: gl.NEAREST,
            min: gl.NEAREST,

            src: [

                // 1                // 2 
                255, 255, 255, 255, 0, 255, 0, 255,
                255, 0, 0, 255,     0, 0, 255, 255,

            ]

        }

    }

);


const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const lineProgramInfo = twgl.createProgramInfo(gl, ["vs_line", "fs_line"]);
const textureProgramInfo = twgl.createProgramInfo(gl, ["tex_mat_vs", "tex_mat_fs"]);

const board = [

    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],


];

const myplanearrays = {

    a_position: [

        -1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,

        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        1.0, 1.0, 0.0
        
    ],

    a_texcoord: [

        0, 0,
        0, 1,
        1, 0,

        0, 1,
        1, 0,
        1, 1

    ]

}
const myplaneBufferInfo = twgl.createBufferInfoFromArrays(gl, myplanearrays);

const primitivePlane = twgl.primitives.createPlaneBufferInfo(gl, 2, 2);
console.log(primitivePlane.attribs.texcoord[1]);

const uniforms = {

    u_worldViewProjection: m4.identity(),

    u_matrix: m4.identity(),

    u_diffuse: textures.fromArray,

    u_color: [0.0, 0.9, 0.0, 1.0],

    u_time: 0
};

const planePosition = [0, 0, 0];


const xlinearrays = {

    a_position: [
        0.0, 0.0, 0.0,
        20.0, 0.0, 0.0
    ]
}
const ylinearrays = {

    a_position: [
        0.0, 0.0, 0.0,
        0.0, 20.0, 0.0
    ]
}
const xlinebufferinfo = twgl.createBufferInfoFromArrays(gl, xlinearrays);
const zlinebufferinfo = twgl.createBufferInfoFromArrays(gl, ylinearrays);

const xlineuniforms = {

    u_worldViewProjection: m4.identity(),

    u_color: [1.0, 0.0, 0.0, 1.0]
}

const ylineuniforms = {

    u_worldViewProjection: m4.identity(),

    u_color: [0.0, 1.0, 0.0, 1.0]
}

const cameraPosition = [-gl.canvas.width / 2, -gl.canvas.height / 2, 0.0];

let lasttime = 0;
let interval = 1000;

function render(time) {

    //if (lasttime + interval < time) {

    //    drawCharacter(charctx, String.fromCharCode(rand(48, 90)));
    //    twgl.setTextureFromElement(gl, textures.fromCanvas, charctx.canvas);

    //    lasttime = time;

    //}
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
    const projection = m4.ortho(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, -1, 1);
    
    //const viewOffset = [-gl.canvas.width / 2, -gl.canvas.height / 2, 0];
    m4.translate(projection, cameraPosition, projection);
    
    // ---

    // for each board position, render a quad
    // only if the value is 1
    for (let y = 0; y < board.length; y++) {

        for (let x = 0; x < board[0].length; x++) {

            if (board[y][x] === 1) {

                const size = 16;
                const border = 2

                const world = m4.identity();

                m4.translate(world, [x * size + size / 2, y * size + size / 2, 0], world);
                //m4.rotateZ(world, Math.sin(time), world);
                m4.scale(world, [size / 2 - border / 2, size / 2 - border / 2, 1], world);

                m4.multiply(projection, world, uniforms.u_worldViewProjection);

                uniforms.u_time = time;

                //const shader = lineProgramInfo;  
                const shader = textureProgramInfo; 

                gl.useProgram(shader.program);
                twgl.setBuffersAndAttributes(gl, shader, myplaneBufferInfo);
                twgl.setUniforms(shader, uniforms);
                twgl.drawBufferInfo(gl, myplaneBufferInfo);
                
            }

        }

    }

    xlineuniforms.u_worldViewProjection = projection;
    ylineuniforms.u_worldViewProjection = projection;

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


function rand(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return min + Math.random() * (max - min);
}

function strm4(matrix) {

    return matrix[0] + ", " + matrix[1] + ", " + matrix[2] + ", " + matrix[3] + "\n" +
        matrix[4] + ", " + matrix[5] + ", " + matrix[6] + ", " + matrix[7] + "\n" +
        matrix[8] + ", " + matrix[9] + ", " + matrix[10] + ", " + matrix[11] + "\n" +
        matrix[12] + ", " + matrix[13] + ", " + matrix[14] + ", " + matrix[15];

}