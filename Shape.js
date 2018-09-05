/*
 * code to handle the shapes behaviour
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.shape = function (type) {

        this.type = type;
        this.rotation = 0;
        this.position = new game.point(0, 0);
        this.marginLeft = 0;
        this.marginRight = 0;
        this.marginUp = 0;
        this.marginDown = 0;

        this.calculateMargins();

        this.position.y = -this.marginUp;

    }

    game.shape.prototype.render = function (projection) {

        for (var i = 0; i < game.shapes[this.type].rotations[this.rotation].length; i++) {

            for (var j = 0; j < game.shapes[this.type].rotations[this.rotation][i].length; j++) {

                if (game.shapes[this.type].rotations[this.rotation][i][j] === 1) {

                    let x = (this.position.x + j) * game.TILE_SIZE + game.TILE_SIZE / 2 + game.MARGIN_LEFT;
                    let y = (this.position.y + i) * game.TILE_SIZE + game.TILE_SIZE / 2 + game.MARGIN_TOP;

                    // ---

                    const quadModel = game.models["modelQuad"];
                    const world = game.m4.identity();

                    game.m4.translate(world, [x, y, 0], world);
                    game.m4.scale(world, [game.TILE_SIZE / 2 - game.TILE_MARGIN / 2, game.TILE_SIZE / 2 - game.TILE_MARGIN / 2, 1], world);
                    game.m4.multiply(projection, world, quadModel.uniforms.u_worldViewProjection);

                    quadModel.uniforms.u_time = 0;

                    game.models.render(quadModel);

                    // ---

                }

            }

        }

    }

    game.shape.prototype.moveDown = function () {

        this.position.y++;

    }

    game.shape.prototype.moveLeft = function () {

        this.position.x--;

    }

    game.shape.prototype.moveRight = function () {

        this.position.x++;

    }

    game.shape.prototype.calculateMargins = function () {

        this.calculateMarginLeft();
        this.calculateMarginRight();
        this.calculateMarginUp();
        this.calculateMarginDown();

    }

    game.shape.prototype.calculateMarginLeft = function () {

        var matrix = game.shapes[this.type].rotations[this.rotation];
        var leftValues = [];

        for (var i = 0; i < matrix.length; i++) {

            for (var j = 0; j < matrix[i].length; j++) {

                if (matrix[i][j] === 1) {

                    leftValues.push(j);

                }

            }

        }

        leftValues.sort(game.utils.sortNumber);

        this.marginLeft = leftValues[0];

    }

    game.shape.prototype.calculateMarginRight = function () {

        var matrix = game.shapes[this.type].rotations[this.rotation];
        var rightValues = [];

        for (var i = 0; i < matrix.length; i++) {

            // notice it is backwards looping:
            for (var j = matrix[i].length - 1; j >= 0; j--) {

                if (matrix[i][j] === 1) {

                    rightValues.push(matrix[0].length - 1 - j);

                }

            }

        }

        rightValues.sort(game.utils.sortNumber);

        this.marginRight = rightValues[0];

    }

    game.shape.prototype.calculateMarginUp = function () {

        var matrix = game.shapes[this.type].rotations[this.rotation];
        var upValues = [];

        for (var i = 0; i < matrix.length; i++) {

            for (var j = 0; j < matrix[i].length; j++) {

                if (matrix[i][j] === 1) {

                    upValues.push(i);

                }

            }

        }

        upValues.sort(game.utils.sortNumber);

        this.marginUp = upValues[0];

    }

    game.shape.prototype.calculateMarginDown = function () {

        var matrix = game.shapes[this.type].rotations[this.rotation];
        var downValues = [];

        for (var i = matrix.length - 1; i >= 0; i--) {

            // notice it is backwards looping:
            for (var j = 0; j < matrix[i].length; j++) {

                if (matrix[i][j] === 1) {

                    downValues.push(matrix.length - 1 - i);

                }

            }

        }

        downValues.sort(game.utils.sortNumber);

        this.marginDown = downValues[0];

    }


}())