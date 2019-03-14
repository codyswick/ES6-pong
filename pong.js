// set up vec class
class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
// set up Rect class
class Rect {
  constructor(w, h) {
    this.pos = new Vec;
    this.size = new Vec(w, h);
  }
  // setting the borders of the rectangle
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}
// set up ball class extended from rect

class Ball extends Rect {
  constructor() {
    //creates a 10 x 10
    super(10, 10);
    //set up velocity
    this.vel = new Vec;

  }
}
// set up player class extended from Rect
class Player extends Rect {
  constructor() {
    // creates a player bar 20 x 100
    super(20, 100);
    // adds the score element to each player
    this.score = 0;

  }
}

//set up pong class
class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    //creates new ball
    this.ball = new Ball;
    this.ball.pos.x = 100;
    this.ball.pos.y = 50;
    this.ball.vel.x = 100;
    this.ball.vel.y = 100;
    // creates 2 players
    this.players = [
      new Player,
      new Player,
    ]
    // set player 1 position
    this.players[0].pos.x = 40;
    // set player 2 position
    this.players[1].pos.x = this._canvas.width - 40;
    //centers the player bars
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2;

    });
    //declare callback variables and function
    let lastTime;
    //callback arrow function
    const callback = (millis) => {
      //converts to milliseconds to seconds
      if (lastTime) {
        this.update((millis - lastTime) / 1000);
      }
      lastTime = millis;
      requestAnimationFrame(callback);
    };
    callback();

  }

  // collide with ball
  collide(player, ball) {
    //check if the ball hits either player
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      ball.vel.x = ball.vel.x +10;
      //reverse the ball velocity
      ball.vel.x = -ball.vel.x;
      console.log(ball.vel.x);


    }
  }

  //draw function
  draw() {
    //draws ball and players white
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    //draws players
    this.players.forEach(player => this.drawRect(player));
  }
  //draw rectangle function
  drawRect(rect) {
    //draws canvas with black background
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }
  //update function
  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
    // change the x velocity of the ball if it collides with the borders
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.vel.x = -this.ball.vel.x;
    }
    // change the Y velocity of the ball if it collides with borders
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }
    // make the CPU player follow the ball
    this.players[1].pos.y = this.ball.pos.y;
    // for each collision with player
    this.players.forEach(player => this.collide(player, this.ball));


    // draw function call
    this.draw();


  }
}

//variables for the canvas element
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);
// add event lisnter for player 1 movement on mouse
canvas.addEventListener('mousemove', event => {
  pong.players[0].pos.y = event.offsetY;

});
