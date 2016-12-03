/////////////// BUILD_MATH ///////////////

// Reset variables and route to the selected game mode
function addMath() {
    console.log('addMath');
    if (hero.bossLevel) {
        var mode = gameMode[randomNumber(0,gameMode.length - 1)];
        hero.bossLevel = hero.bosses[randomNumber(0,hero.bosses.length - 1)];
    }
    if (hero.challengeMode) {
        var mode = challengeMode[randomNumber(0,challengeMode.length - 1)];
    }
    else if (options.tutorial && options.newgame) {
        var mode = tutorialData.gameMode;
        document.querySelector('#top-bar .btn-options').style.pointerEvents = 'none';
        document.getElementById('top-bar').style.opacity = 0;
        document.getElementById('healthbar').style.opacity = 0;
        document.getElementById('xpbar').style.opacity = 0;
    }
    else {
        var mode = gameMode[randomNumber(0,gameMode.length - 1)];
    }

    hero.gameMode = mode;
    hero.answers = 0;
    hero.answersNeeded = 0;
    // Calculate the number of valid spaces that are available
    var total = 0;
    var correctNeeded = 0;
    var incorrectNeeded = 0;
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            if (map[r][c].contents === 'empty') {
                total++;
            }
        }
    }
    // Add math for exit location
    total++;
    // Calculate the number of valid and invalid answers needed to generate
    correctNeeded = Math.ceil(total * (randomNumber(correctMinThreshold,correctMaxThreshold) / 100));
    incorrectNeeded = total - correctNeeded;
    hero.answersNeeded = correctNeeded;

    // Traditional Game Modes
    if (mode === 'multiples') {
        multiples(total,correctNeeded,incorrectNeeded,displayMath);
    }
    else if (mode === 'factors') {
        factors(total,correctNeeded,incorrectNeeded,displayMath);
    }
    else if (mode === 'primes') {
        primes(total,correctNeeded,incorrectNeeded,displayMath);
    }
    else if (mode === 'equality') {
        equality(total,correctNeeded,incorrectNeeded,displayMath);
    }
    // Challenge Modes
    else if (mode === 'ascending' || mode === 'descending') {
        ascendingDescending(total,displayMath);
    }
}


// Generate list of correct and incorrect multiples
function multiples(total,correct,incorrect,callback) {
    console.log('Multiples');
    var difficulty = [
        {
            // EASY
            min: 2,
            max: 10,
            highest: 50
        },
        {
            // MEDIUM
            min: 5,
            max: 25,
            highest: 100
        },
        {
            // HARD
            min: 10,
            max: 50,
            highest: 200
        }
    ];
    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    if (options.tutorial && options.newgame) {
        target = tutorialData.target;
    }
    var correctArray = [];
    var incorrectArray = [];
    var highestValue = difficulty[hero.difficultyMath - 1].highest;
    var highestMultiple = Math.floor(highestValue / target);

    var correctCounter = 0;
    var incorrectCounter = 0;

    // Route answers to one of two arrays
    for (var i = 0; i < total; i++) {
        // Generate correct answers
        if (correctArray.length < correct) {
            answer = { number: randomNumber(1,highestMultiple) * target, answer: true };
            if (answer.number % target === 0) {
                correctArray.push(answer);
            }
            correctCounter++;
        }
        // Generate false answers
        else if (incorrectArray.length < incorrect) {
            answer = { number: randomNumber(2,highestValue), answer: false };
            if (answer.number % target !== 0) {
                incorrectArray.push(answer);
            }
            else {
                answer.number--;
                if (answer.number % target !== 0) {
                    incorrectArray.push(answer);
                }
                else {
                    i--;
                }
            }
            incorrectCounter++;
        }
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Multiples of ' + target;
    // Send to the display function
    console.log('Total: ' + finalArray.length + ' correctCounter: ' + correctCounter + ' incorrectCounter: ' + incorrectCounter);
    callback(finalArray,fadeIn);
}


// Generate list of correct and incorrect factors
function factors(total,correct,incorrect,callback) {
    console.log('factors');

    var difficulty = [
        {
            // EASY
            min: 20,
            max: 40,

        },
        {
            // MEDIUM
            min: 40,
            max: 100,
        },
        {
            // HARD
            min: 50,
            max: 200,
        }
    ];

    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    var safeArray = [];
    var unsafeArray = [];
    var correctArray = [];
    var incorrectArray = [];

    var counter = 0;

    // Generate list of safe numbers
    for (var i = 1; i <= target; i++) {
        if (target % i === 0) {
            safeArray.push(i);
        }
        // Add to wrong answers
        else {
            unsafeArray.push(i);
        }
    }

    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        if (correctArray.length < correct) {
            answer = { number: safeArray[randomNumber(0,safeArray.length - 1)], answer: true };
            correctArray.push(answer);
        }
        else if (incorrectArray.length < incorrect){
            answer = { number: unsafeArray[randomNumber(0,unsafeArray.length - 1)], answer: false };
            incorrectArray.push(answer);
        }
        counter++;
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Factors of ' + target;
    // Send to the display function
    callback(finalArray,fadeIn);
    console.log('Total: ' + finalArray.length + ' Counter: ' + counter);
}


// Generate list of prime numbers
function primes(total,correct,incorrect,callback) {
    console.log('primes');
        var difficulty = [
        {
            // EASY
            max: 50

        },
        {
            // MEDIUM
            max: 100
        },
        {
            // HARD
            max: 200
        }
    ];
    var correctArray = [];
    var incorrectArray = [];
    generatePrimeNumbers(difficulty[hero.difficultyMath - 1].max);

    var counter = 0;

    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        answer = { number: nonPrimes[randomNumber(0,nonPrimes.length - 1)], answer: false };
        if (correctArray.length < correct) {
            answer = { number: primes[randomNumber(0,primes.length - 1)], answer: true };
            correctArray.push(answer);
        }
        else if (incorrectArray.length < incorrect) {
            answer = { number: nonPrimes[randomNumber(0,nonPrimes.length - 1)], answer: false };
            incorrectArray.push(answer);
        }
        else {
            i--;
        }
        counter++;
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Prime Numbers';
    // Send to the display function
    callback(finalArray,fadeIn);
    console.log('Total: ' + finalArray.length + ' Counter: ' + counter);
}


// Generate an array of prime numbers up to the number given
function generatePrimeNumbers(max) {
    console.log('generatePrimeNumbers');
    var numbers = [];
    primes = [];
    nonPrimes = [];

    for (var i = 2; i <= max; i++) {
        numbers.push(i);   
    }
    while (numbers.length) {
        primes.push(numbers.shift());
        numbers = numbers.filter(function(i) {
            if (i % primes[primes.length - 1] === 0) {
                nonPrimes.push(i);
            }
            return i % primes[primes.length - 1] != 0;
        });
    }
}


// Generate list of correct and incorrect equality formulas
function equality(total,correct,incorrect,callback) {
    console.log('equality');

        var difficulty = [
        {
            // EASY
            min: 4,
            max: 15,
            highest: 25
        },
        {
            // MEDIUM
            min: 15,
            max: 75,
            highest: 100
        },
        {
            // HARD
            min: 70,
            max: 150,
            highest: 200
        }
    ];

    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    var correctArray = [];
    var incorrectArray = [];
    var safeMultiples = [];
    var unsafeMultiples = [];
    var safeFactors = [];
    var unsafeFactors = [];
    var symbols = ['+','-','*','/'];
    var highestValue = difficulty[hero.difficultyMath - 1].highest;
    var deviation = 10;

    // Generate list of safe multiples
    for (var i = 1; i <= target; i++) {
        if (target % i === 0) {
            safeMultiples.push(i);
        }
        // Add to wrong answers
        else {
            unsafeMultiples.push(i);
        }
    }

    // Generate list of safe factors
    for (var i = 1; i <= highestValue; i++) {
        if (i % target === 0) {
            safeFactors.push(i);
        }
        // Add to wrong answers
        else {
            unsafeFactors.push(i);
        }
    }

    // Loop through the total number of formulas needed
    for (var i = 0; i < total; i++) {
        var equation = '';
        var equationString = '';
        var symbol = symbols[randomNumber(0,symbols.length - 1)];
        var num1 = randomNumber(1,target);
        
        // Create addition equations
        if (symbol === '+') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num2 = target - num1;
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>' + symbol + '</p><p>' + num2;
                }
                else {
                    equationString = num1 + symbol + num2;
                }
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num2 = target - num1;
                    num2 += randomNumber(1,deviation);
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>' + symbol + '</p><p>' + num2;
                }
                else {
                    equationString = num1 + symbol + num2;
                }
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }

        // Create subtraction equations
        else if (symbol === '-') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num2 = target + num1;
                if (hero.difficultyMath === '3') {
                    equationString = num2 + '</p><p>' + symbol + '</p><p>' + num1;
                }
                else {
                    equationString = num2 + symbol + num1;
                }
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num2 = target + num1;
                    num2 += randomNumber(1,deviation);
                if (hero.difficultyMath === '3') {
                    equationString = num2 + '</p><p>' + symbol + '</p><p>' + num1;
                }
                else {
                    equationString = num2 + symbol + num1;
                }
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }

        // Create multiplication equations
        else if (symbol === '*') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num1 = safeMultiples[randomNumber(0,safeMultiples.length - 1)];
                var num2 = target / num1;
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>&times;</p><p>' + num2;
                }
                else {
                    equationString = num1 + '&times;' + num2;
                }
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num1 = unsafeMultiples[randomNumber(0,unsafeMultiples.length - 1)];
                var num2 = randomNumber(1,target);
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>&times;</p><p>' + num2;
                }
                else {
                    equationString = num1 + '&times;' + num2;
                }
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }

        // Create division equations
        else if (symbol === '/') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num1 = safeFactors[randomNumber(0,safeFactors.length - 1)];
                var num2 = num1 / target;
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>&divide;</p><p>' + num2;
                }
                else {
                    equationString = num1 + '&divide;' + num2;
                }
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num1 = unsafeFactors[randomNumber(0,unsafeFactors.length - 1)];
                var num2 = randomNumber(1,target);
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>&divide;</p><p>' + num2;
                }
                else {
                    equationString = num1 + '&divide;' + num2;
                }
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Equals ' + target;
    // Send to the display function
    callback(finalArray,fadeIn);
}

// Generate list of ascending or descending random values
function ascendingDescending(total,callback) {
    var difficulty = [
        {
            // EASY
            min: 1,
            max: totalCells,

        },
        {
            // MEDIUM
            min: 1,
            max: totalCells * 2,
        },
        {
            // HARD
            min: 1,
            max: totalCells * 4,
        }
    ];

    var finalArray = [];
    var numberArray = [];
    for (var i = 0; i < total; i++) {
        var number = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
        if (numberArray.indexOf(number) == -1) {
            answer = { number: number, answer: true };
            finalArray.push(answer);
            numberArray.push(number);
        }
        else {
            i--;
        }
    }
    if (hero.gameMode === 'ascending') {
        numberArray.sort( function(a,b) { return a - b; } );
        var modeText = 'Ascending Order';
    }
    else if (hero.gameMode === 'descending') {
        numberArray.sort( function(a,b) { return b - a; } );
        var modeText = 'Descending Order';
    }
    hero.ascending = numberArray;
    hero.answersNeeded = total;
    document.getElementById('game-mode').innerHTML = modeText;
    // Send to the display function
    callback(finalArray,fadeIn);
}


// Take the combined array of answers, shuffle it, then return it
function shuffle(array) {
    console.log('shuffle');
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

  return array;
}

// Place all of the math formulas into the grid
function displayMath(finalArray,callback) {
    console.log('displayMath');
    var i = 0;
    var safety = 0;
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            if (map[r][c].contents === 'empty' || map[r][c].contents === 'exit') {
                map[r][c].number = finalArray[i].number;
                map[r][c].answer = finalArray[i].answer;
                var cell = document.getElementById(map[r][c].location);
                var equation = document.createElement('p');
                if (options.tutorial && options.newgame) {
                    equation.style.opacity = '0';
                }
                equation.innerHTML = finalArray[i].number;
                if (cell !== null) {
                    cell.appendChild(equation);
                    i++;
                }
                else if (safety > 100) {
                    console.log('STOP!! displayMath');
                    break;
                }
                else {
                    safety++;
                }
            }
        }
    }
    callback();
    handleTraps();
    if (options.tutorial) {
        startTutorial();
    }
}


// Slide open exit cover
function openExitCover() {
    if (hero.answers >= hero.answersNeeded && options.tutorial === false) {
        var exitAnswer = document.querySelector('#' + levelExit.id + ' p');
        if (exitAnswer !== null) {
            exitAnswer.style.opacity = '0';
        }
        setTimeout(function() {
            var exitCover = document.querySelector('#' + levelExit.id + ' img');
                exitCover.style.transition = '2.25s ease-in-out';
                exitCover.style.transform = 'translateY(-100%)';
            document.getElementById('game-mode').innerHTML = 'Level Complete!';
        }, 1500);
        // Fade out all incorrect answers
        var maths = document.querySelectorAll('.cell p');
        for (var i = 0; i < maths.length; i++) {
            maths[i].style.opacity = '0';
            hero.canCapture = false;
        }
    }
}


// When activating a square check if answer is correct
function checkMath() {
    var correct = false;
    // Get the hero location so you can check the appropriate map data
    var munchLocation = map[hero.row - 1][hero.col - 1];
    // Prevent from capturing a tile more than once
    if (munchLocation.answer === 'captured' || hero.canCapture === false) {
        return;
    }
    // Ascending or Descending Order
    else if (munchLocation.number === hero.ascending[0]) {
        correct = true;
        munchLocation.answer = 'captured';
        hero.ascending.shift();
    }
    else if (munchLocation.answer && hero.challengeMode === false) {
        correct = true;
    }
    if (correct) {
        hero.answers++;
        restoreHealth(healthRestoreFromCapture);
        munchLocation.answer = 'captured';
        var square = document.querySelector('#' + munchLocation.location + ' p');
        setTimeout(function() {
            if (square === null) {
            }
            else {
                square.remove();
            }
        }, 250);
        if (hero.answers === hero.answersNeeded) {
            if (hero.bossLevel && hero.bossIsDead) {
                openExitCover();
            }
            else if (hero.bossLevel === false) {
                openExitCover();
            }
        }

        if (hero.gameMode === 'multiples') {
            hero.multiplesRight++;
        }
        else if (hero.gameMode === 'factors') {
            hero.factorsRight++;
        }
        else if (hero.gameMode === 'primes') {
            hero.primesRight++;
        }
        else if (hero.gameMode === 'equality') {
            hero.equalsRight++;
        }
    }
    else if (!munchLocation.hasOwnProperty("answer")) {

    }
    else {
        if (hero.gameMode === 'multiples') {
            hero.multiplesWrong++;
        }
        else if (hero.gameMode === 'factors') {
            hero.factorsWrong++;
        }
        else if (hero.gameMode === 'primes') {
            hero.primesWrong++;
        }
        else if (hero.gameMode === 'equality') {
            hero.equalsWrong++;
        }
        flashHitImage(hero,player);
        dealDamage(damageFromWrongAnswer,'wrong answer');
    }
}