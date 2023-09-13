const { Console } = require("./console");
const console = new Console();

playMastermind();

function playMastermind() {
    do {
        playGame();
    } while (isResumed());
}

function playGame() {
    let game = initGame();
    console.writeln(game.TITLE);
    addRandomSecretCombination(game);
    printHeader(game);
    do {
        game.attempts++;
        addProposedCombination(game);
        result = getResult(game);
        printHeader(game);
        printBody(game, result);
        winner = result === game.WINNING_RESULT ? true : false;
    } while (!winner && game.attempts < game.MAX_ATTEMPTS);
    if (winner) {
        console.writeln(game.WINNER_MSG)
    } else {
        console.writeln(game.LOSSER_MSG)
    }
}

function initGame() {
    let game = {
        TITLE: `---- MASTERMIND ----`,
        COMBINATION_LENGTH: 4,
        MAX_ATTEMPTS: 10,
        WINNING_RESULT: `4 Black(s) and 0 white(s)`,
        resultsRedord: ``,
        attempts: 0,
        SECRET_COMBINATION: ``,
        PROPOSED_COMBINATION: ``,
        WINNER_MSG: `You've won!!! ;-)`,
        LOSSER_MSG: `You've lost!!! :-(`
    }
    return game;
}

function printHeader(game) {
    console.writeln(`${game.attempts} attempt(s) \n****`)
}

function printBody(game, result) {
    game.resultsRedord += result + `\n`
    console.writeln(game.resultsRedord)
}

function addRandomSecretCombination(game) {
    let error;
    let secret;
    do {
        secret = console.readString(`Introduce a secret combination: `)
        error = !isPosibleCombination(game, secret)
    } while (error)
    game.SECRET_COMBINATION = secret;
}

function addProposedCombination(game) {
    let error;
    let proposedCombination;
    do {
        proposedCombination = console.readString(`Propose a combination: `)
        error = !isPosibleCombination(game, proposedCombination)
    } while (error)
    game.PROPOSED_COMBINATION = proposedCombination;
}

function isPosibleCombination(game, combination) {
    let wrongLength = combination.length !== game.COMBINATION_LENGTH
    if (wrongLength) {
        console.writeln(`Wrong proposed combination length`);
    };
    let rightColors = true;
    let possibleColors = [`r`, `g`, `y`, `b`, `m`, `c`];
    for (let i = 0; i < combination.length; i++) {
        rightColors &&= isIn(combination[i], possibleColors);
    }
    if (!rightColors) {
        console.writeln(`Wrong colors, they must be: rgybmc`)
    }
    return !wrongLength && rightColors;
}

function isIn(element, vector) {
    let isIn = false;
    for (let item of vector) {
        if (item == element) {
            isIn = true;
        };
    };
    return isIn;
}

function getResult(game) {
    let blackCounter = 0;
    let whiteCounter = 0;
    for (let i = 0; i < game.COMBINATION_LENGTH; i++) {
        if (game.SECRET_COMBINATION[i] === game.PROPOSED_COMBINATION[i]) {
            blackCounter++
        } else {
            if (isIn(game.PROPOSED_COMBINATION[i], game.SECRET_COMBINATION)) {
                whiteCounter++
            }
        }
    };
    return `${blackCounter} Black(s) and ${whiteCounter} white(s)`;
}

function isResumed() {
    let error = false;
    let answer;
    do {
        answer = console.readString(`Do you want to continue? `);
        error = answer !== `n` && answer !== `y`;
        if (error) {
            console.writeln(`Please, answer "y" or "n"`);
        }
    } while (error);
    return answer === `y` ? true : false;
}