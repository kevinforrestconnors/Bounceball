var gameState = {

    mousePosition: {
        x: 0,
        y: 0
    },

    score: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    },

    state: 'gui',

    resizeGame: function() {
        $('#game').width(1).height(1);
        $('#gui').width(1).height(1);
        var s = $(document).height() - 40;
        $('#game').width(s).height(s);
        $('#gui').width(s).height(s);
        $('.triangle-left').css({
            top: ((s / 2) - 40) + "px",
            left: "-30px"
        });
        $('.triangle-right').css({
            top: ((s / 2) - 40) + "px",
            left: "-40px"
        });
    },

    drawGui: function() {

        guiCtx.fillStyle = "#000";

        guiCtx.font = 'bold 60pt Baskerville';
        guiCtx.fillText('Bounceball', 30, 150);

        guiCtx.font = 'bold 15pt Baskerville';
        guiCtx.fillText('A game by Kevin Connors', 110, 180);

        guiCtx.font = 'bold 17pt Copperplate';
        guiCtx.fillText('Controllers connected: ' + gamepadController.numControllersConnected(), 360, 300);

        guiCtx.font = 'bold 100pt Copperplate';
        guiCtx.fillText('2', 140, 460);
        guiCtx.fillText('3', 465, 460);
        guiCtx.fillText('4', 790, 460);

        guiCtx.font = 'bold 25pt Baskerville';
        guiCtx.fillText('Players', 120, 500);
        guiCtx.fillText('Players', 445, 500);
        guiCtx.fillText('Players', 770, 500);

        guiCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
        guiCtx.fillRect(0, 0, guiCanvas.width, guiCanvas.height / 3);

        guiCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
        guiCtx.fillRect(0, guiCanvas.height / 3, guiCanvas.width / 3, guiCanvas.height * (2/3)); // 2 player pane

        guiCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        guiCtx.fillRect(guiCanvas.width / 3, guiCanvas.height / 3, guiCanvas.width / 3, guiCanvas.height * (2/3)); // 3 player pane

        guiCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
        guiCtx.fillRect(guiCanvas.width * (2/3), guiCanvas.height / 3, guiCanvas.width / 3, guiCanvas.height * (2/3)); // 4 player pane




    },

    selectPlayers: function() {

        gameState.drawGui();

        $("#gui").click(function(e) {

            var w = $(this).width();
            var h = $(this).height();
            var posX = $(this).offset().left;
            var posY = $(this).offset().top;
            var relativeClickX = e.pageX - posX;
            var relativeClickY = e.pageY - posY;

            if (relativeClickY > h / 3) {

                if (relativeClickX > w * (2/3)) {
                    numPlayers = 4;
                } else if (relativeClickX > w / 3) {
                    numPlayers = 3;
                } else {
                    numPlayers = 2;
                }

                if (numPlayers === gamepadController.numControllersConnected()) {
                    map.width = numPlayers * 500;
                    map.height = numPlayers * 500;
                    gameState.playingGame();
                }

            }

        });



    },

    playingGame: function() {

        gameState.state = 'game';
        guiCanvas.width = guiCanvas.width; // clear canvas

        background();

        var compareGamepads = function(a,b) {
            return a.id - b.id;
        };

        players = [];

        var pn = 0;

        while (pn < numPlayers) {

            if (navigator.getGamepads()[pn]) {
                var fixedName = "a" + navigator.getGamepads()[pn].id.trim() + navigator.getGamepads()[pn].index; // a added to beginning in case the ID starts with a number
                players[fixedName] = new Player(navigator.getGamepads()[pn].id, navigator.getGamepads()[pn].index);
            }

            pn++;

            if (pn >= 4) {
                if (players.length != numPlayers) {
                    alert("Something went wrong, please refresh the page!");
                }
                break;
            }

        }

    },

    gamePaused: function() {

        if (resumeclicked) {
            guiCanvas.width = guiCanvas.width; // clear canvas
        } else if (restartClicked) {
            players = [];
            gameState.selectPlayers();
        }

    },

    gameOverGui: function() {

    },

    gameOver: function() {



    },

    gamepadsNotSupported: function() {
        alert("Looks like your browser or OS does not support the Gamepad API.  This unfortunately means you cannot play Bounceball :(");
    }

};

