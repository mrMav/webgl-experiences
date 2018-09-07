/*
 * buttons
 * mrmav, 2018/09/07
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.buttons = {};

    game.buttons.createButton = function (name, model, callback) {

        /* each button will need:
         * 
         * - a model to render
         * - a texture to display
         * - a rectangle for hit test
         * - a callback to the action it performs
         * 
         */ 

        const button = {

            name: name,
            model: model,
            callback: callback

        }

        game.buttons[name] = button;

    }

    game.buttons.renderButton = function (button) {

        game.models.render(button.model);

    }

    game.buttons.hitTest = function (x, y, button) {

        if (x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.x + button.height) {

            game.buttons.performButtonAction(button);

        }

    }

    game.buttons.performButtonAction = function (button) {

        button.callback();

    }

}());