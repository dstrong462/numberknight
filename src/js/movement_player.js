// Add event listeners for the 4 movement buttons
var moveUp = document.getElementById('move-up');
    moveUp.addEventListener('click', moveHero);
var moveDown = document.getElementById('move-down');
    moveDown.addEventListener('click', moveHero);
var moveLeft = document.getElementById('move-left');
    moveLeft.addEventListener('click', moveHero);
var moveRight = document.getElementById('move-right');
    moveRight.addEventListener('click', moveHero);

// Listen for keyboard events for desktop users that like to kick it oldschool
document.onkeyup = checkKey;

function checkKey(e) {
    if (hero.canMove) {
        e = e || window.event;
        if (e.keyCode == '37' ||
            e.keyCode == '38' ||
            e.keyCode == '39' ||
            e.keyCode == '40') {
            moveHero(e);
        }
        else if (e.keyCode == '32') {
            checkMath();
        }
    }
}

var taps = [];

// Move hero with screen swipes
function swipe() {

    var touchSurface = document.getElementById('touch-surface');

    var xStart;
    var xEnd;
    var yStart;
    var yEnd;
    var xDistance;
    var yDistance;
    var minDistance = 75;
    var tolerance = 75;
    var startTime;
    var totalTime;
    var timeLimit = 250;

    touchSurface.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (hero.canMove) {
            xStart = e.changedTouches[0].clientX;
            yStart = e.changedTouches[0].clientY;
            startTime = new Date().getTime();
        }
    });

    touchSurface.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    touchSurface.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (hero.canMove) {
            xEnd = e.changedTouches[0].clientX;
            yEnd = e.changedTouches[0].clientY;
            totalTime = new Date().getTime() - startTime;

            xDistance = xEnd - xStart;
            yDistance = yEnd - yStart;

            // Weird method I came up with to check for a double tap
            // if (totalTime <= timeLimit && Math.abs(xDistance) < 50 && Math.abs(yDistance) < 50) {
            //     var tap = new Date().getTime();
            //         taps.push(tap);
            //     setTimeout(function() {
            //         taps = [];
            //     }, timeLimit);
            //     if (taps.length === 2) {
            //         if (taps[1] - taps[0] < timeLimit) {
            //             checkMath();
            //         }
            //     }
            // }


            // Make sure swipe is fast enough, and prevent swiping the hero
            if (totalTime <= timeLimit && e.target.id !== 'hero') {

                // Check for LEFT or RIGHT movement
                if (Math.abs(xDistance) > minDistance && Math.abs(yDistance) < tolerance) {
                    // Move RIGHT
                    if (xEnd - xStart > 0) {
                        e.target.id = 'move-right';
                        moveHero(e);
                    }
                    // Move LEFT
                    else if (xEnd - xStart < 0) {
                        e.target.id = 'move-left';
                        moveHero(e);
                    }
                }
                // Check for UP or DOWN movement
                else if (Math.abs(yDistance) > minDistance && Math.abs(xDistance) < tolerance) {
                    // Move DOWN
                    if (yEnd - yStart > 0) {
                        e.target.id = 'move-down';
                        moveHero(e);
                    }
                    // Move UP
                    else if (yEnd - yStart < 0) {
                        e.target.id = 'move-up';
                        moveHero(e);
                    }
                }
            }
        }
    });

}


// Check collision of movement, and move accordingly
function moveHero(e) {
    if (hero.canMove) {
        cooldown(hero,hero.cooldownTimer);
        var munchLocation = map[hero.row - 1][hero.col - 1];
        if (e.target.id === 'move-up' || e.keyCode == '38') {
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
        else if (e.target.id === 'move-down' || e.keyCode == '40') {
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
        else if (e.target.id === 'move-left' || e.keyCode == '37') {
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
        else if (e.target.id === 'move-right' || e.keyCode == '39') {
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