/*
 * code to handle te generation of
 * textures containing text strings
 * mrmav, 2018/09/05
 */

(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    /*
     * The text properties and methods
     * will be held in a text object inside
     * the game object
     */
    game.text = game.text || {};

    // the context where text is drawn
    game.text.ctx = document.createElement("canvas").getContext("2d");

    game.text.foreground = "rgba(255, 255, 255, 255)";
    game.text.background = "rgba(0, 0, 0, 255)";
    game.text.alignHorizontal = "center";
    game.text.alignVertical = "center";
    game.text.rectSize = Math.floor(game.TILE_SIZE / 5);
        
    game.text.createTextTexture = function (width, height, string, id, options) {

        if (game.textures[id]) {

            console.warn(`Texture with id '${id}' already exists. Try to use game.text.updateTextureText`);
            return false;

        }

        let ctx = document.createElement("canvas").getContext("2d");
        
        this._resizeCanvas(ctx.canvas, width, height);
        this._drawText(ctx, string);

        options = options || {};
        options.src = ctx.canvas;

        let texture = {

            ctx: ctx,
            webglTexture: twgl.createTexture(game.gl, options)

        };

        game.textures[id] = texture;

    };

    game.text.updateTextureText = function(id, string) {

        if (!game.textures[id]) {

            console.warn(`Texture with id '${id}' doesn't exists.`);
            return false;

        }

        this._drawText(game.textures[id].ctx, string);

        twgl.setTextureFromElement(game.gl, game.textures[id].webglTexture, game.textures[id].ctx.canvas);

    };

    game.text._resizeCanvas = function (canvas, width, height) {
        
        canvas.width = width;
        canvas.height = height;

    }

    game.text._drawText = function (ctx, string) {

        let str = string.toUpperCase();                 // only uppercase stuff

        let centerX = 0;
        let centerY = 0;
        let offsetY = 0;
        let offsetX = 0;
        let totalTextWidth = this._calculateTextWidth(str);
        let totalTextHeight = this.rectSize * 5;

        if (this.alignHorizontal === "center") {

            centerX = ctx.canvas.width / 2;
            offsetX = centerX - totalTextWidth  / 2;

        }

        if (this.alignVertical === "center") {

            centerY = ctx.canvas.height / 2;
            offsetY = centerY - totalTextHeight / 2;

        }
               
        ctx.save();

        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = this.foreground;

        for (let i = 0; i < str.length; i++) {

            let c = str[i];

            if (this.chars[c]) {

                let charWidth = 0;

                for (let y = 0; y < this.chars[c].length; y++) {

                    for (let x = 0; x < this.chars[c][y].length; x++) {

                        if (this.chars[c][y][x]) {

                            ctx.fillRect(x * this.rectSize + offsetX, y * this.rectSize + offsetY, this.rectSize, this.rectSize);

                            charWidth = x * this.rectSize > charWidth ? x * this.rectSize : charWidth;
                            //console.log(`Painted char '${c}' at ${x * this.rectSize}, ${y * this.rectSize}, offset: ${charWidth}`);

                        }

                    }

                }

                offsetX += charWidth + this.rectSize * 2;

            } else {

                console.warn(`char '${c}' does not exist in letters dictionary.`);

            }

        }

        ctx.restore();

    }

    game.text._calculateTextWidth = function (str) {

        let result = 0;

        str = str.toUpperCase();

        for (let i = 0; i < str.length; i++) {

            let c = str[i];

            if (this.chars[c]) {

                let charWidth = 0;

                for (let y = 0; y < this.chars[c].length; y++) {

                    for (let x = 0; x < this.chars[c][y].length; x++) {

                        if (this.chars[c][y][x]) {

                            charWidth = x * this.rectSize > charWidth ? x * this.rectSize : charWidth;

                        }

                    }

                }

                result += charWidth + this.rectSize * 2;

            } else {

                console.warn(`char '${c}' does not exist in letters dictionary.`);

            }

        }

        return result;

    }
    
}());