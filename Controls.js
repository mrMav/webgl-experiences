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
     * start listening events from keyboard
     */ 
    window.addEventListener("keydown", function (evt) {

        game.handleKeysUp(evt.keyCode)

        evt.stopPropagation();

    });

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
            
        if (game.state === game.GAME_STATE) {
            
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

                navigator.vibrate(30);

            }

        } else if (game.state === game.MENU_STATE) {

            let canvasRect = game.gl.canvas.getBoundingClientRect();

            let x = (evt.center.x - canvasRect.x) * this.widthRatio;
            let y = (evt.center.y - canvasRect.y) * this.heightRatio;

            for (let key in this.buttons) {

                if (typeof(this.buttons[key]) !== 'function') {

                    let model = this.buttons[key].model;

                    // model 0,0 at middle
                    if (x >= model.x - model.width / 2 && x <= model.x + model.width / 2 &&
                        y >= model.y - model.height / 2 && y <= model.y + model.height / 2) {

                        this.buttons[key].callback(evt);
                        
                    }

                }

            }


        }

    }

    game.hammer.on("tap", function (evt) {

        game.handleTouchEvents(evt);

    });

    game.hammer.on("swipedown", function (evt) {

        if (game.state === game.GAME_STATE)
            game.handleThrowDownEvent();

    });

    game.hammer.on("swipeleft", function (evt) {

        if (game.state === game.GAME_STATE)
            game.handleThrowLeftEvent();

    });

    game.hammer.on("swiperight", function (evt) {

        if (game.state === game.GAME_STATE)
            game.handleThrowRightEvent();

    });

}());