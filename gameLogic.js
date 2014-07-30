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

function rgbStringToArray(str) {
    var r, g, b;
    r = str.substring(str.indexOf("(") + 1, str.indexOf(","));
    str = str.substring(str.indexOf(",") + 1);
    g = str.substring(0, str.indexOf(","));
    str = str.substring(str.indexOf(",") + 1);
    b = str.substring(0, str.indexOf(")"));
    return [parseInt(r), parseInt(g), parseInt(b)];
}

function lightenRGB(array) {
    var r1 = Math.floor(array[0] * 1.2);
    var g1 = Math.floor(array[1] * 1.2);
    var b1 = Math.floor(array[2] * 1.2);
    if (r1 > 255) {r1 = 255}
    if (g1 > 255) {g1 = 255}
    if (b1 > 255) {b1 = 255}
    return "rgb(" + r1 + "," + g1 + "," + b1 + ")";
}

function darkenRGB(array) {
    var r1 = Math.floor(array[0] / 1.2);
    var g1 = Math.floor(array[1] / 1.2);
    var b1 = Math.floor(array[2] / 1.2);
    if (r1 < 0) {r1 = 0}
    if (g1 < 0) {g1 = 0}
    if (b1 < 0) {b1 = 0}
    return "rgb(" + r1 + "," + g1 + "," + b1 + ")";
}

function rgbToRGBA(str, opacity) {
    return "rgba" + str.substring(str.indexOf("("), str.indexOf(")")) + "," + opacity + ")";
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
    this.ringColorChange = null;
    this.aad = 20; // aim arrow distance

    this.HP = 10;
    this.restitution = 0.7;
    this.speed = 0.35;
    this.shotSize = 10;

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

    var contextThis = this;

    this.shotSmall = {
        current: 90,
        max: 90,
        action: function() {
            console.log("SHOT")
        },
        notOffCooldown: function() {
            console.log("not off cooldown")
        }
    };
    this.shotBig = {
        current: 600,
        max: 600,
        redCircleActive: false,
        action: function() {
            contextThis.shotSize *= 2;
            // BIGSHOT();
            contextThis.shotSize /= 2;
            console.log("SHOTS FIRED");
        },
        cooldown: function() {
            contextThis.ringColorChange = null;
            console.log("off cooldown")
        },
        notOffCooldown: function() {
            var thisTemp = this;
            if (!thisTemp.redCircleActive) {
                thisTemp.redCircleActive = true;
                setTimeout(function() {contextThis.ringColorChange = "rgb(255, 0, 0)"}, 50);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.9)"}, 100);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.8)"}, 150);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.7)"}, 200);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.6)"}, 250);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.5)"}, 300);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.4)"}, 350);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.3)"}, 400);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.2)"}, 450);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.1)"}, 500);
                setTimeout(function() {contextThis.ringColorChange = null; thisTemp.redCircleActive = false}, 550);
            }
        }
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

    this.spells = {
        shoot: this.shotSmall,
        bigShoot: this.shotBig,
        invisBody: this.invisBody,
        invisArrow:this.invisArrow,
        speed: this.speedBoost
    };

    this.cooldown = function() {
        for (var spell in this.spells) {
            this.spells[spell].current--;
        }
    };

    this.castSpell = function(spell) {
        if (this.spells[spell].current < 0) { // off cooldown
            this.spells[spell].current = this.spells[spell].max;
            this.spells[spell].action();
            this.spells[spell].cooldown();
        } else {
            this.spells[spell].notOffCooldown();
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

        // draw lighter ring
        ctx.lineWidth = 14;
        ctx.strokeStyle = rgbToRGBA(lightenRGB(rgbStringToArray(p.color)), 0.5);
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.radius - 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 2;

        if (p.ringColorChange) {
            ctx.lineWidth = 14;
            ctx.strokeStyle = p.ringColorChange;
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.radius - 7, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 2;
        }

        // aim arrow vars
        var aimAngle = p.aimDirection;
        var adjX = p.pos.x + ((p.radius + p.aad) * Math.cos(aimAngle)); // adjusted X, xi + L*cos0
        var adjY = p.pos.y - ((p.radius + p.aad) * Math.sin(aimAngle)); // adjusted Y, yi + L*sin0
        var ctrX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle));
        var ctrY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle));
        var lineToLeftX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle - Math.PI / 8));
        var lineToLeftY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle - Math.PI / 8));
        var lineToRightX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle + Math.PI / 8));
        var lineToRightY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle + Math.PI / 8));

        // shield vars
        var shieldLeftX = p.pos.x - Math.cos(aimAngle + Math.PI / 3) * (p.radius + p.aad);
        var shieldLeftY = p.pos.y + Math.sin(aimAngle + Math.PI / 3) * (p.radius + p.aad);
        var shieldMiddleX = p.pos.x - Math.cos(aimAngle) * (p.radius + p.aad);
        var shieldMiddleY = p.pos.y + Math.sin(aimAngle) * (p.radius + p.aad);
        var shieldRightX = p.pos.x - Math.cos(aimAngle - Math.PI / 3) * (p.radius + p.aad);
        var shieldRightY = p.pos.y + Math.sin(aimAngle - Math.PI / 3) * (p.radius + p.aad);

        // draw arrow
        ctx.beginPath();
        ctx.moveTo(adjX, adjY);
        ctx.lineTo(lineToRightX, lineToRightY);
        ctx.lineTo(ctrX, ctrY);
        ctx.lineTo(lineToLeftX, lineToLeftY);
        ctx.lineTo(adjX, adjY);
        ctx.closePath();
        ctx.fillStyle = darkenRGB(rgbStringToArray(p.color));
        ctx.strokeStyle = p.color;
        ctx.fill();
        ctx.stroke();

        // draw shield
        ctx.beginPath();
        ctx.moveTo(shieldLeftX, shieldLeftY);
        ctx.quadraticCurveTo(shieldMiddleX, shieldMiddleY, shieldRightX, shieldRightY);
        ctx.lineTo(shieldLeftX, shieldLeftY);
        ctx.closePath();
        ctx.fillStyle = darkenRGB(rgbStringToArray(p.color));
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();

        circle(shieldLeftX, shieldLeftY, 2, p.color);
        circle(shieldRightX, shieldRightY, 2, p.color);


        p.cooldown();

    }

} // end gameLoop








window.onload = init;