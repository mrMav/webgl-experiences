/*
 * Textures
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    // holds all the textures by key
    game.textures = {};

    game.textures.createTexture = function(id, options) {

        if (game.textures[id]) {

            console.warn(`Texture with id '${id}' already exists.`);
            return false;

        }

        game.textures[id] = twgl.createTexture(game.gl, options);

        return game.textures[id];

    }


}());