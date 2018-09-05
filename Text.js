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
        
    game.text.createTextTexture = function (width, height, string, id, options) {

        if (game.textures[id]) {

            console.warn(`Texture with id '${id}' already exists. Try to use game.text.updateTextureText`);
            return false;

        }

        this._resizeCanvas(width, height);
        this._drawText(string);

        options = options || {};
        options.src = this.ctx.canvas;

        game.textures[id] = twgl.createTexture(game.gl, options);

    };

    game.text.updateTextureText = function(id, string) {

        if (!game.textures[id]) {

            console.warn(`Texture with id '${id}' doesn't exists.`);
            return false;

        }

        this._drawText(string);

        twgl.setTextureFromElement(game.gl, game.textures[id], this.ctx.canvas);

    };

    game.text._resizeCanvas = function (width, height) {

        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;

    }

    game.text._drawText = function (string) {

        let rectSize = Math.floor(game.TILE_SIZE / 5);  // 5 is the maximum number of units length of the characters
        let str = string.toUpperCase();                 // only uppercase stuff
        let offsetX = 0;

        this.ctx.save();

        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.fillStyle = this.foreground;

        for (let i = 0; i < str.length; i++) {

            let c = str[i];

            if (this.chars[c]) {

                let charWidth = 0;

                for (let y = 0; y < this.chars[c].length; y++) {

                    for (let x = 0; x < this.chars[c][y].length; x++) {

                        if (this.chars[c][y][x]) {

                            this.ctx.fillRect(x * rectSize + offsetX, y * rectSize, rectSize, rectSize);

                            charWidth = x * rectSize > charWidth ? x * rectSize : charWidth;
                            //console.log(`Painted char '${c}' at ${x * rectSize}, ${y * rectSize}, offset: ${charWidth}`);

                        }

                    }

                }

                offsetX += charWidth + rectSize * 2;

            } else {

                console.warn(`char '${c}' does not exist in letters dictionary.`);

            }

        }

        this.ctx.restore();

    }
    
}());