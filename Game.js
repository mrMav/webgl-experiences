/* 
 * Game configuration file 
 * mrmav, 2018/09/05 
 */ 

(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    /*
     * Constants
     */

    game.BOARD_WIDTH = 12;
    game.BOARD_HEIGHT = 24;
    game.TILE_SIZE = 16;
    game.TILE_MARGIN = game.TILE_SIZE / 8;
    game.LINE_THICKNESS = 2;
    game.MARGIN_TOP = game.TILE_SIZE * 2;
    game.MARGIN_BOTTOM = game.TILE_SIZE * 2;
    game.MARGIN_RIGHT = game.TILE_SIZE * 2;
    game.MARGIN_LEFT = game.TILE_SIZE * 2;
    game.GAME_SCREEN_WIDTH = game.BOARD_WIDTH * game.TILE_SIZE + game.MARGIN_LEFT + game.MARGIN_RIGHT;
    game.GAME_SCREEN_HEIGHT = game.BOARD_HEIGHT * game.TILE_SIZE + game.MARGIN_TOP + game.MARGIN_BOTTOM;
    game.FONT_SIZE_1 = Math.floor(game.TILE_SIZE * 0.5 / 5) * 5;
    game.FONT_SIZE_2 = Math.floor(game.TILE_SIZE / 5) * 5;
    game.FONT_SIZE_3 = Math.floor(game.TILE_SIZE * 2 / 5) * 5;
    game.SCORE_RECT_WIDTH = game.FONT_SIZE_2 * 6;
    game.SCORE_RECT_HEIGHT = game.FONT_SIZE_2;

    /*
     * Properties for gameplay
     */

    game.lastframe = 0;
    game.lasttime = 0;
    game.interval = 0;
    game.counter = 0;
    game.board = [];
    game.currentShape = null;
    game.nextShape = null;
    game.lastFrame = 0;
    game.interval = 1000;
    game.spawnNewShape = false;
    game.score = 0;
    game.endGame = false;

    /*
     * Methods for gameplay
     */
    
    game.spawnShape = function (type) {

        type = type || "SHAPE_" + game.utils.randomInt(1, 7);

        this.currentShape = this.nextShape;

        this.nextShape = new game.shape(type);

        this.nextShape.position.x = this.BOARD_WIDTH + 1;

        this.currentShape.position.x = Math.floor(this.BOARD_WIDTH / 2) - 2;
        this.currentShape.position.y = -this.currentShape.marginUp;

        this.spawnNewShape = false;

        if (this.checkOverlap()) {

            this.endGame = true;

        }

    }

    game.update = function (time) {

        if (!this.endGame) {

            if (performance.now() > game.lastFrame + game.interval) {

                // check collisions
                let collisions = game.checkAdjacent();

                // if there are collisions in the bottom
                if (game.utils.checkArrayElementExists(collisions, "bottom")) {

                    this.spawnNewShape = true;

                } else {

                    this.spawnNewShape = false;

                }

                if (this.spawnNewShape) {

                    game.transferShapeToBoard();

                    this.spawnShape();

                    return;

                }

                // automatic movement
                this.currentShape.moveDown();

                game.lastFrame = performance.now();

            }

            game.checkCompleteLines();

        }

    }

    game.checkAdjacent = function (matrixRotation) {

        let result = [];
        let rotation = matrixRotation || this.currentShape.rotation;
        let matrixShape = game.shapes[this.currentShape.type].rotations[rotation];

        // start looping where the shape begins:
        for (var i = this.currentShape.position.y, ii = 0; i < this.currentShape.position.y + 4; i++ , ii++) {

            for (var j = this.currentShape.position.x, jj = 0; j < this.currentShape.position.x + 4; j++ , jj++) {

                if (matrixShape[ii][jj] === 1) {

                    // if it is the floor
                    if (i >= this.BOARD_HEIGHT - 1) {

                        result.push("bottom");

                    } else if (this.board[i + 1][j] != 0) {

                        result.push("bottom");

                    }

                    // ooor if there is something to the left:
                    if (this.board[i][j - 1] != 0) {

                        result.push("left");

                    }

                    // ooooooor if there is something to the right:
                    if (this.board[i][j + 1] != 0) {

                        result.push("right");

                    }

                }

            }

        }

        return result;

    }

    game.checkOverlap = function (matrixRotation) {

        var rotation = matrixRotation || this.currentShape.rotation;
        var matrixShape = game.shapes[this.currentShape.type].rotations[rotation];

        // start looping where the shape begins:
        for (var i = this.currentShape.position.y, ii = 0; i < this.currentShape.position.y + 4; i++ , ii++) {

            for (var j = this.currentShape.position.x, jj = 0; j < this.currentShape.position.x + 4; j++ , jj++) {

                if (matrixShape[ii][jj] === 1) {

                    if (this.board[i][j] != 0) {

                        return true;

                    }

                }

            }

        }

        return false;

    }

    game.checkCompleteLines = function () {

        // look up for zeros.
        // if no zeros, it is a score.

        let score = 0;
        let completeLines = 0;
        let totalScore = 0;

        for (let i = this.BOARD_HEIGHT - 1; i >= 0; i--) {

            if (this.board[i].indexOf(0) < 0) {

                console.log("Score detected")

                // score	
                completeLines++;

                // remove this line
                this.board.splice(i, 1);

                // add another one to the top
                let newLine = new Array(this.boardWidth + 1).join('0').split('').map(parseFloat);

                this.board.splice(0, 0, newLine);

            }

        }

        totalScore = completeLines * 100;
        this.score += totalScore;
        this.interval -= this.interval <= 100 ? 0 : completeLines * 50;

    }

    game.transferShapeToBoard = function () {

        var matrixShape = game.shapes[this.currentShape.type].rotations[this.currentShape.rotation];

        // start looping where the shape begins:
        for (var i = this.currentShape.position.y, ii = 0; i < this.currentShape.position.y + 4; i++ , ii++) {

            for (var j = this.currentShape.position.x, jj = 0; j < this.currentShape.position.x + 4; j++ , jj++) {

                if (matrixShape[ii][jj] === 1) {

                    this.board[i][j] = game.shapes[this.currentShape.type].color;

                }

            }

        }

    }
        
}());