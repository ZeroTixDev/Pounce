let randomConso = function () {
  let index = Math.round(Math.random() * 20);
  let consos = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  return consos[index];
};
let randomVowel = function () {
  let index = Math.round(Math.random() * 4);
  let vowels = ["a", "e", "i", "o", "u"];
  return vowels[index];
};
module.exports = class Player{
  constructor(id, name){
    this.id = id;
    this.name = name;
    if (!/\S/.test(this.name)) {
      this.name =
        "Guest"+
        randomConso().toUpperCase() +
        randomVowel() +
        randomConso() +
        randomVowel() +
        randomConso() +
        randomVowel();
    }
    this.x = Math.random() * 600 + 200;
    this.y = Math.random() * 600 + 200;

    this.dev = false;
    this.lastDev = true;
  
    this.accX = 0;
    this.accY = 0;
    this.velX = 0;
    this.velY = 0;
    this.size = 30;
    this.maxVel = 300;
    this.friction = 0.7;
    this.bFriction = 0.85;
    this.justChat = true;
    this.movement = [false, false, false, false]
    this.pendingKeys = [false, false, false, false]
    this.lastChatTime = 1;
    this.bounceX = 0;
    this.bounceY = 0;

    this.lastName = "";

    this.chatTime = 3; // Seconds
    this.chatValue = "Hello!";
    this.lastChat = "";
    
    this.dead = false;
    this.lastDead = true;
    this.protection = true;
    this.lastProtection = false;

    this.protectTimer = 3;

    this.score = 0;
    this.lastScore = 0;

    this.lastHit = false;
    this.lastHitTimer = 0;
    
    this.lastSize = 29;

    this.god = false;
  }
  update(dt, arenaX, arenaY){ 
    if (isNaN(this.score)){
      this.score = 0;
    } 
    if (this.score < 0){
      this.dead = true;
    }
    this.score += dt/2;
    this.protectTimer -= dt;
    this.lastHitTimer -= dt;
    let sizeVariable = this.score * 2.5;
    if (sizeVariable < 10000) {
      this.size = Math.sqrt(sizeVariable / 12) + 30;
    } else {
      this.size = Math.sqrt(10000 / 12) + 30 + Math.pow(sizeVariable / 100, 0.1);
      if (this.size > 90){
        this.size = 90;
      }
    }
    if (this.lastHitTimer < 0){
      this.lastHit = false;
    }
    else{
      this.score += dt*4;
    }
    if (this.protectTimer < 0){
      this.protection = false;
    }
    if (this.movement[0] || this.pendingKeys[0]){
      this.velY -= this.maxVel*14 * dt;
    }
    if (this.movement[1] || this.pendingKeys[1]){
      this.velX += this.maxVel*14 * dt;
    }
    if (this.movement[2] || this.pendingKeys[2]){
      this.velY += this.maxVel*14 * dt;
    }
    if (this.movement[3] || this.pendingKeys[3]){
      this.velX -= this.maxVel*14 * dt;
    }
    if (this.god){
          if (this.movement[0] || this.pendingKeys[0]){
      this.velY -= this.maxVel*14 * dt;
    }
    if (this.movement[1] || this.pendingKeys[1]){
      this.velX += this.maxVel*14 * dt;
    }
    if (this.movement[2] || this.pendingKeys[2]){
      this.velY += this.maxVel*14 * dt;
    }
    if (this.movement[3] || this.pendingKeys[3]){
      this.velX -= this.maxVel*14 * dt;
    }
    }

    if (!this.movement[1] && !this.movement[3]){
    this.velX *= Math.pow(this.friction, dt*50)
    }
    if (!this.movement[2] && !this.movement[0]){
    this.velY *= Math.pow(this.friction, dt*50)
    }
    this.bounceX *= Math.pow(this.bFriction, dt*50);
    this.bounceY *= Math.pow(this.bFriction, dt*50);




    this.chatTime -= dt;


    this.x += (this.velX+this.bounceX) * dt;
    this.y += (this.velY+this.bounceY) * dt;
    if (this.velX > this.maxVel){
      this.velX = this.maxVel;
    }
    if (this.velX < -this.maxVel){
      this.velX = -this.maxVel;
    }
    if (this.velY > this.maxVel){
      this.velY = this.maxVel;
    }
    if (this.velY < -this.maxVel){
      this.velY = -this.maxVel;
    }

    this.pendingKeys = [false, false, false, false]
    
  }
  static pack({players, delta, arenaX, arenaY}){
    let pack = [];
    for (let i of Object.keys(players)) {
      let player = players[i];
      if (players[i].dead === false){
			  players[i].update(delta, arenaX, arenaY);
        
      }
      pack.push(players[i].getUpdatePack());
    }
    return pack;
  }
  getUpdatePack(){
    let pack = {
      x: Math.round(this.x),
      y: Math.round(this.y),
      id: this.id
    }
    if (this.chatValue != this.lastChat || this.justChat){
      pack.chatValue = this.chatValue;
      this.lastChat = this.chatValue;
      this.justChat = false;
    }
    if (Math.floor(this.lastSize) != Math.floor(this.size)){
      pack.size = Math.floor(this.size);
      this.lastSize = Math.floor(this.size);
    }
    if (this.lastName != this.name){
      pack.name = this.name;
      this.lastName = this.name;
    }
    if (this.lastDead != this.dead){
      pack.dead = this.dead;
      this.lastDead = this.dead;
      if (this.dead === true){
        pack.lastHit = this.lastHit;
      }
    }
    if (this.lastProtection != this.protection){
      pack.protection = this.protection;
      this.lastProtection = this.protection;
    }
    if (Math.floor(this.lastScore) != Math.floor(this.score)){
      pack.score = Math.floor(this.score);
      this.lastScore = Math.floor(this.score);
    }
    if (this.lastDev != this.dev){
      pack.dev = this.dev;
      this.lastDev = this.dev;
    }
    
    return pack;
  }
  getInitPack(){
    return {
      x: Math.round(this.x),
      y: Math.round(this.y),
      name: this.name,
      id: this.id,
      size: this.size,
      chatTime: this.chatTime,
      chatValue: this.chatValue,
      dead: this.dead,
      protection: this.protection,
      score: Math.floor(this.score),
      dev: this.dev
    }
  }
  static getAllInitPack({ players }) {
    var initPacks = [];
    for (let i of Object.keys(players)) {
      initPacks.push(players[i].getInitPack());
    }
    return initPacks;
  }
  static collision({ playerArray, players }) {
    for (let i = 0; i < playerArray.length; i++) {
      for (let j = i + 1; j < playerArray.length; j++) {
        let player1 = players[playerArray[i][0]];
        let player2 = players[playerArray[j][0]];
        if (
          Math.sqrt(
            Math.abs(
              Math.pow(player2.x - player1.x, 2) +
                Math.pow(player2.y - player1.y, 2)
            )
          ) < player1.size + player2.size && player1.dead === false && player2.dead === false && player1.protection === false && player2.protection === false
        ) {
          let distance = Math.sqrt(
            Math.abs(
              Math.pow(player2.x - player1.x, 2) +
                Math.pow(player2.y - player1.y, 2)
            )
          );
          let rotate = Math.atan2(
            player2.y - player1.y,
            player2.x - player1.x
          );
          let bounceEffect = 30;
          player2.bounceX = ((Math.cos(rotate) * bounceEffect)) * 110;
          player1.bounceX = -((Math.cos(rotate) * bounceEffect)) * 110;
          player2.bounceY = ((Math.sin(rotate) * bounceEffect)) * 110;
          player1.bounceY = -((Math.sin(rotate) * bounceEffect)) * 110;
          player2.lastHit = {
            name: player1.name,
            id: player1.id
          }
          player1.lastHit = {
            name: player2.name,
            id: player2.id
          }
          player1.lastHitTimer = 2;
          player2.lastHitTimer = 2;
        }
      }
    }
  }
}