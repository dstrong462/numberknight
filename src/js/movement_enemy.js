// Determine which direction to move in
function getMovementDirection(enemy,enemyContainer) {
    var directions = ['up','down','left','right'];
    var hasAttacked = false;
    // Passive enemies have a lower chance to target you
    if (enemy.moveType === 'passive') {
        var chanceToAttack = 40;
    }
    // Aggressive enemies are more likely to attack
    else {
        var chanceToAttack = 80;
    }

    // If on top row, do not move up
    if (enemy.row === 1) {
        var index = directions.indexOf('up');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row - 2][enemy.col - 1];
        // If the player is above them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('up',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
                var index = directions.indexOf('up');
                    directions.splice(index, 1);
            }
        }
    }

    // If on bottom row, do not move down
    if (enemy.row === numberOfRows) {
        var index = directions.indexOf('down');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row][enemy.col - 1];
        // If the player is below them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('down',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
                var index = directions.indexOf('down');
                    directions.splice(index, 1);
            }
        }
    }

    // If on left most column, do not move left
    if (enemy.col === 1) {
        var index = directions.indexOf('left');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row - 1][enemy.col - 2];
        // If the player is left of them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('left',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
                var index = directions.indexOf('left');
                    directions.splice(index, 1);
            }
        }
    }

    // If on right most column, do not move right
    if (enemy.col === numberOfColumns) {
        var index = directions.indexOf('right');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row - 1][enemy.col];
        // If the player is right of them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('right',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
                var index = directions.indexOf('right');
                    directions.splice(index, 1);
            }
        }
    }

    if (enemy.moveType === 'passive' && hasAttacked === false) {
        moveEnemy(enemy,enemyContainer,directions);
    }
    else if (enemy.moveType === 'aggressive' && hasAttacked === false) {
        getAggressiveMovement(enemy,enemyContainer);
    }
}


// Calculate how to hunt the player down
function getAggressiveMovement(enemy,enemyContainer) {
    // If on top of the hero
    if (enemy.row === hero.row && enemy.col === hero.col) {
    }
    // If on the same row
    else if (enemy.row === hero.row) {
        // Try to move right
        if (enemy.col !== numberOfColumns) {
            var mapLocation = map[enemy.row - 1][enemy.col];
            if (enemy.col < hero.col && mapLocation.hero === false) {
                var move = ['right'];
            }
        }
        // Try to move left
        if (enemy.col !== 1) {
            var mapLocation = map[enemy.row - 1][enemy.col - 2];
            if (enemy.col > hero.col && mapLocation.hero === false) {
                var move = ['left'];
            }
        }
    }
    // If on the same column
    else if (enemy.col === hero.col) {
        // Try to move down
        if (enemy.row !== numberOfRows) {
            var mapLocation = map[enemy.row][enemy.col - 1];
            if (enemy.row < hero.row && mapLocation.hero === false) {
                var move = ['down'];
            }
        }
        // Try to move up
        if (enemy.row !== 1) {
            var mapLocation = map[enemy.row - 2][enemy.col - 1];
            if (enemy.row > hero.row && mapLocation.hero === false) {
                var move = ['up'];
            }
        }
    }
    else if (Math.abs(enemy.row - hero.row) < Math.abs(enemy.col - hero.col)) {
        // Try to move to the same column
        // Try to move right
        if (enemy.col !== numberOfColumns) {
            var mapLocation = map[enemy.row - 1][enemy.col];
            if (enemy.col < hero.col && mapLocation.hero === false) {
                var move = ['right'];
            }
        }
        // Try to move left
        if (enemy.col !== 1) {
            var mapLocation = map[enemy.row - 1][enemy.col - 2];
            if (enemy.col > hero.col && mapLocation.hero === false) {
                var move = ['left'];
            }
        }
    }
    // Column position is closer
    else {
        // Try to move to the same row
        // Try to move down
        if (enemy.row !== numberOfRows) {
            var mapLocation = map[enemy.row][enemy.col - 1];
            if (enemy.row < hero.row && mapLocation.hero === false) {
                var move = ['down'];
            }
        }
        // Try to move up
        if (enemy.row !== 1) {
            var mapLocation = map[enemy.row - 2][enemy.col - 1];
            if (enemy.row > hero.row && mapLocation.hero === false) {
                var move = ['up'];
            }
        }
    }
    moveEnemy(enemy,enemyContainer,move);
}


// Move enemy based on passive or aggressive AI
function moveEnemy(enemy,enemyContainer,directions) {
    if (directions === undefined) {
        var move = 'none';
    }
    else {
        var move = directions[randomNumber(0,directions.length - 1)];
    }

    // MOVE UP
    if (move === 'up') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.top -= cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.row--;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }

    // MOVE DOWN
    else if (move === 'down') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.top += cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.row++;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }

    // MOVE LEFT
    else if (move === 'left') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.left -= cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.col--;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }

    // MOVE RIGHT
    else if (move === 'right') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.left += cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.col++;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }
    enemy.location = 'r' + enemy.row + 'c' + enemy.col;
}