/*
 * colection of helper functions
 * mrmav, 2018/09/05
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    game.utils = {};

    game.utils.convertScoreIntToString = function(int, size) {

        let s = "000000" + int;

        if (int > 999999) {

            s = "999999";

        }

        return s.substr(s.length - size);
    }

    game.utils.rand = function (min, max) {

        if (max === undefined) {
            max = min;
            min = 0;
        }
        return min + Math.random() * (max - min);
    }

}());