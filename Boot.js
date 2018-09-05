/*
 * boot the game
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.addEventListener("load", boot);

    function boot() {

        window.addEventListener("keydown", function (evt) {

            game.handleKeysUp(evt.keyCode)

            evt.stopPropagation();

        });

        game.init();

        requestAnimationFrame(game.loop.bind(game));

    };

}());