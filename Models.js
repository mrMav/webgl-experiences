/*
 * models code
 * mrmav, 2018/09/05
 */

(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    // store all the objects to render here
    // I know that this is naive.
    // I'm just doing this as a fuck it project
    game.models = {};

    game.models.createObject = function (name, meshId, uniformArray, shaderId, renderMode) {

        if (game.models[name]) {

            console.warn(`Model with name '${name}' already exists.`);
            return false;

        }

        game.models[name] = {

            name: name,
            meshId: meshId,
            uniforms: uniformArray,
            shaderId: shaderId,
            renderMode: renderMode

        };

        return game.models[name];

    };

    game.models.render = function (model) {

        const shader = game.shaders.use(model.shaderId);
        const mesh = game.meshes[model.meshId];

        twgl.setBuffersAndAttributes(game.gl, shader, mesh.buffers);
        twgl.setUniforms(shader, model.uniforms);
        twgl.drawBufferInfo(game.gl, mesh.buffers, model.renderMode);

    }

}());