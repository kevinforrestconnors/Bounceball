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

function gameloop() {

}

var gamepadController = {

    ANALOGUE_BUTTON_THRESHOLD: 0.5,

    previousControllerState: {},
    controllers: {},
    ticking: false,

    /**
     * Starts a polling loop to check for gamepadController state.
     */
    startPolling: function() {
        // Don't accidentally start a second loop, man.
        if (!gamepadController.ticking) {
            gamepadController.controllers = clone(navigator.getGamepads());
            gamepadController.previousControllerState = clone(navigator.getGamepads());
            gamepadController.ticking = true;
            gamepadController.tick();
        }
    },

    /**
     * Stops a polling loop by setting a flag which will prevent the next
     * requestAnimationFrame() from being scheduled.
     */
    stopPolling: function() {
        gamepadController.ticking = false;
    },

    /**
     * A function called with each requestAnimationFrame(). Polls the gamepadController
     * status and schedules another poll.
     */
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

    /**
     * Checks for the gamepadController status. Monitors the necessary data and notices
     * the differences from previous state (buttons for Chrome/Firefox,
     * new connects/disconnects for Chrome). If differences are noticed, asks
     * to update the display accordingly. Should run as close to 60 frames per
     * second as possible.
     */
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

        //console.log(buttons[0][0].pressed, prevButtons[0][0].pressed);

        //if (buttons.length == prevButtons.length && buttons.length == axes.length && buttons.length == prevAxes.length) {

        for (var i = 0; i < buttons.length; i++) { // for each player

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

        } // end loop for players

        //} // end if

        // store previous state
        gamepadController.previousControllerState = clone(gamepadController.controllers);

    },

    onGamepadConnect: function(e) {
        gamepadController.startPolling();
        console.log("Controller connected");
    },

    onGamepadDisconnect: function(e) {
        console.log("Controller disconnected");
    }

};


window.addEventListener('gamepadconnected', gamepadController.onGamepadConnect, false);
window.addEventListener('gamepaddisconnected', gamepadController.onGamepadDisconnect, false);

