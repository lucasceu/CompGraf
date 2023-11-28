var canvas = document.querySelector("canvas");
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext("2d");

var pikachusCapturados = 0; //conta quantos pikachus foram presos

// IMAGENS DOS OBJETOS //
var fundo = new Image();
fundo.src = "img/fundo.png";

var ashR = new Image();
ashR.src = "img/ashR.png";

var ashL = new Image();
ashL.src = "img/ashL.png";

var ashD = new Image();
ashD.src = "img/ashD.png";

var ashU = new Image();
ashU.src = "img/ashU.png";

var pikachu = new Image();
pikachu.src = "img/pikachu.png";

var sprites = [];

var mundo = {
    img: fundo,
    x: 0,
    y: 0,
    width: 1000,
    height: 700,
};
sprites.push(mundo);

var persona = {
    img: ashD,
    x: 0,
    y: 0,
    width: 103,
    height: 54,
};
sprites.push(persona);

var pikachu = {
    img: pikachu,
    x: Math.random() * (mundo.width - 50) + 32, // Define posição X aleatória
    y: Math.random() * (mundo.height - 74) + 30, // Define posição Y aleatória
    width: 50,
    height: 74,
};
sprites.push(pikachu);

persona.x = (mundo.width - persona.width) / 2; // Posição horizontal no centro
persona.y = (mundo.height - persona.height) / 2; // Posição vertical no centro

var cam = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    limiteL: function () {
        return this.x + (this.width * 0.25);
    },
    limiteR: function () {
        return this.x + (this.width * 0.75);
    },
    limiteU: function () {
        return this.y + (this.height * 0.25);
    },
    limiteD: function () {
        return this.y + (this.height * 0.75);
    },
}; //camera


var mvLeft = mvRight = mvUp = mvDown = false;
window.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    switch (key) {
        case 37: mvLeft = true; break;
        case 38: mvUp = true; break;
        case 39: mvRight = true; break;
        case 40: mvDown = true; break;
    }
}, false);

window.addEventListener('keyup', function (e) {
    var key = e.keyCode;
    switch (key) {
        case 37: mvLeft = false; break;
        case 38: mvUp = false; break;
        case 39: mvRight = false; break;
        case 40: mvDown = false; break;
    }
}, false);

function atualiza() {
    if (mvLeft && !mvRight) {
        persona.img = ashL;
        persona.width = 103;
        persona.height = 54;
        persona.x -= 2;
    }
    if (mvRight && !mvLeft) {
        persona.img = ashR;
        persona.width = 103;
        persona.height = 54;
        persona.x += 2;
    }
    if (mvUp && !mvDown) {
        persona.img = ashU;
        persona.width = 54;
        persona.height = 103;
        persona.y -= 2;
    }
    if (mvDown && !mvUp) {
        persona.img = ashD;
        persona.width = 54;
        persona.height = 103;
        persona.y += 2;
    }

    if (persona.x < 0) {
        persona.x = 0;
    }
    if (persona.x + persona.width > mundo.width) {
        persona.x = mundo.width - persona.width;
    }
    if (persona.y < 0) {
        persona.y = 0;
    }
    if (persona.y + persona.height > mundo.height) {
        persona.y = mundo.height - persona.height;
    }

    if (cam.x < 0) {
        cam.x = 0;
    }
    if (cam.x + cam.width > mundo.width) {
        cam.x = mundo.width - cam.width;
    }
    if (cam.y < 0) {
        cam.y = 0;
    }
    if (cam.y + cam.height > mundo.height) {
        cam.y = mundo.height - cam.height;
    }

    // Movimentando a câmera de acordo com o movimento do personagem
    if (persona.x < cam.limiteL()) {
        if (cam.x > 0) {
            cam.x = Math.max(0, persona.x - (cam.width * 0.25));
        }
    }
    if (persona.x + persona.width > cam.limiteR()) {
        if (cam.x + cam.width < mundo.width) {
            cam.x = Math.min(mundo.width - cam.width, persona.x + persona.width - (cam.width * 0.75));
        }
    }
    if (persona.y < cam.limiteU()) {
        if (cam.y > 0) {
            cam.y = Math.max(0, persona.y - (cam.height * 0.25));
        }
    }
    if (persona.y + persona.height > cam.limiteD()) {
        if (cam.y + cam.height < mundo.height) {
            cam.y = Math.min(mundo.height - cam.height, persona.y + persona.height - (cam.height * 0.75));
        }
    }
    

    // Colisão entre personagens
    if (persona.x < pikachu.x + pikachu.width &&
        persona.x + persona.width > pikachu.x &&
        persona.y < pikachu.y + pikachu.height &&
        persona.y + persona.height > pikachu.y) {
        pikachu.x = 0;
        pikachu.y = 0;
        reset();
        pikachusCapturados++;
    }
}

function reset() {
// pikachu é posicionado randomicamente
    pikachu.x = Math.random() * (mundo.width - 50) + 32;
    pikachu.y = Math.random() * (mundo.height - 74) + 30;

// Impedindo que o pikachu seja colocado fora do mundo
    pikachu.x = Math.max(0, Math.min(936, pikachu.x));
    pikachu.y = Math.max(0, Math.min(639, pikachu.y));
}

function loop() {
    window.requestAnimationFrame(loop, canvas);
    atualiza();
    render();
}

function render() {
    ctx.save();
    ctx.translate(-cam.x, - cam.y);
    for (var i in sprites) {
        var spr = sprites[i];
        ctx.drawImage(spr.img, 0, 0, spr.width, spr.height, spr.x, spr.y, spr.width, spr.height);
    }
    ctx.restore();
    ctx.font = "bold 25px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("pikachus capturados: " + pikachusCapturados, 10, 30);
}

loop();