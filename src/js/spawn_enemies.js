// Start adding enemies based on monster difficulty
function letTheGamesBegin() {
    if (hero.difficultyMonster == 1) {
        maxWeight = 60;
        maxEnemies = 5;
    }
    else if (hero.difficultyMonster == 2) {
        maxWeight = 120;
        maxEnemies = 10;
    }
    else if (hero.difficultyMonster == 3) {
        maxWeight = 200;
        maxEnemies = 20;
    }
    levelData = { redKnight: false, blueKnight: false, yellowKnight: false };
    // Gaining levels increases max weight
    maxWeight += ((hero.level - 1) * 10);
    // Gaining levels increases max number of enemies
    if (hero.level % 2 === 0) {
        maxEnemies += (hero.level / 2);
    }
    // If Boss Level
    if (hero.bossLevel !== false || hero.challengeMode) {
        maxWeight *= 1.5;
        maxEnemies *= 1.5;
    }
    console.log('maxWeight: ' + maxWeight);
    console.log('maxEnemies: ' + maxEnemies);
    // Get list of safe spawn locations
    spawnArray = [];
    try {
        for (var r = 0; r < numberOfRows; r++) {
            for (var c = 0; c < numberOfColumns; c++) {
                var cell = map[r][c];
                if (r === 0 || r === numberOfRows - 1) {
                    if (cell.object && cell.contents !== 'trap') {
                    }
                    else {
                        spawnArray.push(cell);
                    }
                }
                else if (c === 0 || c === numberOfColumns -1) {
                    if (cell.object && cell.contents !== 'trap') {
                    }
                    else {
                        spawnArray.push(cell);
                    }
                }
            }
        }
        // Spawn first enemy
        var spawn = spawnArray[randomNumber(0,spawnArray.length - 1)];
        getEnemy(spawn.row,spawn.col);
    } catch(e) {
        console.log('letTheGamesBegin ERROR');
    }
    // Start spawning enemies at an interval
    if (options.tutorial === false) {
        spawnEnemy();
    }
}


// Spawn another enemy at a random interval
function spawnEnemy() {
    var spawnLevel = hero.gameLevel;
    var spawnInterval = randomNumber(1000,3000);
    var interval = setInterval(function() {
        if (map === null || map.length === 0 || hero.bossIsDead || spawnLevel !== hero.gameLevel) {
            clearInterval(interval);
        }
        else if (totalWeight < maxWeight && numberOfEnemies < maxEnemies) {
            var spawn = spawnArray[randomNumber(0,spawnArray.length - 1)];
            getEnemy(spawn.row,spawn.col);
        }
        else if (numberOfEnemies >= maxEnemies) {
            clearInterval(interval);
        }
    }, spawnInterval);
}


// Select a random enemy from the bestiary
function getEnemy(row,col) {
    var monster = bestiary[randomNumber(0,bestiary.length - 1)];
    // Boss Level Spawn
    if (hero.bossLevel === 'Spider Queen') {
        if (hero.bossHasSpawned === false) {
            monster = bosses[0];
            hero.bossHasSpawned = true;
        }
        else {
            // Spawn spider minions
            monster = bestiary[2];
        }
        addEnemy(row,col,monster);
    }
    else if (hero.bossLevel === 'Vampire Lord') {
        if (hero.bossHasSpawned === false) {
            monster = bosses[1];
            hero.bossHasSpawned = true;
        }
        else {
            // Spawn bat minions
            monster = bestiary[0];
        }
        addEnemy(row,col,monster);
    }
    else if (hero.bossLevel === 'Red Knight') {
        maxEnemies = 3;
        maxWeight = 1000;
        // Start with Red Knight
        if (hero.bossLevel === 'Red Knight' && levelData.redKnight === false) {
            monster = bosses[2];
            hero.bossHasSpawned = true;
            levelData.redKnight = 'alive';
        }
        else if (hero.bossLevel === 'Red Knight') {
            // Spawn Blue Knight
            if (levelData.blueKnight === false) {
                monster = bosses[3];
                levelData.blueKnight = 'alive';
            }
            // Spawn Yellow Knight
            else if (levelData.yellowKnight === false) {
                monster = bosses[4];
                levelData.yellowKnight = 'alive';
            }
        }
        addEnemy(row,col,monster);
    }
    else if (options.tutorial && options.newgame) {
        monster = bestiary[1];
        addEnemy(3,1,monster);
    }
    else {
        if (monster.weight + totalWeight <= maxWeight) {
            addEnemy(row,col,monster);
        }
        else if (maxWeight - totalWeight <= 20) {

        }
    }
}


// Flash the warning icon when an enemy is spawning
function enemyWarning() {
    var warning = document.getElementById('warning');
        warning.src = 'img/gui/warning.svg';
        warning.style.animation = 'warning 2.5s 1';
        setTimeout(function() {
            warning.style.animation = '';
        }, 2500);
}


// Spawn an enemy and apply some data to it
function addEnemy(row,col,monster) {
    enemyWarning();
    numberOfEnemies++;
    var enemy = (JSON.parse(JSON.stringify(monster)));
    totalWeight += enemy.weight;
    enemy.id = 'enemy-container' + numberOfEnemies;
    enemy.enemy = true;
    enemy.top = (row * cellSize) - cellSize;
    enemy.left = (col * cellSize) - cellSize;
    enemy.row = row;
    enemy.col = col;
    enemy.location = 'r' + row + 'c' + col;
    enemy.gameLevel = hero.gameLevel;
    enemy.canMove = true;
    enemy.startingHealth = monster.health;
    enemy.armorRating = 1;
    enemy.attackRating = 1;
    enemy.cooldown = false;
    // Check if monster has been encountered before
    if (options.enemiesEncountered.indexOf(enemy.type) == -1) {
        options.enemiesEncountered.unshift(enemy.type);
        options.newEnemies++;
        localStorage.setItem('options', JSON.stringify(options));
    }
    if (enemies !== null) {
        enemies.push(enemy);
    }
    else {
        resetAll();
        return;
    }
    // Create DOM element for enemy
    var createEnemy = document.createElement('div');
    if (enemy.boss) {
        enemy.startingHealth *= hero.difficultyMonster;
        enemy.health *= hero.difficultyMonster;
        createEnemy.classList.add('boss');
        var healthBar = document.createElement('span');
            healthBar.id = 'boss-health';
        if (enemy.type === 'Red Knight') {
            healthBar.id = 'boss-health-redknight';
        }
        else if (enemy.type === 'Blue Knight') {
            healthBar.id = 'boss-health-blueknight';
        }
        else if (enemy.type === 'Yellow Knight') {
            healthBar.id = 'boss-health-yellowknight';
        }
            healthBar.style.width = '100%';
            healthBar.style.opacity = '0';
            createEnemy.appendChild(healthBar);
    }
    else {
        createEnemy.classList.add('enemy');
    }
    // Allow aggressive types to fly over objects
    if (enemy.moveType === 'aggressive') {
        createEnemy.classList.add('flying');
    }
        createEnemy.id = enemy.id;
        createEnemy.style.width = cellSize + 'px';
        createEnemy.style.height = cellSize + 'px';
        createEnemy.style.backgroundImage = 'url("img/enemies/shadow.png")';
        createEnemy.style.top = '0';
        createEnemy.style.left = '0';
        createEnemy.style.zIndex = 10;
        createEnemy.style.transitionDuration = '0';
    var message = document.createElement('span');
        message.className = 'message';
        message.innerHTML = '';
        createEnemy.appendChild(message);
    var enemyImage = document.createElement('img');
        enemyImage.src = 'img/enemies/' + enemy.image;
        createEnemy.appendChild(enemyImage);
        levelContainer.appendChild(createEnemy);
    var enemyContainer = document.getElementById(enemy.id);
    // Insert the enemy onto one of the outside squares
    if (enemy.row === 1) {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + '-' + cellSize + 'px)';
        enemyContainer.style.transition = enemy.moveSpeed + 's ease';
    }
    else if (enemy.row === numberOfRows) {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + (enemy.top + cellSize) + 'px)';
        enemyContainer.style.transition = enemy.moveSpeed + 's ease';
    }
    else if (enemy.row !== 1 || enemy.row !== numberOfRows) {
        if (enemy.col === 1) {
            enemyContainer.style.transform = 'translate(-' + cellSize + 'px, ' + enemy.top + 'px)';
            enemyContainer.style.transition = enemy.moveSpeed + 's ease';
        }
        else if (enemy.col === numberOfColumns) {
            enemyContainer.style.transform = 'translate(' + (enemy.left + cellSize) + 'px, ' + enemy.top + 'px)';
            enemyContainer.style.transition = enemy.moveSpeed + 's ease';
        }
    }

    // Move enemy in from outside of map
    setTimeout(function() {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        // Add to map data
        if (map !== null) {
            map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
        }
        actionInterval();
    }, 2000);

    // Perform actions at set intervals depending on monster moveInterval
    function actionInterval() {
        var actionInterval = setInterval(function() {
            // Destroy any stowaways trying to sneak into the next level
            if (enemy.gameLevel !== hero.gameLevel) {
                clearTimeout(actionInterval);
                enemy = null;
                delete enemy;
            }
            else if (map === null || hero === null) {
                clearTimeout(actionInterval);
                enemy = null;
                delete enemy;
            }
            else if (hero.bossHasSpawned && hero.bossIsDead && enemy.health > 0) {
                enemy.evasion = 0;
                enemy.health = 1;
                checkForAttack('none',enemy,hero);
            }
            else {
                // Award XP on death, then destroy
                if (enemy.health <= 0) {
                    if (enemy.boss) {
                        if (enemy.type === 'Red Knight') {
                            levelData.redKnight = 'dead';
                        }
                        else if (enemy.type === 'Blue Knight') {
                            levelData.blueKnight = 'dead';
                        }
                        else if (enemy.type === 'Yellow Knight') {
                            levelData.yellowKnight = 'dead';
                        }
                        if (levelData.redKnight === 'dead' && levelData.blueKnight === 'dead' && levelData.yellowKnight === 'dead') {
                            hero.bossIsDead = true;
                            var index = hero.bosses.indexOf('Red Knight');
                            hero.bosses.splice(index,1);
                        }
                        else if (enemy.type !== 'Red Knight' && enemy.type !== 'Blue Knight' && enemy.type !== 'Yellow Knight') {
                            hero.bossIsDead = true;
                            var index = hero.bosses.indexOf(enemy.type);
                            hero.bosses.splice(index,1);
                        }

                        if (hero.bossIsDead) {
                            setTimeout(function() {
                                for (var i = 0; i < columnArray.length; i++) {
                                    var cage = document.getElementById(columnArray[i].location).lastChild;
                                        cage.style.opacity = '0';
                                    var cell = columnArray[i];
                                        map[cell.row - 1][cell.col - 1].contents = 'empty';
                                }
                                textBubble('rescue',1000);
                                if (hero.answers === hero.answersNeeded) {
                                    openExitCover();
                                }
                            }, 2000);
                        }
                    }
                    clearTimeout(actionInterval);
                    awardXp(enemy);
                    totalWeight -= enemy.weight;
                    hero.enemiesSlain++;
                    enemy = null;
                    delete enemy;
                    delete enemyContainer;
                }
                // If options menu open, pause movement
                else if (hero.pause === true) {
                }
                // Roll chance to use special ability, then perform an action
                else if (enemy.health >= 0) {
                    if (enemy.abilities) {
                        var useAbility = randomNumber(1,100);
                        enemy.currentAbility = enemy.abilities[randomNumber(0,enemy.abilities.length - 1)];
                        if (useAbility <= enemy.currentAbility.abilityChance) {
                            if (enemy.currentAbility.ability === 'acid' || enemy.currentAbility.ability === 'web' || enemy.currentAbility.ability === 'poison' || enemy.currentAbility.ability === 'ice') {
                                layTrap(enemy);
                            }
                            else if (enemy.currentAbility.ability === 'rotate') {
                                rotateEquation(enemy);
                            }
                            else if (enemy.currentAbility.ability === 'projectile') {
                                enemyProjectile(enemy,enemyContainer);
                            }
                            else if (enemy.currentAbility.ability === 'burst' && enemy.currentAbility.shots === 0) {
                                var interval = setInterval(function() {
                                    if (enemy.cooldown) {
                                        clearInterval(interval);
                                    }
                                    else if (enemy.currentAbility.shots >= 3) {
                                        enemy.currentAbility.shots = 0;
                                        clearInterval(interval);
                                        cooldown(enemy,enemy.moveInterval);
                                    }
                                    else if (enemy.cooldown === false) {
                                        enemyProjectile(enemy,enemyContainer);
                                        enemy.currentAbility.shots++;
                                    }
                                }, enemy.currentAbility.burstSpeed);
                            }
                            else if (enemy.currentAbility.ability === 'invisibility' && enemy.invisible === false) {
                                turnInvisible(enemy,enemyContainer);
                            }
                        }
                        getMovementDirection(enemy,enemyContainer);
                    }
                    else {
                        getMovementDirection(enemy,enemyContainer);
                    }
                }
                else {
                    clearTimeout(interval);
                    totalWeight = 0;
                    enemy = null;
                    delete enemy;
                    delete enemyContainer;
                }
            }
        }, enemy.moveInterval);
    }
}