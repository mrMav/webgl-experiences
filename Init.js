/*
 * Init game components
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.init = function () {

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

        // make the top left coordinates 0,0
        this.cameraPosition = [-this.gl.canvas.width / 2, -this.gl.canvas.height / 2, 0.0];
        
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
                    255, 255, 255, 255,   255, 255, 255, 255,
                    // 3                  //4 
                    255, 255, 255, 255,     255, 255, 255, 255,

                ]

            }

        );

        this.text.createTextTexture(this.SCORE_RECT_WIDTH, this.SCORE_RECT_HEIGHT, "000000", "score", { minMag: this.gl.NEAREST });


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

        /*
         * Create models to render
         */
        this.models.createObject(   // name, meshId, uniformArray, shaderId, renderMode

            "modelQuad",

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

        this.models.createObject(   // name, meshId, uniformArray, shaderId, renderMode

            "modelScore",

            "meshQuad",

            {
                u_worldViewProjection: this.m4.identity(),

                u_diffuse: this.textures["score"],

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "texture_shader",

            this.gl.TRIANGLES

        );

        this.models.createObject(   // name, meshId, uniformArray, shaderId, renderMode

            "modelPuzzleAreaLines",

            "meshPuzzleAreaLines",

            {
                u_worldViewProjection: this.m4.identity(),
                
                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "color_shader",

            this.gl.LINES

        );

        this.models.createObject(   // name, meshId, uniformArray, shaderId, renderMode

            "modelGameAreaLines",

            "meshGameAreaLines",

            {
                u_worldViewProjection: this.m4.identity(),

                u_color: [1.0, 1.0, 1.0, 1.0],

                u_time: 0
            },

            "color_shader",

            this.gl.LINES

        );


    }

}());