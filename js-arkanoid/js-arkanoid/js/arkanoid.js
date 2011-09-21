var Arkanoid, arkanoid;
Arkanoid = (function() {
  function Arkanoid() {
    this.self = this;
  }
  Arkanoid.prototype.createPad = function() {
    this.pad = this.canvas.display.rectangle({
      x: this.canvas.width / 2,
      y: this.canvas.height - 40,
      origin: {
        x: "center",
        y: "top"
      },
      width: 100,
      height: 10,
      fill: "#00F",
      /*fill: "linear-gradient(315deg, #079, #013)",*/
      join: "round",
      shadow: "0 0 10px rgba(0,0,0, 0.8)"
    });
    return this.canvas.addChild(this.pad);
  };
  Arkanoid.prototype.createBall = function() {
    this.ball = this.canvas.display.ellipse({
      x: this.canvas.width / 2,
      y: this.pad.y - 20,
      radius: 10,
      origin: {
        x: "center",
        y: "top"
      },
      fill: "#F00",
      /*fill: "linear-gradient(315deg, #079, #013)",*/
      shadow: "0 0 5px rgba(0,0,0, 0.8)",
      stroke: "1px #000"
    });
    this.ball.dx = 0;
    this.ball.dy = 0;
    this.ball.speed = 4;
    this.ball.wait = true;
    return this.canvas.addChild(this.ball);
  };
  Arkanoid.prototype.createBrick = function(x, y) {
    var brick;
    brick = this.canvas.display.rectangle({
      x: x,
      y: y,
      origin: {
        x: "center",
        y: "top"
      },
      width: 80,
      height: 20,
      fill: "#FF0",
      /*fill: "linear-gradient(315deg, #FF0, #FFF)",*/
      join: "round",
      shadow: "0 0 2px rgba(0,0,0, 0.8)"
    });
    this.canvas.addChild(brick);
    return brick;
  };
  Arkanoid.prototype.createBricks = function() {
    var i, x, y, _ref, _results;
    i = 0;
    this.bricks = [];
    _results = [];
    for (x = 50, _ref = this.canvas.width - 50; 50 <= _ref ? x <= _ref : x >= _ref; x += 90) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (y = 20, _ref2 = this.canvas.height / 2; 20 <= _ref2 ? y <= _ref2 : y >= _ref2; y += 30) {
          _results2.push(this.bricks = this.bricks.concat(this.createBrick(x, y)));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };
  Arkanoid.prototype.createObjects = function() {
    this.createPad();
    this.createBall();
    return this.createBricks();
  };
  Arkanoid.prototype.handleBrickCollision = function(brick) {
    if (brick.removed) {
      return;
    }
    if (Util.between(this.ball.x, brick.x - brick.width / 2, brick.x + brick.width / 2) && Util.between(this.ball.y, brick.y - brick.height / 2, brick.y + brick.height / 2)) {
      this.ball.dy *= -1;
      brick.removed = true;
      return this.canvas.removeChild(brick);
      /*@pad.stop().animate({
      		   		width: @pad.width + 40
      		   }, 100)*/
    }
  };
  Arkanoid.prototype.handleCollision = function() {
    var brick, _i, _len, _ref, _results;
    if (this.ball.x > this.canvas.width - this.ball.radius || this.ball.x < this.ball.radius) {
      this.ball.dx *= -1;
    }
    if (this.ball.y > this.canvas.height - this.ball.radius || this.ball.y < this.ball.radius) {
      this.ball.dy *= -1;
    }
    if (this.ball.y > this.pad.y - this.pad.height * 2 && this.ball.x > this.pad.x - this.pad.width / 2 && this.ball.x < this.pad.x + this.pad.width) {
      this.ball.dy = -1;
    }
    _ref = this.bricks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      brick = _ref[_i];
      _results.push(this.handleBrickCollision(brick));
    }
    return _results;
  };
  Arkanoid.prototype.loop = function() {
    arkanoid.pad.x = arkanoid.canvas.mouse.x;
    if (arkanoid.ball.wait) {
      arkanoid.ball.x = arkanoid.pad.x;
      if (arkanoid.canvas.mouse.buttonState === 'down') {
        arkanoid.ball.wait = false;
        arkanoid.ball.dx = 1;
        return arkanoid.ball.dy = -1;
      }
    } else {
      arkanoid.ball.x += arkanoid.ball.dx * arkanoid.ball.speed;
      arkanoid.ball.y += arkanoid.ball.dy * arkanoid.ball.speed;
      return arkanoid.handleCollision();
    }
  };
  Arkanoid.prototype.start = function(canvasId) {
    this.canvas = oCanvas.create({
      canvas: canvasId,
      fps: 60,
      drawEachFrame: true
    });
    this.createObjects();
    return this.canvas.setLoop(this.loop).start();
  };
  return Arkanoid;
})();
arkanoid = new Arkanoid();