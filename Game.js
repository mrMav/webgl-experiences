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

    game.lasttime = 0;
    game.interval = 0;
    game.counter = 0;
    game.board = [

        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1]

    ];

        
}());