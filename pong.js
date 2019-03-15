// set up vector class
class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  //set up length
  get len(){
    return Math.sqrt(this.x *this.x + this.y* this.y)
  }
  set len(value)
  {
    const fact = value / this.len;
    this.x *= fact;
    this.y *= fact;
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
    this.ball = new Ball;
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
    // call calback
    callback();
  //call reset
    this.reset();

  }

  // collide with ball
  collide(player, ball) {
    //check if the ball hits either player
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      const len = ball.vel.len;
      //reverse the ball velocity
      ball.vel.x = -ball.vel.x;

      ball.vel.y += 300 * (Math.random() - .5)
      // up ball velocity by5% 0n hit
      ball.vel.len = len *1.05;

    }
  }

  //draw function
  draw() {
    //draws canvas
    this._context.fillStyle = '#1c1d25';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    //draws players
    this.players.forEach(player => this.drawRect(player));
  }
  //draw rectangle function
  drawRect(rect) {
    //draws ball and players white
    this._context.fillStyle = 'orange';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }
  //reset Ball
  reset(){
    //creates new ball

    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;

    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }
  start()
  {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0){
       this.ball.vel.x =300 *(Math.random() > .5 ? 1 : - 1);
       this.ball.vel.y = 300 *(Math.random() * 2 -1);
       this.ball.vel.len = 400;
    }
  }
  //update function
  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
    // change the x velocity of the ball if it collides with the borders
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.vel.x < 0 | 0;
      console.log(playerId);
      //increase player score
      this.players[playerId].score++;
      this.ball.vel.x = -this.ball.vel.x;
      this.reset();

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
// event listner for click to start / restart
canvas.addEventListener('click', event => {
  pong.start();

});
