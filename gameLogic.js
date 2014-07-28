// general functions

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function randomRGB() {
    return "rgb(" + randomInt(0, 255) + "," + randomInt(0, 255) + "," + randomInt(0, 255) + ")";
}

// map

var map = {
    width: 700,
    height: 700
};

// players

function Player(name) {

    this.name = name;
    this.HP = 10;

    this.direction = 0;
    this.position = {
        x: Math.random() * map.width,
        y: Math.random() * map.height
    };

    this.velocity = {
        x: 0,
        y: 0
    };

    this.shotSmall = {
        current: 90,
        max: 90,
        notOffCooldown: function() {}
    };

    this.shotBig = {
        current: 600,
        max: 600,
        notOffCooldown: function() {}
    };

    this.invisBody = {
        current: 900,
        max: 900,
        notOffCooldown: function() {}
    };

    this.invisArrow = {
        current: 300,
        max: 300,
        notOffCooldown: function() {}
    };

    this.speedBoost = {
        current: 900,
        max: 900,
        notOffCooldown: function() {}
    };

    this.spells = [this.shotSmall, this.shotBig, this.invisBody, this.invisArrow, this.speedBoost];

    this.cooldown = function() {
        for (var i = 0; i < this.spells.length; i++) {
            this.spells.current--;
        }
    };

    this.castSpell = function(spell) {
        if (spell.current < 0) { // off cooldown
            spell.current = spell.max;
        } else {
            spell.notOffCooldown();
        }
    };

}

var players = [];

function init() {

    background();

    var numPlayers = 0;
    for (var i = 0; i < navigator.getGamepads().length; i++) {
        if (navigator.getGamepads()[i]) {
            numPlayers++;
        }
    }

    for (var i = 0; i < numPlayers; i++) {
        players.push(new Player());
    }



} // end init

function gameLoop() {

    background();

    for (var i = 0; i < players.length; i++) {

        var p = players[i];

        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;

        circle(p.position.x, p.position.y, 50, "#EEE");

    }

} // end gameLoop
