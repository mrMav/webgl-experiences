/*
 * The game loop
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.loop = function (time) {
        
        // update and clear viewport
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // calculate the projection matrix
        const aspect = this.gl.canvas.width / this.gl.canvas.height;
        const projection = this.m4.ortho(-this.gl.canvas.width / 2, this.gl.canvas.width / 2, this.gl.canvas.height / 2, -this.gl.canvas.height / 2, -1, 1);
        this.m4.translate(projection, this.cameraPosition, projection);

        // update the score text
        if (this.lasttime + this.interval < time) {

            this.text.updateTextureText("score", this.utils.convertScoreIntToString(++this.counter, 6))
            this.lasttime = time;

        }

        // render current falling shape
        this.currentShape.render(projection);

        // for each board position, render a quad
        // only if the value is 1
        for (let y = 0; y < this.board.length; y++) {

            for (let x = 0; x < this.board[0].length; x++) {

                if (this.board[y][x]) {

                    const quadModel = this.models["modelQuad"];
                    const world = this.m4.identity();

                    this.m4.translate(world, [x * this.TILE_SIZE + this.TILE_SIZE / 2 + this.MARGIN_LEFT, y * this.TILE_SIZE + this.TILE_SIZE / 2 + this.MARGIN_TOP, 0], world);
                    this.m4.scale(world, [this.TILE_SIZE / 2 - this.TILE_MARGIN / 2, this.TILE_SIZE / 2 - this.TILE_MARGIN / 2, 1], world);
                    this.m4.multiply(projection, world, quadModel.uniforms.u_worldViewProjection);

                    quadModel.uniforms.u_time = time;
                    
                    this.models.render(quadModel);

                }

            }

        }

        // render score quad
        const scoreModel = this.models["modelScore"];

        this.m4.identity(scoreModel.uniforms.u_worldViewProjection);
        this.m4.translate(
            scoreModel.uniforms.u_worldViewProjection,
            [
                this.GAME_SCREEN_WIDTH / 2 + this.TILE_SIZE * 0.5,                    
                this.SCORE_RECT_HEIGHT / 2 + 2,                     
                0                                                   
            ],
            scoreModel.uniforms.u_worldViewProjection);
        this.m4.scale(scoreModel.uniforms.u_worldViewProjection, [this.SCORE_RECT_WIDTH / 2, this.SCORE_RECT_HEIGHT / 2, 0], scoreModel.uniforms.u_worldViewProjection);
        this.m4.multiply(projection, scoreModel.uniforms.u_worldViewProjection, scoreModel.uniforms.u_worldViewProjection);

        this.models.render(scoreModel);

        // render decorative lines
        this.models["modelPuzzleAreaLines"].uniforms.u_worldViewProjection = projection;
        this.models["modelGameAreaLines"].uniforms.u_worldViewProjection = projection;

        this.models.render(this.models["modelPuzzleAreaLines"]);
        this.models.render(this.models["modelGameAreaLines"]);

        // update the logic. Yap, with the render loop.
        // this is a puzzle game man...
        this.update(time);


        requestAnimationFrame(game.loop.bind(this));

    }

}());