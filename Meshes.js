/*
 * renderables code
 * mrmav, 2018/09/05
 */

(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    // store all the objects to render here
    // I know that this is naive.
    // I'm just doing this as a fuck it project
    game.meshes = {};

    game.meshes.createObject = function (name, attribArray) {

        if (game.meshes[name]) {

            console.warn(`Mesh with name '${name}' already exists.`);
            return false;

        }

        game.meshes[name] = {

            name: name,
            buffers: twgl.createBufferInfoFromArrays(game.gl, attribArray)

        };

        return game.meshes[name];

    };

}());