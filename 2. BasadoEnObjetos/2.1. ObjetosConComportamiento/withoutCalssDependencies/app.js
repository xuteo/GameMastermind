const { Console } = require("./console");
const console = new Console();

playMastermind();

function playMastermind() {
    let retryDialog = initYesNoDialog(`Do you want to continue? `);
    do {
        const game = initGame();
        console.writeln(game.TITLE);
        game.play();
        retryDialog.askToPlayAgain();
    } while (retryDialog.isAffirmative());
}

function initYesNoDialog(question) {
    let that = {
        question: question,
        answer: ``,
        saveAnswer: function (answer) {
            this.answer = answer;
        }
    };

    return {
        isAffirmative: function () {
            return that.answer === `y`;
        },

        isNegative: function () {
            return that.answer === `n`;
        },

        askToPlayAgain: function () {
            let error = false;
            do {
                let answer = console.readString(that.question)
                that.saveAnswer(answer);
                error = !this.isAffirmative() && !this.isNegative();
                if (error) {
                    console.writeln(`Please, answer "y" or "n"`);
                }
            } while (error);
        }
    };
}

function initGame() {
    let that = {
        COMBINATION_LENGTH: 4,
        MAX_ATTEMPTS: 10,
        WINNING_RESULT: `4 Black(s) and 0 white(s)`,
        lastResult: undefined,
        resultsRedord: ``,
        attempts: 0,
        SECRET_COMBINATION: ``,
        PROPOSED_COMBINATION: ``,
        WINNER_MSG: `You've won!!! ;-)`,
        LOSSER_MSG: `You've lost!!! :-(`,
        POSSIBLE_COLORS: [`r`, `g`, `y`, `b`, `m`, `c`],

        createRandomSecretCombination: function () {
            let secretCombination;
            do {
                secretCombination = console.readString(`Introduce a secret combination: `)
            } while (this.error().any(secretCombination))
            this.SECRET_COMBINATION = secretCombination;
        },

        error: function () {
            
            return {
                isRightLength: function (combination) {
                    let isRightLength = combination.length === that.COMBINATION_LENGTH;
                    if (!isRightLength) {
                        console.writeln(`Wrong proposed combination length`);
                    }
                    return isRightLength;
                },

                containWrongColors: function (combination) {
                    let rightColors = true;
                    for (let i = 0; i < combination.length; i++) {
                        rightColors &&= that.isIn(combination[i], that.POSSIBLE_COLORS);
                    };
                    if (!rightColors) {
                        console.writeln(`Wrong colors, they must be: rgybmc`)
                    }
                    return !rightColors;
                },

                containRepeatedColors: function (combination) {
                    let colorCount = {};
                    for (let i = 0; i < combination.length; i++) {
                        if (colorCount[combination[i]] === undefined) {
                            colorCount[combination[i]] = 1
                        } else {
                            console.writeln(`Repeated colors are not allowed`)
                            return true;
                        }
                    };
                    return false;
                },

                any: function (combination) {
                    return !this.isRightLength(combination) || this.containWrongColors(combination) || this.containRepeatedColors(combination);
                }
            }
        },


        isIn: function (element, vector) {
            let isIn = false;
            for (let item of vector) {
                if (item == element) {
                    isIn = true;
                };
            };
            return isIn;
        },

        printGame: function () {
            console.writeln(`${that.attempts} attempt(s)\n****\n${this.resultsRedord}`);
        },

        addProposedCombination: function () {
            let combination;
            do {
                combination = console.readString(`Propose a combination: `)
            } while (this.error().any(combination))
            this.PROPOSED_COMBINATION = combination;
        },

        addResultRecord: function (result) {
            this.resultsRedord += `${this.PROPOSED_COMBINATION} --> ${result}\n`;
            this.lastResult = result;
            this.incAttempts();
        },

        getResult: function () {
            let blackCounter = 0;
            let whiteCounter = 0;
            for (let i = 0; i < this.COMBINATION_LENGTH; i++) {
                if (this.SECRET_COMBINATION[i] === this.PROPOSED_COMBINATION[i]) {
                    blackCounter++
                } else {
                    if (this.isIn(this.PROPOSED_COMBINATION[i], this.SECRET_COMBINATION)) {
                        whiteCounter++
                    }
                }
            };
            return `${blackCounter} Black(s) and ${whiteCounter} white(s)`;
        },

        incAttempts() {
            this.attempts++
        },

        isWinner: function () {
            return this.lastResult === this.WINNING_RESULT;
        },

        isGameOver: function () {
            return this.isWinner() || this.attempts >= this.MAX_ATTEMPTS;
        }

    };

    return {
        play: function () {
            that.createRandomSecretCombination();
            that.printGame();
            do {
                that.addProposedCombination();
                that.addResultRecord(that.getResult());
                that.printGame();
            } while (!that.isGameOver());
            console.writeln(that.isWinner() ? that.WINNER_MSG : that.LOSSER_MSG);
        },
        TITLE: `---- MASTERMIND ----`
    };
}
