const { Console } = require("../../node_modules/console-mpds");
const console = new Console();

playMastermind();

function playMastermind() {
    do {
        playGame();
    } while (isResumed());

    function playGame() {
        const COMBINATION_LENGTH = 4;
        const MAX_ATTEMPTS = 10
        const WINNING_RESULT = `4 Black(s) and 0 white(s)`;
        console.writeln(`---- MASTERMIND ----`);
        const secretCombination = makeSecretCombination();
        const printBoard = ((header, initialAttempt) => {
            console.writeln(`${initialAttempt} ${header} \n****`)
            let attempt = initialAttempt
            return body => {
                attempt++;
                console.writeln(`${attempt} ${header} \n${body}`);
                header += `\n` + body;
            };
        })(`Attempts`, 0);

        (function gameLoop(attempts) {
            console.writeln(MAX_ATTEMPTS)
            let proposedCombination = proposeCombination();
            let result = getResult(proposedCombination);
            printBoard(`${proposedCombination} --> ${result}`);
            if (result === WINNING_RESULT) {
                return console.writeln(`You've won!!! ;-)`);
            } else if (attempts === MAX_ATTEMPTS) {
                return console.writeln(`You've lost!!! :-(`);
            }
            attempts++;
            return gameLoop(attempts);
        })(1);

        function makeSecretCombination() {
            let error;
            let secret;
            do {
                secret = console.readString(`Introduce a secret combination: `)
                error = !isPosibleCombination(secret)
            } while (error)
            return secret;
        }

        function isPosibleCombination(combination) {
            let wrongLength = combination.length !== COMBINATION_LENGTH
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

        function proposeCombination() {
            let error;
            let proposedCombination;
            do {
                proposedCombination = console.readString(`Propose a combination: `)
                error = !isPosibleCombination(proposedCombination)
            } while (error)
            return proposedCombination;
        }

        function getResult(proposedCombination) {
            let blackCounter = 0;
            let whiteCounter = 0;
            for (let i = 0; i < COMBINATION_LENGTH; i++) {
                if (secretCombination[i] === proposedCombination[i]) {
                    blackCounter++
                } else {
                    if (isIn(proposedCombination[i], secretCombination)) {
                        whiteCounter++
                    }
                }
            }
            return `${blackCounter} Black(s) and ${whiteCounter} white(s)`
        }
    }

    function isResumed() {
        let error = false;
        let answer;
        do {
            answer = console.readString(`Do you want to continue? `);
            error = answer !== `n` && answer !== `y`;
            if (error) {
                console.writeln(`Pleaser, answer "y" or "n"`);
            }
        } while (error);
        return answer === `y` ? true : false;
    }
}
