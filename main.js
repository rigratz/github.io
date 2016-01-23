var AM = new AssetManager();
// var timesLooped = 0;

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, type) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.type = type;
    this.timesLooped = 0;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    //var yindex = 0;
    // if (frame > 7) {
    //     frame = 14 - frame;
    // }
    xindex = frame % 4;
    yindex = Math.floor(frame / 7);

    //console.log(frame + " " + xindex + " " + yindex);

    // ctx.drawImage(this.spriteSheet,
    //              xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
    //              this.frameWidth, this.frameHeight,
    //              x, y,
    //              this.frameWidth *3,
    //              this.frameHeight*3);
    var xframe = 0;
    var yframe = 0;
    if (this.type === "down") {
      xframe = 39 + (xindex * this.frameWidth);
      yframe = 44;
    } else if (this.type === "up") {
      console.log("Up anim.");
      xframe = 39 + (xindex * this.frameWidth);
      yframe = 87;
    } else if (this.type === "left") {
      xframe = 323 + (xindex * this.frameWidth);
      yframe = 44;
    } else if (this.type === "right") {
      xframe = 323 + (xindex * this.frameWidth);
      yframe = 87;
    } else if (this.type === "dizzy") {
      xindex = frame % 8;
      xframe = 168 + (xindex * this.frameWidth);
      yframe = 5;

    }
    if (xindex === 0) {

      this.timesLooped = this.timesLooped + 1;
    }
    ctx.drawImage(this.spriteSheet,
                 xframe, yframe,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth *3,
                 this.frameHeight*3);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Gizmo(game, spritesheet, type) {
    this.downAnimation = new Animation(spritesheet, 40, 32, 0.15, 4, true, false, "down");
    this.upAnimation = new Animation(spritesheet, 40, 32, 0.15, 4, true, false, "up");
    this.leftAnimation = new Animation(spritesheet, 24, 32, 0.15, 4, true, false, "left");
    this.rightAnimation = new Animation(spritesheet, 24, 32, 0.15, 4, true, false, "right");
    //this.dizzyAnimation = new Animation(spritesheet, 34, 32, 0.15, 4, true, false, "dizzy");
    if (type === "down") {
      this.animation = this.downAnimation;
      this.x = 100;
      this.y = 100;
    } else if (type === "up") {
      this.animation = this.upAnimation;
      this.x = 500;
      this.y = 500;
    } else if (type === "left") {
      this.animation = this.leftAnimation;
      this.x = 500;
      this.y = 100;
    } else if (type === "right") {
      this.animation = this.rightAnimation;
      this.x = 100;
      this.y = 500;
    } else if (type === "dizzy") {
      this.animation = this.downAnimation;
      this.x = 300;
      this.y = 300;
      this.startType = "dizzy";
    }
    this.game = game;
    this.ctx = game.ctx;
}

Gizmo.prototype.draw = function () {
//    console.log("drawing");
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Gizmo.prototype.update = function() {
    //this.y += this.game.clockTick * 100;
    var move = this.animation.type;
    console.log(move);
    if (this.startType === "dizzy") {
      //break;
    } else if (move === "down") {
      this.y += this.game.clockTick * 100;
    } else if (move === "up") {
      this.y -= this.game.clockTick * 100;
    } else if (move === "left") {
      this.x -= this.game.clockTick * 100;
    } else if (move === "right") {
      this.x += this.game.clockTick * 100;
    }
    //console.log(timesLooped);
    if (this.animation.timesLooped >= 50) {
      if (move === "down") {
        this.animation = this.rightAnimation;
      } else if (move === "up") {
        this.animation = this.leftAnimation;
      } else if (move === "left") {
        this.animation = this.downAnimation;
      } else if (move === "right") {
        this.animation = this.upAnimation;
      }
      this.animation.timesLooped = 0;
    }
    //console.log(this.animation);
}
AM.queueDownload("./img/gizmosheet.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

//    var img = AM.getAsset("./img/mushroomdude.png");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Gizmo(gameEngine, AM.getAsset("./img/gizmosheet.png"), "down"));
    gameEngine.addEntity(new Gizmo(gameEngine, AM.getAsset("./img/gizmosheet.png"), "right"));
    gameEngine.addEntity(new Gizmo(gameEngine, AM.getAsset("./img/gizmosheet.png"), "up"));
    gameEngine.addEntity(new Gizmo(gameEngine, AM.getAsset("./img/gizmosheet.png"), "left"));
    gameEngine.addEntity(new Gizmo(gameEngine, AM.getAsset("./img/gizmosheet.png"), "dizzy"));

    console.log("All Done!");
});
