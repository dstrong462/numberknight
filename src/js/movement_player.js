/////////////// MOVEMENT_PLAYER ///////////////

// Add event listeners for the 4 movement buttons
var moveUp = document.getElementById('move-up');
    moveUp.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-up');
        }
    });
var moveDown = document.getElementById('move-down');
    moveDown.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-down');
        }
    });
var moveLeft = document.getElementById('move-left');
    moveLeft.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-left');
        }
    });
var moveRight = document.getElementById('move-right');
    moveRight.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-right');
        }
    });

// Listen for keyboard events for desktop users that like to kick it oldschool
document.onkeyup = checkKey;

function checkKey(e) {
    if (hero.canMove) {
        e = e || window.event;
        var move = false;
        // Assign movement direction
        if (e.keyCode == '37') {
            move = 'move-left';
        }
        else if (e.keyCode == '38') {
            move = 'move-up';
        }
        else if (e.keyCode == '39') {
            move = 'move-right';
        }
        else if (e.keyCode == '40') {
            move = 'move-down';
        }
        else if (e.keyCode == '32') {
            hero.fastTravel = false;
            checkMath();
        }
        // Pass movement direction to movement function
        if (move !== false) {
            hero.fastTravel = false;
            moveHero(move);
        }
    }
}


// Allow player to automate travel for greater distances
function fastTravel(e) {
    if (hero.fastTravel) {
        hero.fastTravel = false;
    }
    else {
        var mapCell;
        for (var r = 0; r < numberOfRows; r++) {
            for (var c = 0; c < numberOfColumns; c++) {
                if (map[r][c].location === e.target.id && map[r][c].contents !== 'blocked') {
                    mapCell = map[r][c];
                    hero.fastTravel = mapCell;
                    var square = document.getElementById(mapCell.location);
                        square.style.zIndex = 1;
                        square.style.border = '2px solid rgba(0,0,0,0)';
                        square.style.borderRadius = '6px';
                        square.style.transition = 'border-color 0.5s';
                        square.style.borderColor = 'rgba(12,126,180,1)';
                    var interval = setInterval(function() {
                        if (hero.fastTravel !== false && hero.canMove) {
                            var end = hero.fastTravel;
                            fastTravelPathing(square);
                        }
                        else {
                            clearInterval(interval);
                            square.style.borderColor = 'rgba(0,0,0,0)';
                        }
                    }, 450);
                }
            }
        }
    }
}


// Automate travelling from one location to another with some basic obstacle avoidance
function fastTravelPathing(square) {
    var end = hero.fastTravel;
    // Determine greatest distance to close
    var rows = Math.abs(hero.row - end.row);
    var cols = Math.abs(hero.col - end.col);
    if (rows > cols) {
        var direction = 'vertical';
    }
    else {
        var direction = 'horizontal';
    }
    // Fade out outline if 1 square away from target
    if (Math.abs(hero.row - end.row) <= 1 && Math.abs(hero.col - end.col) <= 1) {
        setTimeout(function() {
            square.style.borderColor = 'rgba(0,0,0,0)';
        }, 350);
    }
    // Stop moving if the end has been reached
    if (hero.location === end.location) {
        hero.fastTravel = false;
    }
    // If on the same row
    else if (hero.row === end.row) {
        // If location is left
        if (hero.col > end.col) {
            // If next cell is clear
            if (map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                moveHero('move-left');
            }
            // If blocked
            else {
                // If not on bottom row, move down
                if (hero.row !== numberOfRows && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                    moveHero('move-down');
                }
                // Otherwise, move up
                else if (hero.row === numberOfRows && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
                    moveHero('move-up');
                }
                else {
                    hero.fastTravel = false;
                }
            }
        }
        // If location is right
        else if (hero.col < end.col) {
            // If next cell is clear
            if (map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
                moveHero('move-right');
            }
            // If blocked
            else {
                // If not on bottom row, move down
                if (hero.row !== numberOfRows && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                    moveHero('move-down');
                }
                // Otherwise, move up
                else if (hero.row === numberOfRows && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                    moveHero('move-up');
                }
                else {
                    hero.fastTravel = false;
                }
            }
        }
    }
    // If target location is up
    else if (hero.row > end.row && direction === 'vertical') {
        // If next cell is clear
        if (map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
            moveHero('move-up');
        }
        // If blocked
        else {
            // If not on right most column, move right
            if (hero.col !== numberOfColumns && map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
                moveHero('move-right');
            }
            // Otherwise, move left
            else if (hero.col === numberOfColumns && map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                moveHero('move-left');
            }
            else {
                hero.fastTravel = false;
            }
        }
    }
    // If target location is down
    else if (hero.row < end.row && direction === 'vertical') {
        // If next cell is clear
        if (map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
            moveHero('move-down');
        }
        // If blocked
        else {
            // If target is to the left
            if (hero.col > end.col || hero.col === numberOfColumns && map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                moveHero('move-left');
            }
            // If not on right most column, move right
            else if (hero.col !== numberOfColumns && map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
                moveHero('move-right');
            }
            else {
                hero.fastTravel = false;
            }
        }
    }

    // If target location is left
    else if (hero.col > end.col && direction === 'horizontal') {
        // If next cell is clear
        if (map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
            moveHero('move-left');
        }
        // If blocked
        else {
            // If target location is down
            if (hero.row < end.row && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                moveHero('move-down');
            }   
            // If target is up
            else if (hero.row > end.row && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
                moveHero('move-up');
            }
            else {
                hero.fastTravel = false;
            }
        }
    }
    // If target location is right
    else if (hero.col < end.col && direction === 'horizontal') {
        // If next cell is clear
        if (map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
            moveHero('move-right');
        }
        // If blocked
        else {
            // If target location is down
            if (hero.row < end.row && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                moveHero('move-down');
            }   
            // If target is up
            else if (hero.row > end.row && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
                moveHero('move-up');
            }
            else {
                hero.fastTravel = false;
            }
        }
    }
    else {
        hero.fastTravel = false;
    }
}


// Check collision of movement, and move accordingly
function moveHero(move) {
    if (hero.canMove) {
        cooldown(hero,hero.cooldownTimer);
        var munchLocation = map[hero.row - 1][hero.col - 1];
        if (move === 'move-up') {
            if (hero.row === 1) {

            }
            else {
                var mapLocation = map[hero.row - 2][hero.col - 1];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('up',target,hero);
                }
                else if (hero.top >= cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.top -= cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.row--;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('up',mapLocation,hero);
                }
            }
        }
        else if (move === 'move-down') {
            if (hero.row === numberOfRows) {

            }
            else {
                var mapLocation = map[hero.row][hero.col - 1];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('down',target,hero);
                }
                else if (hero.top <= (numberOfRows - 2) * cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.top += cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.row++;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('down',mapLocation,hero);
                }
            }
        }
        else if (move === 'move-left') {
            if (hero.col === 1) {

            }
            else {
                var mapLocation = map[hero.row - 1][hero.col - 2];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('left',target,hero);
                }
                else if (hero.left >= cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.left -= cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.col--;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('left',mapLocation,hero);
                }
            }
        }
        else if (move === 'move-right') {
            if (hero.col === numberOfColumns) {
            }
            else {
                var mapLocation = map[hero.row - 1][hero.col];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('right',target,hero);
                }
                else if (hero.left <= (numberOfColumns - 2) * cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.left += cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.col++;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('right',mapLocation,hero);
                }
            }
        }
        hero.location = 'r' + hero.row + 'c' + hero.col;
        if (hero.location === levelExit.id && hero.answers >= hero.answersNeeded) {
            if (hero.bossLevel && hero.bossIsDead || hero.bossLevel === false) {
                hero.canMove = false;
                hero.gameLevel++;
                if (hero.bossLevel && hero.bossIsDead) {
                    hero.knights.splice(0,3);
                }
                if (options.tutorial) {
                    options.tutorial = false;
                }
                // Save game to local storage
                localStorage.setItem('savedGame', JSON.stringify(hero));
                localStorage.setItem('options', JSON.stringify(options));
                if (hero.knights.length === 0) {
                    options.endgame = true;
                    startGame();
                }
                else {
                    awardXp('level');
                    startGame();
                }
            }
        }
    }
}
