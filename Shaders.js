/*
 * shaders
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    // object to hold all the shader programs
    game.shaders = {};

    game.shaders.createShader = function (id, sources) {

        if (game.shaders[id]) {

            console.warn(`Shader with id '${id}' already exists.`);
            return false;

        }

        game.shaders[id] = twgl.createProgramInfo(game.gl, sources);

        return game.shaders[id];

    }

    game.shaders.use = function(id) {
        
        if (!game.shaders[id]) {

            console.warn(`Shader with id '${id}' doesn't exists.`);
            return false;

        }

        game.gl.useProgram(game.shaders[id].program);

        return game.shaders[id];

    }
    
}());