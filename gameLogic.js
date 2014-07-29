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
    this.color = randomRGB();
    this.aad = 20; // aim arrow distance
    this.HP = 10;
    this.restitution = 0.7;
    this.speed = 0.35;

    this.joySticks = {

        leftJS: {
            x: 0,
                y: 0,
                mag: function() {
                return (this.x * this.x) + (this.y * this.y);
            },
            angle: function() {

                var result = Math.atan(Math.abs(this.y) / Math.abs(this.x)); // only do the calculation once, determine quadrant and adjust for that

                if (this.x === 0) { // straight up or straight down, causes problems with dividing (Y / 0)
                    if (this.y >= 0) {
                        return Math.PI * 1.5;
                    } else {
                        return Math.PI / 2;
                    }
                }

                if (this.x > 0 && this.y < 0) { // 1st quadrant
                    return result;
                } else if (this.x < 0 && this.y < 0) { // 2nd quadrant
                    return Math.PI - result;
                } else if (this.x < 0 && this.y > 0) { // 3rd quadrant
                    return Math.PI + result;
                } else { // 4th quadrant
                    return (Math.PI * 2) - result;
                }

            } // end angle
        },
        rightJS: {
            x: 0,
                y: 0,
                mag: function() {
                return (this.x * this.x) + (this.y * this.y);
            },
            angle: function() {

                var result = Math.atan(Math.abs(this.y) / Math.abs(this.x)); // only do the calculation once, determine quadrant and adjust for that

                if (this.x === 0) { // straight up or straight down, causes problems with dividing (Y / 0)
                    if (this.y >= 0) {
                        return Math.PI * 1.5;
                    } else {
                        return Math.PI / 2;
                    }
                }

                if (this.x > 0 && this.y < 0) { // 1st quadrant
                    return result;
                } else if (this.x < 0 && this.y < 0) { // 2nd quadrant
                    return Math.PI - result;
                } else if (this.x < 0 && this.y > 0) { // 3rd quadrant
                    return Math.PI + result;
                } else { // 4th quadrant
                    return (Math.PI * 2) - result;
                }

            } // end angle
        }
    };

    this.direction = 0;
    this.aimDirection = 0;
    this.radius = 50;
    this.pos = {
        x: Math.random() * map.width,
        y: Math.random() * map.height
    };

    this.vel = {
        x: 0,
        y: 0
    };

    this.shotSmall = {
        current: 90,
        max: 90,
        action: function() {
            console.log("SHOT")
        },
        notOffCooldown: function() {console.log("not off cooldown")}
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
            spell.action();
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

    gamepadController.startPolling();

} // end init

function gameLoop() {

    background();

    for (var i = 0; i < players.length; i++) {

        var p = players[i];

        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;

        // collision test
        if (p.pos.x > map.width - p.radius) {
            p.pos.x = map.width - p.radius;
            p.vel.x *= (p.restitution * -1);
            p.pos.x += p.vel.x * 2;
        } else if (p.pos.x < p.radius) {
            p.pos.x = p.radius;
            p.vel.x *= (p.restitution * -1);
            p.pos.x += p.vel.x * 2;
        }

        if (p.pos.y > map.height - p.radius) {
            p.pos.y = map.height - p.radius;
            p.vel.y *= (p.restitution * -1);
            p.pos.y += p.vel.y * 2;
        } else if (p.pos.y < p.radius) {
            p.pos.y = p.radius;
            p.vel.y *= (p.restitution * -1);
            p.pos.y += p.vel.y * 2;
        }

        // change velocity
        p.vel.x += p.joySticks.leftJS.mag() * Math.cos(p.joySticks.leftJS.angle()) * p.speed;
        p.vel.y -= p.joySticks.leftJS.mag() * Math.sin(p.joySticks.leftJS.angle()) * p.speed;

        // draw player
        circle(p.pos.x, p.pos.y, 50, p.color);

        // draw aim circle
        var aimAngle = p.joySticks.rightJS.angle();
        var adjX = p.pos.x + ((p.radius + p.aad) * Math.cos(aimAngle)); // adjusted X, xi + L*cos0
        var adjY = p.pos.y - ((p.radius + p.aad) * Math.sin(aimAngle)); // adjusted Y, yi + L*sin0
        var ctrX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle));
        var ctrY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle));
        var lineToLeftX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle - Math.PI / 8));
        var lineToLeftY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle - Math.PI / 8));
        var lineToRightX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle + Math.PI / 8));
        var lineToRightY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle + Math.PI / 8));

        ctx.beginPath();
        ctx.moveTo(adjX, adjY);
        ctx.lineTo(lineToRightX, lineToRightY);
        ctx.lineTo(ctrX, ctrY);
        ctx.lineTo(lineToLeftX, lineToLeftY);
        ctx.lineTo(adjX, adjY);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.fill();
        ctx.stroke();



        p.cooldown();

    }

} // end gameLoop








window.onload = init;