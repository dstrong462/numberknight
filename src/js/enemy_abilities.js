/////////////// ENEMY_ABILITIES ///////////////

// Add damage over time effect
function damageOverTime(victim,attacker) {
    var amount = attacker.currentAbility.abilityDamge;
    // Display status ailment
    flashMessage(victim,attacker.currentAbility.dotStatus,attacker.currentAbility.damageDuration);
    // Deal damage over time at set interval
    var interval = setInterval(function() {
        if (victim.health <= 0) {
            clearInterval(interval);
        }
        else  {
            dealDamage(amount,attacker.type);
        }
    }, 250);
    setTimeout(function() {
        clearInterval(interval);
    }, attacker.currentAbility.damageDuration);
}


// Allow vampires to temporarily turn mostly invisible
function turnInvisible(enemy,enemyContainer) {
    console.log('turning invisible');
    enemy.invisible = true;
    enemy.evasion = 50;
    enemyContainer.lastChild.style.opacity = '0';
    // Drain health if invisible and within range
    var interval = setInterval(function() {
        if (enemy.health <= 0) {
            clearInterval(interval);
        }
        else if (enemy.invisible) {
            if (Math.abs(hero.row - enemy.row) <= 1 && Math.abs(hero.col - enemy.col) <= 1) {
                dealDamage(enemy.currentAbility.abilityDamge,enemy);
            }
        }
        else {
            clearInterval(interval);
        }
    }, 250);
    setTimeout(function() {
        enemy.invisible = false;
        enemy.evasion = 0;
        enemyContainer.lastChild.style.opacity = '1';
    }, enemy.currentAbility.abilityDuration);
}


// Allow enemies to shoot stuff at you
function enemyProjectile(enemy,enemyContainer) {
    // If enemy shoots projectiles, chance to attack if on same row or column
    if (randomNumber(1,100) < enemy.currentAbility.targetChance) {
        // If player is on same row and to the RIGHT
        if (enemy.row === hero.row && enemy.col < hero.col) {
            var direction = 'right';
        }
        // If player is on same row and to the LEFT
        else if (enemy.row === hero.row && enemy.col > hero.col) {
            var direction = 'left';
        }
        // If player is on same column and UP
        else if (enemy.col === hero.col && enemy.row > hero.row) {
            var direction = 'up';
        }
        // If player is on same column and UP
        else if (enemy.col === hero.col && enemy.row < hero.row) {
            var direction = 'down';
        }
    }
    // Otherwide fire in a random direction
    else {
        var directions = ['up','down','left','right'];
        var direction = directions[randomNumber(0,3)];
    }

    // Create the projectile element
    var spawn = enemyContainer.getBoundingClientRect();
    var object = document.createElement('img');
    var type = enemy.currentAbility.abilityImage[randomNumber(0,enemy.currentAbility.abilityImage.length - 1)];
        object.src = 'img/enemies/' + type;
        object.id = 'projectile' + randomNumber(1,1000);
        object.classList.add('projectile');
        object.style.width = cellSize + 'px';
        object.style.height = cellSize + 'px';
        object.style.top = enemy.top + 'px';
        object.style.left = enemy.left + 'px';
        // Rotate it to match the direction it is being fired in
        if (direction === 'down') { object.style.transform = 'rotate(180deg)'; }
        else if (direction === 'left') { object.style.transform = 'rotate(-90deg)'; }
        else if (direction === 'right') { object.style.transform = 'rotate(90deg)'; }
        levelContainer.appendChild(object);
    var projectile = document.getElementById(object.id);

    if (direction === 'up') {
        var distance = levelContainer.clientHeight + cellSize;
        var speed = numberOfRows * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateY(-' + distance + 'px)';
    }
    else if (direction === 'down') {
        var distance = levelContainer.clientHeight + cellSize;
        var speed = numberOfRows * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateY(' + distance + 'px) rotate(180deg)';
    }
    else if (direction === 'left') {
        var distance = levelContainer.clientWidth + cellSize;
        var speed = numberOfColumns * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateX(-' + distance + 'px) rotate(-90deg)';
    }
    else if (direction === 'right') {
        var distance = levelContainer.clientWidth + cellSize;
        var speed = numberOfColumns * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateX(' + distance + 'px) rotate(90deg)';
    }
    var canHit = true;
    // Check for collisions
    var interval = setInterval(function() {
        var projectilePos = projectile.getBoundingClientRect();
        var playerPos = player.getBoundingClientRect();
        if (Math.abs(projectilePos.top - playerPos.top) <= (cellSize * 0.85) &&
            Math.abs(projectilePos.left - playerPos.left) <= (cellSize * 0.85) &&
            canHit) {
            if (randomNumber(1,100) > hero.evasion) {
                // Check for projectile type
                type = type.split('-').pop().split('.').shift();
                if (type === 'ice') {
                    freezePerson(hero,enemy.currentAbility.damageDuration,'ice');
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
                else if (type === 'poison') {
                    hero.timesPoisoned++;
                    damageOverTime(hero,enemy);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
                else {
                    flashHitImage(hero,player);
                    dealDamage(enemy.currentAbility.abilityDamge,enemy);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
            }
            // Make player immune to damage until projectile leaves the current cell
            else {
                canHit = false;
                flashMessage(hero,'evaded!');
                hero.attacksEvaded++;
                var safeTime = enemy.currentAbility.abilityDuration * 1250;
                setTimeout(function() {
                    canHit = true;
                }, safeTime);
            }
        }
        // Check if there is a column collision
        for (var i = 0; i < columnPositions.length; i++) {
            if (Math.abs(projectilePos.top - columnPositions[i].top) <= (cellSize * 0.85) &&
            Math.abs(projectilePos.left - columnPositions[i].left) <= (cellSize * 0.85) &&
            canHit) {
                clearInterval(interval);
                projectile.style.display = 'none';
            }
        }
    }, 250);
    // Wait until the projectile is off screen, then remove it
    setTimeout(function() {
        clearInterval(interval);
        projectile.remove();
    }, speed * 1000);
}


// Allow enemies to rotate the equations
function rotateEquation(enemy) {
    var location = map[enemy.row - 1][enemy.col - 1];
    if (location.hasOwnProperty('answer') && location.answer !== 'captured') {
        var cell = document.querySelector('#' + enemy.location + ' p');
            cell.style.transition = '1s';
            cell.style.transform = 'rotate(180deg)';
            cell.style.color = '#E22727';
        setTimeout(function() {
            cell.style.transform = 'rotate(0deg)';
            cell.style.color = '#fff';
        }, enemy.currentAbility.abilityDuration);
    }
}


// Allow enemies to lay temporary traps
function layTrap(enemy) {
    var mapLocation = map[enemy.row - 1][enemy.col - 1];
    var cell = document.getElementById(enemy.location);
    if (mapLocation.contents === 'trap') {

    }
    else if (mapLocation.contents !== 'trap') {
        var original = mapLocation.contents;
        var originalDmg = mapLocation.trapDamage;
            mapLocation.contents = 'trap';
            mapLocation.trapType = enemy.currentAbility.ability;
            mapLocation.trapDamage = enemy.currentAbility.abilityDamge;
        if (enemy.currentAbility.ability === 'ice' || enemy.currentAbility.ability === 'web') {
            mapLocation.trapDuration = enemy.currentAbility.trapDuration;
        }
        var trap = document.createElement('img');
            trap.src = 'img/objects/' + enemy.currentAbility.ability + '-' + randomNumber(1,2) + '.gif';
            trap.opacity = '0';
            trap.style.animation = 'img-fade-in 1s 1';
            cell.appendChild(trap);

        setTimeout(function() {
            trap.style.animation = 'img-fade-out 1s 1 forwards';
            mapLocation.contents = original;
            mapLocation.trapType = '';
            mapLocation.trapDamage = originalDmg;
            setTimeout(function() {
                trap.style.display = 'none';
                cell.removeChild(trap);
            }, 1000);
        }, enemy.currentAbility.abilityDuration);
    }
}