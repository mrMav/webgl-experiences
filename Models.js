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

    game.models.createObject = function (name, x, y, w, h, meshId, uniformArray, shaderId, renderMode) {

        if (game.models[name]) {

            console.warn(`Model with name '${name}' already exists.`);
            return false;

        }

        game.models[name] = {

            name: name,
            x: x,
            y: y,
            width: w,
            height: h,
            meshId: meshId,
            uniforms: uniformArray,
            shaderId: shaderId,
            renderMode: renderMode

        };

        game.models.update(game.models[name], game.projection);

        return game.models[name];

    };

    game.models.render = function (model) {

        const shader = game.shaders.use(model.shaderId);
        const mesh = game.meshes[model.meshId];

        twgl.setBuffersAndAttributes(game.gl, shader, mesh.buffers);
        twgl.setUniforms(shader, model.uniforms);
        twgl.drawBufferInfo(game.gl, mesh.buffers, model.renderMode);

    }

    game.models.update = function (model, projection) {

        game.m4.identity(model.uniforms.u_worldViewProjection);
        game.m4.translate(
            model.uniforms.u_worldViewProjection,
            [
                model.x,
                model.y,
                0
            ],
            model.uniforms.u_worldViewProjection);
        game.m4.scale(
            model.uniforms.u_worldViewProjection,
            [
                model.width,
                model.height,
                1
            ],
            model.uniforms.u_worldViewProjection);
        game.m4.multiply(projection, model.uniforms.u_worldViewProjection, model.uniforms.u_worldViewProjection);

    }

}());