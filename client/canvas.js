var collisionDetection = function(collided, direction, posOrNeg){
  envVariables.player.position[direction] += envVariables.moveSpeed * posOrNeg;

  for(playerId in envVariables.playerContainer) {
    var otherPlayer = envVariables.playerContainer[playerId];
    if(Collisions.playerDetection(envVariables.player, otherPlayer)){
      collided = true;
    }
  }

  if (Collisions.windowDetection(envVariables.player.position[direction], direction) && !collided) {
    Collisions.flagDetection(envVariables.player, envVariables.flag);

    if(Collisions.baseDetection(envVariables.player, envVariables['base' + envVariables.player.team])) {
      envVariables.player.score = true;

      envVariables.player.hasFlag = null; // player drops the flag before the flag position is reset
      envVariables.flag.drop(); // drop the flag   
      
      socket.emit('playerScores');
    }

    socket.emit('updatePosition', JSON.stringify(envVariables.player.position), JSON.stringify(envVariables.player.hasFlag));
  }
  else {
    envVariables.player.position[direction] += envVariables.moveSpeed * posOrNeg * -2;
    collided = false;
  }

};

var update = function(){
  var collided = false;

  if(keysPressedArr.indexOf("right") > -1){
    collisionDetection(collided, 'x', 1);
  }
  if(keysPressedArr.indexOf("down") > -1){
    collisionDetection(collided, 'y', 1);
  }
  if(keysPressedArr.indexOf("left") > -1){
    collisionDetection(collided, 'x', -1);
  }
  if(keysPressedArr.indexOf("up") > -1){
    collisionDetection(collided, 'y', -1);
  }

  envVariables.flag.update();
};


var draw = function(){
  canvasContext.clearRect(windowVariables.minWidth, windowVariables.minHeight, windowVariables.maxWidth, windowVariables.maxHeight);
  envVariables.player.draw();
  envVariables.flag.draw();
  envVariables.base0.draw();
  envVariables.base1.draw();
  for(playerId in envVariables.playerContainer) {
    envVariables.playerContainer[playerId].draw();
  }
};

var render = function(){
  update();
  draw();

  requestAnimationFrame(render);
};
