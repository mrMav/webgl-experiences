/*
 * Init game components
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.loop = function (time) {
        
        switch (this.state) {

            case this.MENU_STATE:

                this.menuloop(time);
                break;

            case this.GAME_STATE:

                this.gameloop(time);
                break;

            case this.OPTIONS_STATE:

                // TODO
                break;

            case this.CREDITS_STATE:

                // TODO
                break;

            default:

                console.log("switch default case");

        }

        requestAnimationFrame(this.loop.bind(this));
            
    }

}());