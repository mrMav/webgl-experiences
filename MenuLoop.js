/*
 * The menu loop
 * mrmav, 2018/09/09
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.menuloop = function (time) {

        this.ellapsedtime = time;

        // update and clear viewport        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // update the play button
        const button = this.buttons["playButton"];
        this.buttons.renderButton(button);

        if (this.storage.available) {

            // update the score text
            this.text.foreground = "#ffffff";
            this.text.updateTextureText("score", this.utils.convertScoreIntToString(game.highscore, 6));     
            
            // render max score quad
            this.models.render(this.models["modelMaxScore"]);

            let model = this.models["modelScore"];
            model.x = this.GAME_SCREEN_WIDTH / 2;
            model.y = this.GAME_SCREEN_HEIGHT * 0.65;

            this.models.update(model, this.projection);
            this.models.render(this.models["modelScore"]);
                       
        }

        this.models["modelFullGameAreaLines"].uniforms.u_worldViewProjection = this.projection;
        this.models.render(this.models["modelFullGameAreaLines"]);
        
    }

}());