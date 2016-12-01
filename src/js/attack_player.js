/////////////// ATTACK_PLAYER ///////////////

// Flash hit image on character
function flashHitImage(victim,victimContainer) {
    if (victim.hasOwnProperty('id')) {
        victimContainer.classList.add('hit');
        setTimeout(function() {
            victimContainer.classList.remove('hit');
        }, 350);
    }
}


// Attack depending on what direction you are attacking from
function checkForAttack(direction,victim,attacker) {
    if (victim.hasOwnProperty('health')) {
        // Check if evasion stops attack
        if (randomNumber(1,100) > victim.evasion) {
            if (victim.health > 0) {
                var victimContainer = document.getElementById(victim.id);
                if (victim.hero) {
                    victimContainer = player;
                }
                flashHitImage(victim,victimContainer);
                // Move attacker for attack animation
                var attackerContainer = document.getElementById(attacker.id);
                var attackerTop = attacker.top;
                var attackerLeft = attacker.left;
                if (direction === 'up') {
                    var original = attackerContainer.style.zIndex;
                    attackerContainer.style.zIndex = 25;
                    attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + (attacker.top - (cellSize / 2)) + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                        setTimeout(function() {
                            attackerContainer.style.zIndex = original;
                        }, 200);
                    }, 200);
                }
                else if (direction === 'down') {
                    attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + (attacker.top + (cellSize / 2)) + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                else if (direction === 'left') {
                    attackerContainer.style.transform = 'translate(' + (attacker.left - (cellSize / 2)) + 'px, ' + attacker.top + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                else if (direction === 'right') {
                    attackerContainer.style.transform = 'translate(' + (attacker.left + (cellSize / 2)) + 'px, ' + attacker.top + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                if (victim === hero) {
                    dealDamage(attacker.baseDamage,attacker);
                }
                else {
                    victim.health -= attacker.baseDamage * attacker.attackRating;
                    if (victim.boss) {
                        if (victim.type === 'Red Knight') {
                            var healthBar = document.getElementById('boss-health-redknight');
                        }
                        else if (victim.type === 'Blue Knight') {
                            var healthBar = document.getElementById('boss-health-blueknight');
                        }
                        else if (victim.type === 'Yellow Knight') {
                            var healthBar = document.getElementById('boss-health-yellowknight');
                        }
                        else {
                            var healthBar = document.getElementById('boss-health');
                        }

                            healthBar.style.opacity = '1';
                            healthBar.style.width = (victim.health / victim.startingHealth) * 100 + '%';
                    }
                    if (victim.health <= 0) {
                        delete map[victim.row - 1][victim.col - 1].health;
                        if (victim.object) {
                            var object = document.querySelector('#' + victim.location + ' img');
                                object.style.opacity = '0';
                                object.parentElement.classList.remove('torch');
                            // If it is a column
                            if (victim.object === 'wall') {
                                // Remove from columnArray
                                var colIndex = columnArray.map(function(e) { return e.location; }).indexOf(victim.location);
                                columnArray.splice(colIndex,1);
                                victim.contents = 'empty';
                            }
                            else {
                                rollLoot(victim);
                            }
                        }
                        else {
                            map[victim.row - 1][victim.col - 1].enemy.splice(0,1);
                            var enemyIndex = enemies.map(function(e) { return e.id; }).indexOf(victim.id);
                            enemies.splice(enemyIndex,1);
                            victimContainer.style.opacity = '0';
                            setTimeout(function() {
                                victimContainer.remove();
                            }, 350);
                        }
                    }
                }
            }
        }
        else {
            if (victim === hero) {
                hero.attacksEvaded++;
                flashMessage(victim,'evaded!');
            }
            else {
                flashMessage(victim,'miss!');
            }
        }
    }
}


// Flash a status message for evasions
function flashMessage(person,message,time) {
    var msg = document.querySelector('#' + person.id + ' .message');
        msg.innerHTML = message;
        msg.style.display = 'flex';
        msg.style.opacity = '0';
        if (time) {
            var duration = time / 1000;
        }
        else {
            var duration = 0.7;
        }
        msg.style.animation = 'flash-message ' + duration + 's 1 forwards';
    setTimeout(function() {
        msg.style.display = 'none';
    }, duration * 1000);
}


// Deal damage depending on what healing method is passed to the function
function dealDamage(amount,source) {
    amount *= hero.armorRating;
    hero.health -= amount;
    if (hero.health <= 0) {
        // Determine the cause of death
        var location = map[hero.row -1][hero.col - 1];
        // If it was a trap
        if (source === 'trap') {
            if (location.object === 'spikes') {
                var deathBy = deathText.spikes[randomNumber(0,deathText.spikes.length - 1)];
            }
            else if (location.object === 'fire-grate') {
                var deathBy = deathText.fireGrate[randomNumber(0,deathText.fireGrate.length - 1)];
            }
            else if (location.trapType) {
                var deathBy = 'Slipped and fell on some ' + location.trapType;
            }
        }
        // If it was a wrong answer
        else if (source === 'wrong answer') {
            var deathBy = deathText.math[randomNumber(0,deathText.math.length - 1)];
        }
        // If it was an enemy
        else if (source.enemy) {
            if (source.type === 'Bat') {
                var deathBy = deathText.bat[randomNumber(0,deathText.bat.length - 1)];
            }
            else if (source.type === 'Gelatinous Cube') {
                var deathBy = deathText.gelCube[randomNumber(0,deathText.gelCube.length - 1)];
            }
            else if (source.type === 'Giant Spider') {
                var deathBy = deathText.spider[randomNumber(0,deathText.spider.length - 1)];
            }
            else if (source.type === 'Number Mage') {
                var deathBy = deathText.numMage[randomNumber(0,deathText.numMage.length - 1)];
            }
            else if (source.type === 'Oculord') {
                var deathBy = deathText.oculord[randomNumber(0,deathText.oculord.length - 1)];
            }
            else if (source.type === 'Vampire') {
                var deathBy = deathText.vampire[randomNumber(0,deathText.vampire.length - 1)];
            }
            else if (source.type === 'Spider Queen') {
                var deathBy = deathText.spiderQueen[randomNumber(0,deathText.spiderQueen.length - 1)];
            }
            else if (source.type === 'Vampire Lord') {
                var deathBy = deathText.vampireLord[randomNumber(0,deathText.vampireLord.length - 1)];
            }
            else if (source.type === 'Red Knight' || source.type === 'Blue Knight' ||source.type === 'Yellow Knight') {
                var deathBy = deathText.threeKnights[randomNumber(0,deathText.threeKnights.length - 1)];
            }
        }
        youDied(deathBy);
    }
    else {
        healthBar.style.width = hero.health + '%';
    }
}