/*
 * handle input from user
 * mrmav, 2018/09/07
 */
(function () {

    "use strict";

    window.game = window.game || {};
    const game = window.game;

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

        let evtX = evt.detail.events[0].clientX;
        let evtY = evt.detail.events[0].clientY;

        this.vibrate(this.VIBRATION_INTENSITY_1);

        if (game.state === game.GAME_STATE) {

            let canvasRect = game.gl.canvas.getBoundingClientRect();
            let middleDeadZone = canvasRect.width / 4;

            if (evtX < canvasRect.x + canvasRect.width / 2 - middleDeadZone / 2) {
                // left side
                this.handleLeftMoveEvent();

            } else if (evtX > canvasRect.x + canvasRect.width / 2 + middleDeadZone / 2) {
                // right side
                this.handleRightMoveEvent();

            } else {
                // middle dead zone
                this.handleRotateEvent();

            }


        } else if (game.state === game.MENU_STATE) {

            let canvasRect = game.gl.canvas.getBoundingClientRect();

            let x = (evtX - canvasRect.x) * this.widthRatio;
            let y = (evtY - canvasRect.y) * this.heightRatio;

            for (let key in this.buttons) {

                if (typeof (this.buttons[key]) !== 'function') {

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

    // input by zingtouch
    let touchArea = document.getElementById("c");
    game.touch = new ZingTouch.Region(touchArea);

    game.touch.bind(touchArea, "tap", function(evt) {

        game.handleTouchEvents(evt);

    }, false);

    game.touch.bind(touchArea, "swipe", function(evt) {

        if(game.state === game.GAME_STATE){
            
            let dir = evt.detail.data[0].currentDirection;
            
            let tolerance = 20;
            
            if(dir <= tolerance || dir >= 360 - tolerance){
                
                game.handleThrowRightEvent();
                
            }

            if(dir >= 180 - tolerance && dir <= 180 + tolerance){
                
                game.handleThrowLeftEvent();  
                
            }

            if(dir >= 270 - tolerance && dir <= 270 + tolerance){
                
                game.handleThrowDownEvent();  
                
            }

        }
            
    }, false);

}());