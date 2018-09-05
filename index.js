"use strict";

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
                255, 255, 255, 255, 255, 0, 0, 255,
                0, 255, 0, 255, 0, 0, 255, 255,

            ]

        }

    }

);

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const lineProgramInfo = twgl.createProgramInfo(gl, ["vs_line", "fs_line"]);
const textureProgramInfo = twgl.createProgramInfo(gl, ["tex_mat_vs", "tex_mat_fs"]);

const board = [

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1]

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

const uniforms = {

    u_worldViewProjection: m4.identity(),

    u_matrix: m4.identity(),

    u_diffuse: textures.fromArray,

    u_color: [1.0, 1.0, 1.0, 1.0],

    u_time: 0
};

const scoreUniforms = {

    u_worldViewProjection: m4.identity(),

    u_diffuse: textures.fromCanvas
    
}

const xlinearrays = {

    a_position: [
        0.0, 0.0, 0.0,
        GAME_SCREEN_WIDTH, 0.0, 0.0
    ]
}
const ylinearrays = {

    a_position: [
        0.0, 0.0, 0.0,
        0.0, GAME_SCREEN_HEIGHT, 0.0
    ]
}
const xlinebufferinfo = twgl.createBufferInfoFromArrays(gl, xlinearrays);
const zlinebufferinfo = twgl.createBufferInfoFromArrays(gl, ylinearrays);

const puzzleAreaLinesArrays = {

    a_position: [

        MARGIN_LEFT, MARGIN_TOP, 0.0,
        MARGIN_LEFT, MARGIN_TOP + BOARD_HEIGHT * TILE_SIZE, 0.0,

        MARGIN_LEFT - 1, MARGIN_TOP + BOARD_HEIGHT * TILE_SIZE, 0.0,
        MARGIN_LEFT + BOARD_WIDTH * TILE_SIZE + 1, MARGIN_TOP + BOARD_HEIGHT * TILE_SIZE, 0.0,

        MARGIN_LEFT + BOARD_WIDTH * TILE_SIZE + 1, MARGIN_TOP + BOARD_HEIGHT * TILE_SIZE, 0.0,
        MARGIN_LEFT + BOARD_WIDTH * TILE_SIZE + 1, MARGIN_TOP, 0.0
    ]

}
const puzzleAreaLinesBufferInfo = twgl.createBufferInfoFromArrays(gl, puzzleAreaLinesArrays);
const puzzleAreaLinesUniforms = {
    
    u_worldViewProjection: m4.identity(),

    u_color: [1.0, 1.0, 1.0, 1.0]

}

const gameAreaLinesArrays = {

    a_position: [

        MARGIN_LEFT * 2, MARGIN_TOP / 4, 0.0,
        MARGIN_LEFT / 4, MARGIN_TOP / 4, 0.0,
        
        MARGIN_LEFT / 4, MARGIN_TOP / 4, 0.0,
        MARGIN_LEFT / 4, GAME_SCREEN_HEIGHT - MARGIN_BOTTOM / 4, 0.0,

        MARGIN_LEFT / 4, GAME_SCREEN_HEIGHT - MARGIN_BOTTOM / 4, 0.0,
        GAME_SCREEN_WIDTH - MARGIN_RIGHT / 4, GAME_SCREEN_HEIGHT - MARGIN_BOTTOM / 4, 0.0,

        GAME_SCREEN_WIDTH - MARGIN_RIGHT / 4, GAME_SCREEN_HEIGHT - MARGIN_BOTTOM / 4, 0.0,
        GAME_SCREEN_WIDTH - MARGIN_RIGHT / 4, MARGIN_TOP / 4, 0.0,

        GAME_SCREEN_WIDTH - MARGIN_RIGHT / 4, MARGIN_TOP / 4, 0.0,
        GAME_SCREEN_WIDTH - MARGIN_RIGHT * 2, MARGIN_TOP / 4, 0.0,


    ]

}
const gameAreaLinesBufferInfo = twgl.createBufferInfoFromArrays(gl, gameAreaLinesArrays);
const gameAreaLinesUniforms = {

    u_worldViewProjection: m4.identity(),

    u_color: [1.0, 1.0, 1.0, 1.0]

}


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
let interval = 0;

let counter = 0;
function render(time) {

    if (lasttime + interval < time) {



        drawString(charctx, convertScoreIntToString(++counter, 6));
        twgl.setTextureFromElement(gl, textures.fromCanvas, charctx.canvas);

        lasttime = time;

    }
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
                
                const world = m4.identity();

                m4.translate(world, [x * TILE_SIZE + TILE_SIZE / 2 + MARGIN_LEFT, y * TILE_SIZE + TILE_SIZE / 2 + MARGIN_TOP, 0], world);
                m4.scale(world, [TILE_SIZE / 2 - TILE_MARGIN / 2, TILE_SIZE / 2 - TILE_MARGIN / 2, 1], world);
                m4.multiply(projection, world, uniforms.u_worldViewProjection);

                uniforms.u_time = time;

                const shader = lineProgramInfo;  
                //const shader = textureProgramInfo;                
                renderObject(shader, uniforms, myplaneBufferInfo);

            }

        }

    }

    // render score quad
    m4.identity(scoreUniforms.u_worldViewProjection);
    m4.translate(
        scoreUniforms.u_worldViewProjection,
        [
            GAME_SCREEN_WIDTH / 2 + TILE_SIZE * 0.5,                    // x
            SCORE_RECT_HEIGHT / 2 + 2,                     // y
            0                                              // z
        ],
        scoreUniforms.u_worldViewProjection);
    m4.scale(scoreUniforms.u_worldViewProjection, [SCORE_RECT_WIDTH / 2, SCORE_RECT_HEIGHT / 2, 0], scoreUniforms.u_worldViewProjection);
    m4.multiply(projection, scoreUniforms.u_worldViewProjection, scoreUniforms.u_worldViewProjection);
    renderObject(textureProgramInfo, scoreUniforms, myplaneBufferInfo);

    // render decorative lines
    puzzleAreaLinesUniforms.u_worldViewProjection = projection;
    renderObject(lineProgramInfo, puzzleAreaLinesUniforms, puzzleAreaLinesBufferInfo, gl.LINES);

    gameAreaLinesUniforms.u_worldViewProjection = projection;
    renderObject(lineProgramInfo, gameAreaLinesUniforms, gameAreaLinesBufferInfo, gl.LINES);
    
    //xlineuniforms.u_worldViewProjection = projection;
    //ylineuniforms.u_worldViewProjection = projection;

    //gl.useProgram(lineProgramInfo.program);
    //twgl.setBuffersAndAttributes(gl, lineProgramInfo, xlinebufferinfo);
    //twgl.setUniforms(lineProgramInfo, xlineuniforms);
    //twgl.drawBufferInfo(gl, xlinebufferinfo, gl.LINES);

    //gl.useProgram(lineProgramInfo.program);
    //twgl.setBuffersAndAttributes(gl, lineProgramInfo, zlinebufferinfo);
    //twgl.setUniforms(lineProgramInfo, ylineuniforms);
    //twgl.drawBufferInfo(gl, zlinebufferinfo, gl.LINES);

	requestAnimationFrame(render);
		
}

requestAnimationFrame(render);	

function convertScoreIntToString(int, size) {

    let s = "000000" + int;

    if (int > 999999) {

        s = "999999";

    }

    return s.substr(s.length - size);
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

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

function renderObject(shader, uniforms, buffer, method) {

    if (method === "undefined") {

        method = gl.TRIANGLES;

    }

    gl.useProgram(shader.program);
    twgl.setBuffersAndAttributes(gl, shader, buffer);
    twgl.setUniforms(shader, uniforms);
    twgl.drawBufferInfo(gl, buffer, method);

}