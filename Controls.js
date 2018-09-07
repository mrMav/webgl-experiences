/*
 * handle input from user
 * mrmav, 2018/09/07
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

    // input by hammer
    // see in the bottom the implementation of the handler functions
    game.hammer = new Hammer.Manager(document.getElementById("c"));
    game.hammer.add(new Hammer.Tap({ event: "tap", tap: 1 }));
    game.hammer.add(new Hammer.Swipe({ event: "swipedown", direction: Hammer.DIRECTION_DOWN }));
    game.hammer.add(new Hammer.Swipe({ event: "swipeleft", direction: Hammer.DIRECTION_LEFT }));
    game.hammer.add(new Hammer.Swipe({ event: "swiperight", direction: Hammer.DIRECTION_RIGHT }));

    /*
     * This is the input function for a keyboard play
     */
    game.handleKeysUp = function (keycode) {

        if (keycode === 37) {
            // left

            this.handleLeftMoveEvent();

        } else if (keycode === 38) {

            this.handleThrowDownEvent();

        } else if (keycode === 39) {
            // right

            this.handleRightMoveEvent();

        } else if (keycode === 40) {
            // down

            this.handleDownMoveEvent();

        } else if (keycode === 32) {
            //spacebar

            this.handleRotateEvent();

        }

    };

    /*
     * This is the input function handler for touch or mouse controls
     */
    game.handleTouchEvents = function (evt) {

        if (evt.type = "tap") {

            let canvasRect = game.gl.canvas.getBoundingClientRect();
            let middleDeadZone = canvasRect.width / 4;

            if (evt.center.x < canvasRect.x + canvasRect.width / 2 - middleDeadZone / 2) {
                // left side
                this.handleLeftMoveEvent();

            } else if (evt.center.x > canvasRect.x + canvasRect.width / 2 + middleDeadZone / 2) {
                // right side
                this.handleRightMoveEvent();

            } else {
                // middle dead zone
                this.handleRotateEvent();

            }

        }

    }

    game.hammer.on("tap", function (evt) {

        game.handleTouchEvents(evt);

    });

    game.hammer.on("swipedown", function (evt) {

        game.handleThrowDownEvent();

    });

    game.hammer.on("swipeleft", function (evt) {

        game.handleThrowLeftEvent();

    });

    game.hammer.on("swiperight", function (evt) {

        game.handleThrowRightEvent();

    });

}());