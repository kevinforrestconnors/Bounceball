function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ];
    var result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) {
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}



var gamepadController = {


    ANALOGUE_BUTTON_THRESHOLD: 0.5, // we don't want analogue buttons to trigger too early from not enough pressure, or to not trigger at all because it isn't pressed down all the way

    previousControllerState: {},
    controllers: {},
    ticking: false,

    startPolling: function() {
        // Don't accidentally start a second loop, man.
        if (!gamepadController.ticking) {
            gamepadController.controllers = clone(navigator.getGamepads());
            gamepadController.previousControllerState = clone(navigator.getGamepads());
            gamepadController.ticking = true;
            gamepadController.tick();
        }
    },

    stopPolling: function() {
        gamepadController.ticking = false;
    },

    tick: function() {
        gamepadController.pollStatus();
        gameLoop();
        gamepadController.scheduleNextTick();
    },

    scheduleNextTick: function() {
        // Only schedule the next frame if we haven't decided to stop via
        // stopPolling() before.
        if (gamepadController.ticking) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(gamepadController.tick);
            } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(gamepadController.tick);
            } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(gamepadController.tick);
            }
            // Note lack of setTimeout since all the browsers that support
            // Gamepad API are already supporting requestAnimationFrame().
        }
    },

    pollStatus: function() {
        // retrieve current state
        gamepadController.controllers = clone(navigator.getGamepads());

        var buttons = [];
        var prevButtons = [];

        var axes = [];
        var prevAxes = [];

        for (var player in gamepadController.controllers) {
            if (gamepadController.controllers.hasOwnProperty(player)) {
                buttons.push(gamepadController.controllers[player].buttons);
                axes.push(gamepadController.controllers[player].axes);
            }
        }

        for (var previousPlayer in gamepadController.previousControllerState) {
            if (gamepadController.previousControllerState.hasOwnProperty(previousPlayer)) {
                prevButtons.push(gamepadController.previousControllerState[previousPlayer].buttons);
                prevAxes.push(gamepadController.previousControllerState[previousPlayer].axes);
            }
        }

        //console.log(axes);

        if (buttons.length == prevButtons.length && buttons.length == axes.length && buttons.length == prevAxes.length) {

            for (var i = 0; i < players.length; i++) { // for each player

                for (var j = 0; j < buttons[i].length; j++) {

                    if (buttons[i][j].pressed) { // currently pressed

                        if (prevButtons[i][j].pressed) { // was pressed last tick too, so trigger onHold
                            buttonBindings[j].onHold();
                        } else { // was not pressed last tick, so trigger onPress
                            buttonBindings[j].onPress();
                        }

                    } else { // not pressed

                        if (prevButtons[i][j].pressed) { // was pressed last tick, but isn't anymore, so trigger onRelease
                            buttonBindings[j].onRelease();
                        } else {
                            if (buttonBindings[j].onIdle) { // if it does something when not pressed continuously
                                buttonBindings[j].onIdle();
                            }
                        }

                    } // end if-else

                } // end loop for buttons

                players[i].joySticks.leftJS.x = axes[i][0];
                players[i].joySticks.leftJS.y = axes[i][1];

                players[i].joySticks.rightJS.x = axes[i][2];
                players[i].joySticks.rightJS.y = axes[i][3];

                if (players[i].joySticks.leftJS.mag() > gamepadController.ANALOGUE_BUTTON_THRESHOLD) {
                    players[i].direction = players[i].joySticks.leftJS.angle()
                }

                if (players[i].joySticks.rightJS.mag() > gamepadController.ANALOGUE_BUTTON_THRESHOLD) {
                    players[i].aimDirection = players[i].joySticks.rightJS.angle();
                }

            } // end loop for players

        } // end if

        // store previous state
        gamepadController.previousControllerState = clone(gamepadController.controllers);

    },

    onGamepadConnect: function(e) {
        console.log("Controller connected");
        players.push(new Player());
    },

    onGamepadDisconnect: function(e) {
        console.log("Controller disconnected");
    }

};


window.addEventListener('gamepadconnected', gamepadController.onGamepadConnect, false);
window.addEventListener('gamepaddisconnected', gamepadController.onGamepadDisconnect, false);

