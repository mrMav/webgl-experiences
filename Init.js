/*
 * Init game components
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.init = function () {

        // test storage availability
        this.storage.available = this.storage.storageAvailable("localStorage");

        // fetch for an highscore:
        if (this.storage.available) {

            let score = window.localStorage.getItem("score");

            if (score) {

                game.highscore = parseInt(score);

            }

        }

        // gl context
        this.gl = document.getElementById("c").getContext("webgl", { antialias: false });

        // reference to work with matrices
        this.m4 = twgl.m4;

        // input reference (change to touch controls later)
        this.keyboard = new Keyboard();

        // webgl context properties set
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.canvas.width = this.GAME_SCREEN_WIDTH;
        this.gl.canvas.height = this.GAME_SCREEN_HEIGHT;

        // make the top left coordinates 0, 0
        this.cameraPosition = [-this.gl.canvas.width / 2, -this.gl.canvas.height / 2, 0.0];

        // calculate the projection matrix
        // perform a first resize and set viewports dimensions
        this.projection = this.m4.identity();
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.projection = this.m4.ortho(-this.gl.canvas.width / 2, this.gl.canvas.width / 2, this.gl.canvas.height / 2, -this.gl.canvas.height / 2, -1, 1);
        this.m4.translate(this.projection, this.cameraPosition, this.projection);

        this.resize();

        //generate a board
        for (let i = 0; i < this.BOARD_HEIGHT; i++) {

            let r = [];

            for (let j = 0; j < this.BOARD_WIDTH; j++) {

                r.push(0);

            }

            this.board.push(r);

        }

        // create a first shape
        this.nextShape = new game.shape("SHAPE_" + this.utils.randomInt(1, 7));
        this.spawnShape();


        /*
         * Create shaders
         */
        this.shaders.createShader("texture_shader", ["tex_mat_vs", "tex_mat_fs"]);
        this.shaders.createShader("color_shader", ["color_vs", "color_fs"]);

        /*
         * Create textures
         */
        this.textures.createTexture(

            "default",

            {

                minMag: this.gl.NEAREST,

                src: [

                    // 1                  // 2 
                    255, 255, 255, 255, 255, 255, 255, 255,
                    // 3                  //4 
                    255, 255, 255, 255, 255, 255, 255, 255,

                ]

            }

        );

        this.text.rectSize = 6;
        this.text.foreground = "rgba(000, 000, 000, 255)";
        this.text.background = "rgba(255, 255, 255, 255)";
        this.text.createTextTexture(this.GAME_SCREEN_WIDTH / 3, this.FONT_SIZE_3 + 4, "PLAY!", "playtext", { minMag: this.gl.NEAREST });
        this.text.rectSize = 4;
        this.text.foreground = "rgba(255, 255, 255, 255)";
        this.text.background = "rgba(0, 0, 0, 255)";
        this.text.createTextTexture(this.GAME_SCREEN_WIDTH / 3, this.FONT_SIZE_3 + 4, "HIGHSCORE:", "maxscoretext", { minMag: this.gl.NEAREST });
        this.text.rectSize = 6;
        this.text.createTextTexture(this.SCORE_RECT_WIDTH, this.SCORE_RECT_HEIGHT, "000000", "score", { minMag: this.gl.NEAREST });
        this.text.foreground = "rgba(165, 165, 165, 255)";
        this.text.createTextTexture(this.SCORE_RECT_WIDTH, this.SCORE_RECT_HEIGHT, "000000", "timer", { minMag: this.gl.NEAREST });

        /*
         * Create meshes
         */
        this.meshes.createObject(   // name, attribArray

            "meshQuad",

            {
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

        );

        this.meshes.createObject(

            "meshPuzzleAreaLines",

            {

                a_position: [

                    this.MARGIN_LEFT, this.MARGIN_TOP, 0.0,
                    this.MARGIN_LEFT, this.MARGIN_TOP + this.BOARD_HEIGHT * this.TILE_SIZE, 0.0,

                    this.MARGIN_LEFT - 1, this.MARGIN_TOP + this.BOARD_HEIGHT * this.TILE_SIZE, 0.0,
                    this.MARGIN_LEFT + this.BOARD_WIDTH * this.TILE_SIZE + 1, this.MARGIN_TOP + this.BOARD_HEIGHT * this.TILE_SIZE, 0.0,

                    this.MARGIN_LEFT + this.BOARD_WIDTH * this.TILE_SIZE + 1, this.MARGIN_TOP + this.BOARD_HEIGHT * this.TILE_SIZE, 0.0,
                    this.MARGIN_LEFT + this.BOARD_WIDTH * this.TILE_SIZE + 1, this.MARGIN_TOP, 0.0
                ]

            }

        );

        this.meshes.createObject(

            "meshGameAreaLines",

            {

                a_position: [

                    this.MARGIN_LEFT * 2, this.MARGIN_TOP / 4, 0.0,
                    this.MARGIN_LEFT / 4, this.MARGIN_TOP / 4, 0.0,

                    this.MARGIN_LEFT / 4, this.MARGIN_TOP / 4, 0.0,
                    this.MARGIN_LEFT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,

                    this.MARGIN_LEFT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,
                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,

                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,
                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.MARGIN_TOP / 4, 0.0,

                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.MARGIN_TOP / 4, 0.0,
                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT * 2, this.MARGIN_TOP / 4, 0.0,
                ]

            }

        );

        this.meshes.createObject(

            "meshFullGameAreaLines",

            {

                a_position: [

                    this.MARGIN_LEFT / 4, this.MARGIN_TOP / 4, 0.0,
                    this.MARGIN_LEFT / 4, this.MARGIN_TOP / 4, 0.0,

                    this.MARGIN_LEFT / 4, this.MARGIN_TOP / 4, 0.0,
                    this.MARGIN_LEFT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,

                    this.MARGIN_LEFT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,
                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,

                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.GAME_SCREEN_HEIGHT - this.MARGIN_BOTTOM / 4, 0.0,
                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.MARGIN_TOP / 4, 0.0,

                    this.GAME_SCREEN_WIDTH - this.MARGIN_RIGHT / 4, this.MARGIN_TOP / 4, 0.0,
                    this.MARGIN_LEFT / 4, this.MARGIN_TOP / 4, 0.0,
                ]

            }

        );

        /*
         * Create models to render
         */
        this.models.createObject(   // name, x, y, w, h, meshId, uniformArray, shaderId, renderMode

            "modelQuad",

            0, 0, 1, 1,

            "meshQuad",

            {
                u_worldViewProjection: this.m4.identity(),

                u_diffuse: this.textures["default"],

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "texture_shader",

            this.gl.TRIANGLES

        );

        this.models.createObject(  // name, x, y, w, h, meshId, uniformArray, shaderId, renderMode

            "modelScore",

            this.GAME_SCREEN_WIDTH / 2,

            this.MARGIN_TOP / 4,

            this.SCORE_RECT_WIDTH,

            this.SCORE_RECT_HEIGHT,

            "meshQuad",

            {
                u_worldViewProjection: this.m4.identity(),

                u_diffuse: this.textures["score"].webglTexture,

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "texture_shader",

            this.gl.TRIANGLES

        );

        this.models.createObject(  // name, x, y, w, h, meshId, uniformArray, shaderId, renderMode

            "modelMaxScore",

            this.GAME_SCREEN_WIDTH / 2,

            this.GAME_SCREEN_HEIGHT * 0.6,

            this.GAME_SCREEN_WIDTH / 3,

            this.FONT_SIZE_3 + 4,

            "meshQuad",

            {
                u_worldViewProjection: this.m4.identity(),

                u_diffuse: this.textures["maxscoretext"].webglTexture,

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "texture_shader",

            this.gl.TRIANGLES

        );

        this.models.createObject(

            "modelTimer",

            this.GAME_SCREEN_WIDTH / 2,

            this.MARGIN_TOP / 4 + this.SCORE_RECT_HEIGHT + 2,

            this.SCORE_RECT_WIDTH,

            this.SCORE_RECT_HEIGHT,

            "meshQuad",

            {
                u_worldViewProjection: this.m4.identity(),

                u_diffuse: this.textures["timer"].webglTexture,

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "texture_shader",

            this.gl.TRIANGLES

        );

        this.models.createObject(   // name, meshId, uniformArray, shaderId, renderMode

            "modelButtonPlay",

            this.GAME_SCREEN_WIDTH / 2,

            this.GAME_SCREEN_HEIGHT * 0.5,

            this.GAME_SCREEN_WIDTH / 3,

            this.FONT_SIZE_3 + 4,

            "meshQuad",

            {
                u_worldViewProjection: this.m4.identity(),

                u_diffuse: this.textures["playtext"].webglTexture,

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "texture_shader",

            this.gl.TRIANGLES

        );

        this.models.createObject(

            "modelPuzzleAreaLines",

            0, 0, this.GAME_SCREEN_WIDTH, this.GAME_SCREEN_HEIGHT,

            "meshPuzzleAreaLines",

            {
                u_worldViewProjection: this.m4.identity(),

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "color_shader",

            this.gl.LINES

        );

        this.models.createObject(

            "modelGameAreaLines",

            0, 0, this.GAME_SCREEN_WIDTH, this.GAME_SCREEN_HEIGHT,

            "meshGameAreaLines",

            {
                u_worldViewProjection: this.m4.identity(),

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "color_shader",

            this.gl.LINES

        );

        this.models.createObject(

            "modelFullGameAreaLines",

            0, 0, this.GAME_SCREEN_WIDTH, this.GAME_SCREEN_HEIGHT,

            "meshFullGameAreaLines",

            {
                u_worldViewProjection: this.m4.identity(),

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "color_shader",

            this.gl.LINES

        );

        /*
         * create buttons
         */

        this.buttons.createButton(   //name, x, y, w, h, model, callback

            "playButton",

            this.models["modelButtonPlay"],

            function () { console.log("play button pressed") }


        );
        
        // after init, start the game loop
        this.loop(0);

    }

}());