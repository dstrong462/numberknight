/////////////// TUTORIAL ///////////////

var rescueText =    ['Hail, and well met!',
                    'You&apos;re here to rescue us? Inconceivable!',
                    'You are the greatest swordsman that ever lived!',
                    'Thank you!',
                    'It was starting to get really boring in here...',
                    'This place totally stinks, thank you for rescuing us!',
                    'I can&apos;t wait to go home and get on the internet again!',
                    'I knew you would come for us!',
                    'You&apos;re awesome!',
                    'I hate spiders!',
                    'I thought we were done for!',
                    'Did you bring anything to eat with you? I&apos;m starving!',
                    'You&apos;re the coolest.',
                    'Have you found the others?',
                    'You were always my favorite. Thank you!'];

// Display story and message text on screen
var multipart = 0;
function textBubble(msg,delay) {
    if (delay === undefined) {
        delay = 2000;
    }
    if (multipart === 'done') {
        multipart = 0;
    }
    hero.pause = true;
    hero.canMove = false;
    tutorialData.proceed = false;
    setTimeout(function() {
        var overlay = document.createElement('div');
            overlay.id = 'level-splash';
            overlay.style.opacity = '0';
            overlay.style.display = 'flex';
        var bubble = document.createElement('div');
            bubble.style.backgroundColor = 'rgba(0,0,0,0.8)';

        // If a multi part message is received
        if (Array.isArray(msg) && multipart < msg.length) {
            if (msg[0] === 'theend') {
                bubble.innerHTML = '<h5>- The End -</h5>';
            }
            else {
                bubble.innerHTML = msg[multipart];
            }
            multipart++;
        }
        else {
            // If rescuing a knight
            if (msg === 'rescue') {
                var knight1 = document.createElement('p');
                    knight1.style.color = hero.knights[0].color;
                    knight1.innerHTML = hero.knights[0].rescueText;
                    bubble.appendChild(knight1);
                var knight2 = document.createElement('p');
                    knight2.style.color = hero.knights[1].color;
                    knight2.innerHTML = hero.knights[1].rescueText;
                    bubble.appendChild(knight2);
                var knight3 = document.createElement('p');
                    knight3.style.color = hero.knights[2].color;
                    knight3.innerHTML = hero.knights[2].rescueText;
                    bubble.appendChild(knight3);
            }
            else if (msg === 'boss') {
                var text = '<h5>- BOSS LEVEL -</h5>';
                    text += '<p>Defeat the boss to free the other knights!</p>';
                bubble.innerHTML = text;
            }
            else {
                bubble.innerHTML = msg;
            }
        }

        overlay.appendChild(bubble);
        document.body.appendChild(overlay);
        overlay.style.animation = 'fade-out 1s 1 forwards';

        // Close message after clicking on it
        setTimeout(function() {
            overlay.addEventListener('click', function() {
                overlay.style.animation = 'fade-in 1s 1 forwards';
                setTimeout(function() {
                    tutorialData.proceed = true;
                    hero.canMove = true;
                    hero.pause = false;
                    overlay.remove();
                    if (Array.isArray(msg) && multipart < msg.length) {
                        textBubble(msg,delay);
                    }
                    else if (multipart >= msg.length) {
                        multipart = 'done';
                    }
                }, 1000);
            });
        }, 1500);
    }, delay);
}

// Run the tutorial level for new players
function startTutorial() {

    var message = 'Welcome to Number Knight!<br />Tap here to get started.';
    textBubble(message);
    hero.evasion = 100;
    hero.canCapture = false;

    // TUTORIAL SECTION - Show movement buttons
    var showButtons = setInterval(function() {
        if (tutorialData.proceed) {
            clearInterval(showButtons);
            var moveButtons = [];
                moveButtons.push(moveUp,moveRight,moveDown,moveLeft);
            var i = 0;
            var interval = setInterval(function() {
                if (i >= moveButtons.length) {
                    clearInterval(interval);
                }
                else {
                    moveButtons[i].style.animation = 'fade-out 0.5s 1 forwards';
                    i++;
                }
            }, 250);
            var message = 'Tap the arrows to move around, or use the arrow keys if you have a keyboard.';
            textBubble(message,2000);
            teachMovement();
        }
    }, 250);

    // TUTORIAL SECTION - Teach basic movement to player
    function teachMovement() {
        hero.squaresMoved = 0;
        var moveOnce = setInterval(function() {
            if (hero.squaresMoved >= 2) {
                clearInterval(moveOnce);
                var message = 'Great. Now auto move to the highlighted square by tapping on it.';
                tutorialData.highlightedSquare = map[0][numberOfColumns - 1].location,
                textBubble(message,0);
                setTimeout(function() {
                    var square = document.getElementById(tutorialData.highlightedSquare);
                        square.style.border = '2px solid rgba(0,0,0,0)';
                        square.style.borderRadius = '6px';
                        square.style.transition = 'border-color 1s';
                        square.style.borderColor = 'rgba(255,215,0,1)';
                }, 1000);
            }
        }, 250);
        var moveToSquare = setInterval(function() {
            if (hero.location === map[0][numberOfColumns - 1].location) {
                clearInterval(moveToSquare);
                var message = 'See those 2 traps? Go step on one and see what happens.';
                textBubble(message,0);
                setTimeout(function() {
                    var square = document.getElementById(tutorialData.highlightedSquare);
                        square.style.borderColor = 'rgba(47,45,37,0.5)';
                    var moveButtons = [];
                        moveButtons.push(moveUp,moveRight,moveDown,moveLeft);
                    for (var i = 0; i < moveButtons.length; i++) {
                        moveButtons[i].style.animation = 'fade-in 0.5s 1 forwards';
                    }
                    setTimeout(function() {
                        for (var i = 0; i < moveButtons.length; i++) {
                            moveButtons[i].style.opacity = 0;
                        }
                        teachTraps();
                    }, 500);
                }, 500);
            }
        }, 250);
    }

    // TUTORIAL SECTION - Teach player about damage from traps
    function teachTraps() {
        hero.squaresMoved = 0;
        hero.evasion = 0;
        document.getElementById('healthbar').style.opacity = 1;
        for (var i = 0; i < 2; i++) {
            document.getElementById(trapArray[i].location).style.border = '2px solid rgba(0,0,0,0)';
            document.getElementById(trapArray[i].location).style.borderRadius = '6px';
            document.getElementById(trapArray[i].location).style.transition = 'border-color 1s';
            document.getElementById(trapArray[i].location).style.borderColor = 'rgba(226,39,39,1)';
        }
        var interval = setInterval(function() {
            if (hero.squaresMoved >= 2) {
                clearInterval(interval);
                for (var i = 0; i < 2; i++) {
                    document.getElementById(trapArray[i].location).style.borderColor = 'rgba(47,45,37,0.5)';
                }
            }
        }, 250);
        var takeDamage = setInterval(function() {
            if (hero.health < 100) {
                clearInterval(takeDamage);
                var message = 'Ouch! Break open one of these containers and find something to heal yourself with.';
                textBubble(message,500);
                hero.evasion = 100;
                teachLooting();
            }
        }, 250);
    }


    // TUTORIAL SECTION - Teach player how to break objects and find loot
    function teachLooting() {
        var object1 = document.getElementById(map[0][0].location);
        var object2 = document.getElementById(map[numberOfRows - 1][numberOfColumns - 1].location);
        var objects = [];
            objects.push(object1,object2);
        for (var i = 0; i < 2; i++) {
            objects[i].style.border = '2px solid rgba(0,0,0,0)';
            objects[i].style.borderRadius = '6px';
            objects[i].style.transition = 'border-color 1s';
            objects[i].style.borderColor = 'rgba(255,215,0,1)';
        }
        hero.squaresMoved = 0;
        var interval = setInterval(function() {
            if (hero.squaresMoved > 0) {
                var objects = document.querySelectorAll('.cell');
                for (var i = 0; i < objects.length; i++) {
                    objects[i].style.borderColor = 'rgba(47,45,37,0.5)';
                }
            }
            if (hero.health === 100) {
                clearInterval(interval);
                teachMath();
            }
        }, 250);
    }


    // TUTORIAL SECTION - Teach the player how to match
    function teachMath() {
        var message = 'What would a dungeon be without math?';
        textBubble(message,1000);
        var mathTutorial = document.querySelectorAll('.cell p');
        var i = 0;
        var interval = setInterval(function() {
            if (i >= mathTutorial.length) {
                clearInterval(interval);
                document.querySelector('#top-bar .btn-options').style.pointerEvents = 'auto';
                document.getElementById('top-bar').style.opacity = 1;
                continueMath();
            }
            else if (tutorialData.proceed) {
                mathTutorial[i].style.opacity = 1;
                i++;
            }
        }, 100);
        function continueMath() {
            var message = 'Stand on top of the nearest Multiple of 10, and capture the tile by tapping on your player, or by pressing the spacebar.';
            textBubble(message,500);
            hero.canCapture = true;
            var interval = setInterval(function() {
                if (hero.answers > 0) {
                    var message = 'Great! Now capture a few more.';
                    textBubble(message,0);
                    clearInterval(interval);
                }
            }, 250);
            var moreMath = setInterval(function() {
                if (hero.answers > 2 && tutorialData.proceed) {
                    teachCombat();
                    clearInterval(moreMath);
                }
            }, 250);
        }
    }


    // TUTORIAL SECTION - Teach the player how to deal with enemies
    function teachCombat() {
        hero.canCapture = false;
        hero.enemiesSlain = 0;
        var message = "It wouldn't be a proper dungeon without monsters now would it?";
        textBubble(message,0);
        var interval = setInterval(function() {
            if (tutorialData.proceed) {
                letTheGamesBegin();
                document.getElementById('xpbar').style.opacity = 1;
                clearInterval(interval);
                var message = 'Stand next to an enemy and tap on it to attack. Watch out for the pools of acid!';
                textBubble(message,2500);
            }
        }, 250);
        var slayMonster = setInterval(function() {
            if (hero.enemiesSlain > 0) {
                hero.canCapture = true;
                var message = "To proceed deeper into the dungeon capture any remaining tiles.";
                textBubble(message,0);
                clearInterval(slayMonster);
                finishUp();
            }
        }, 250);
    }

    // TUTORIAL SECTION - Finish up the tutorial and lay out the story
    function finishUp() {
        var interval = setInterval(function() {
            if (hero.answers >= hero.answersNeeded) {
                var message = ['Your training is complete, but your journey is just beginning...',
                    'You are the only remaining Number Knight. The others have all been captured by the foul beasts within this dungeon.',
                    'It is up to you and you alone to rescue them and return peace and safety to this world once again.<br /><br />Good luck!'];
                textBubble(message,500);
                clearInterval(interval);
            }
        }, 250);
        var final = setInterval(function() {
            if (multipart === 'done') {
                setTimeout(function() {
                    clearInterval(final);
                    options.tutorial = false;
                    options.newgame = false;
                    openExitCover();
                    restoreHealth(100);
                    hero.evasion = 10;
                }, 1000);
            }
        }, 250);
    }
}