var canvas;
var ctx;
var turnOn;
var value = [];

function animate() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    assignEventListeners();
}

var squares = [];

function Square(xPos, yPos, width, heigth, speed, turnOn, color) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = heigth;
    this.speed = speed;
    this.turnOn = turnOn;
    this.color = color;
}

Square.prototype.update = function () {
    ctx.beginPath();
    ctx.clearRect(this.xPos, this.yPos, this.width, this.height);
    if (turnOn && this.turnOn) {
        this.yPos += this.speed / 1000;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        if (this.yPos >= canvas.height) {
            this.yPos = 0;
        }
    }
    ctx.closePath();
};

function setSquares() {
    for (var i = 0; i < 32; i++) {
        var x = 20 * i;
        var y = 0;

        if (sr == 1) {
            var sr;
            var s = Math.round((3000 - 0.5 + Math.random() * (4000 - 3000 + 1)) / 3000) * 3000;
            sr = -1;
        } else {
            var s = Math.round((1000 - 0.5 + Math.random() * (2000 - 1000 + 1)) / 1000) * 1000;
            sr = 1;
        }

        var color = randomColorRGB();

        var square = new Square(x, y, 20, 20, s, true, color);
        squares.push(square);
    }
    activeSquares();
}

var activeSquaresArray = [];

function activeSquares() {
    var min = 0;
    var max = squares.length - 1;
    var firstRand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    var speed = squares[firstRand].speed;

    setInterval(function () {
        var secondRand = Math.round(min - 0.5 + Math.random() * (max - min + 1));

        if (squares.length !== 0) {
            if ((activeSquaresArray.filter(square => square.xPos === squares[secondRand].xPos)).length === 0) {
                activeSquaresArray.push(squares[secondRand]);
            }

            speed = squares[secondRand].speed;
            drawAndUpdate();
        };

    }, speed);
}

function drawAndUpdate() {
    var i = 0;
    var min = 0;
    var max = activeSquaresArray.length - 1;
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);

    var selectedSquer = activeSquaresArray[rand];

    if (selectedSquer !== undefined) {
        selectedSquer.update();
    };

    requestAnimationFrame(drawAndUpdate);
}

function randomColorRGB() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function assignEventListeners() {
    var start = document.getElementById('start');
    start.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        turnOn = true;
        counter.innerHTML = 0;
        activeSquaresArray.length = 0;
        squares.length = 0;
        for (var i = 0; i < squares.length; i++) {
            squares[i].yPos = 0;
        }
        setSquares();
    });
    var counter = document.getElementById('score');
    canvas.addEventListener('click', function (e) {
       for (var i = 0; i < squares.length; i++) {
           if ((squares[i].xPos <= e.clientX && e.clientX <= squares[i].xPos + 20) && (squares[i].yPos <= e.clientY && e.clientY <= squares[i].yPos + 60)) {
               squares[i].turnOn = false;

               var value = activeSquaresArray.filter(square => square.turnOn === false);
               counter.innerHTML = value.length;
           }
       }
    });
    var stop = document.getElementById('stop');
    stop.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        activeSquaresArray.length = 0;
        squares.length = 0;
    });
}

document.body.onload = animate;