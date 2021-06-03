var unitWidth = 25;
var speed = 7;
gameState = 0;
START = 0;
PLAY = 1;
END = 2;

function preload(){
    snakeImg = loadImage("images/snake.png");
    bg = loadImage("images/bg.png");
    redCherryImg = loadImage("images/Rcherry.png");
    blCherryImg = loadImage("images/Bcherry.png");
    yCherryImg = loadImage("images/Ycherry.png");
    bomb = loadImage("images/cherry.png");
    hiss = loadSound("snakeSound.mp3");
    img = loadImage("images/start.png");
}

function setup(){
    createCanvas(600, 600)

    group = createGroup();
    rcherryGroup = createGroup();
    bocherryGroup = createGroup();
    bcherryGroup = createGroup();
    ycherryGroup = createGroup();

    snake = createSprite(200, 200, unitWidth, unitWidth);
    snake.addImage(snakeImg);
    snake.scale = 0.06;
    snake.velocityX = unitWidth;
    
    edges = createEdgeSprites();

    group.add(snake);

    lastTime = 0;
    gameOver = 0;
    score = 0;
}

function draw() {
  background(bg);
  imageMode(CENTER);
  World.frameRate = speed;

  /*
  if(gameState === START){
    image(img, 300, 30, 300, 150);
    text("Try to eat all cherries and beware of the bombs!");
    if(keyDown("space")){
      gameState = PLAY;
    }
  }*/

  if(gameState !== END){ 
    // move the sprite  
    if(keyDown("up")){
      snake.setSpeedAndDirection(unitWidth, -90);
    }
    if(keyDown("down")){
      snake.setSpeedAndDirection(unitWidth, 90);
    }
    if(keyDown("left")){
      snake.setSpeedAndDirection(unitWidth, 180);
    }
    if(keyDown("right")){
      snake.setSpeedAndDirection(unitWidth, 0);
    }

    //if there's a collision with the edges or ourself, we die
    if(edges.isTouching(snake) || group.isTouching(snake)){
      gameState = END;
    }

    //red cherry
    if(World.frameCount % 50 === 0){
      var rcherry = createSprite(random(50, 500), random(50, 500), unitWidth, unitWidth);
      rcherry.addImage(redCherryImg);
      rcherry.scale = 0.07;
      rcherryGroup.add(rcherry);
      rcherry.lifetime = 25;
    }

    //blue cherry
    if(World.frameCount % 80 === 0){
      var bcherry = createSprite(random(50, 500), random(50, 500), unitWidth, unitWidth);
      bcherry.addImage(blCherryImg);
      bcherry.scale = 0.3;
      bcherryGroup.add(bcherry);
      bcherry.lifetime = 25;
    }

    //yellow cherry
    if(World.frameCount % 190 === 0){
      var ycherry = createSprite(random(50, 500), random(50, 500), unitWidth, unitWidth);
      ycherry.addImage(yCherryImg);
      ycherry.scale = 0.3;
      ycherryGroup.add(ycherry);
      ycherry.lifetime = 25;
    }

    //bomb
    if(World.frameCount % 150 === 0){
      var bombC = createSprite(random(50, 500), random(50, 500), unitWidth, unitWidth);
      bombC.addImage(bomb);
      bombC.scale = 0.2;
      bocherryGroup.add(bombC);
      bombC.lifetime = 30;
    }

      //red cherry collide
      for(var j = 0; j < rcherryGroup.length; j++){
        if(rcherryGroup.isTouching(snake)){
            var sb = createSprite(200, 200, unitWidth, unitWidth);
            sb.addImage(snakeImg);
            sb.scale = .05;
            rcherryGroup.get(j).destroy();
            group.add(sb);
            score ++;
            speed +=0.2;
            hiss.play();
        }
      }

      //blue cherry collide
      for(var i = 0; i < bcherryGroup.length; i++){
        if(bcherryGroup.isTouching(snake)){
          score += 2;
          bcherryGroup.get(i).destroy(); 
          hiss.play();
        }
      }

      //yellow cherry collide
      for(var i = 0; i < ycherryGroup.length; i++){
        if(ycherryGroup.isTouching(snake)){
          snake.velocityX += 5;
          snake.velocityY += 5;
          score ++;
          ycherryGroup.get(i).destroy(); 
          hiss.play();
        }
      }

      //bomb collide
      for(var a = 0; a < bocherryGroup.length; a++){
        if(bocherryGroup.isTouching(snake)){
          gameState = END;
          bocherryGroup.get(a).destroy(); 
        }
      }
    
    //make each snake block follow the previous one
    for(var i = group.length - 1; i > 0; i--){
      group.get(i).x = group.get(i-1).x;
      group.get(i).y = group.get(i-1).y;
    }
  }

  //end state
  if(gameState === END){
    fill("red");
    textSize(40);
    text("GAME OVER", 180, 300); 
    bocherryGroup.destroyEach();
    rcherryGroup.destroyEach();
    bcherryGroup.destroyEach(); 
    ycherryGroup.destroyEach();
    snake.velocityX = 0;
    snake.velocityY = 0;
  }

  fill("green");
  textSize(25);
  text("SCORE:  "+score, 10, 30);
    
  drawSprites();
}
