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
        MAX_ATTEMPTS: 10,
        attempts: 0,
        WINNER_MSG: `You've won!!! ;-)`,
        LOSSER_MSG: `You've lost!!! :-(`,

        printGame: function ({results}) {
            let msgResult = ``; 
            for (i = 0; i< results.length; i++) {
                msgResult += `${results[i].proposedCombination} --> ${results[i].result}\n`
            }
            console.writeln(`${that.attempts} attempt(s)\n****\n${msgResult}`);

        },

        incAttempts: function () {
            this.attempts++
        },

        isGameOver: function ({results}) {
            return results[results.length -1].winnerCombination || this.attempts >= this.MAX_ATTEMPTS;
        }

    };

    return {
        play: function () {
            const result = initResult(initSecretCombination())// create compound object result associate to a secretCombination Object
            console.writeln(`${that.attempts} attempt(s)\n****\n`)
            do {
                result.addResult();
                that.incAttempts();
                that.printGame(result);
            } while (!that.isGameOver(result));
            console.writeln(result.results[result.results.length -1].winnerCombination ? that.WINNER_MSG : that.LOSSER_MSG);
        },
        TITLE: `---- MASTERMIND ----`
    };

}

function initResult(secretCombination) {
 let that = {
        secretCombination: secretCombination,
        results: [],
        proposedCombination: undefined,
        askProposedCombination: function () {
            this.proposedCombination = initProposedCombination();
        },
        getResult: function () {
            this.askProposedCombination()
            let blackCounter = 0;
            let whiteCounter = 0;
            for (let i = 0; i < this.secretCombination.SECRET_COMBINATION.length; i++) {
                if (this.secretCombination.SECRET_COMBINATION[i] === this.proposedCombination.PROPOSED_COMBINATION[i]) {
                    blackCounter++
                } else {
                    if (initUtils().isIn(this.proposedCombination.PROPOSED_COMBINATION[i], this.secretCombination.SECRET_COMBINATION[i])) {
                        whiteCounter++
                    }
                }
            };

            return {
                proposedCombination: that.proposedCombination.PROPOSED_COMBINATION, 
                SECRET_COMBINATION: that.secretCombination.SECRET_COMBINATION,
                result: `${blackCounter} Black(s) and ${whiteCounter} white(s)`,
                winnerCombination: blackCounter === 4
            }
        }
    }
 
    return {
        addResult: function () {
            that.results[that.results.length] = that.getResult(); 
        },
        results: that.results,
    };
};

function initSecretCombination() {
    let that = {
        COMBINATION_LENGTH: 4,
        SECRET_COMBINATION: [],
        createRandomSecretCombination: function () {
            let posibleColors = initColor();
            for (i = 0; i < this.COMBINATION_LENGTH; i++) {
                const randomIndex = this.getRandomInt(posibleColors.length);             
                this.SECRET_COMBINATION[this.SECRET_COMBINATION.length] = posibleColors[randomIndex];               
                delete posibleColors[randomIndex];
                posibleColors = posibleColors.filter(element => element) // elimina posiciones que cohersionan a false
            }
        },
        getRandomInt: function (max) {
            return Math.floor(Math.random() * max);
        } 
    }

    that.createRandomSecretCombination();
    return {
        SECRET_COMBINATION: that.SECRET_COMBINATION,
    };
}

function initProposedCombination() {
    let that = {
        COMBINATION_LENGTH: 4,
        POSSIBLE_COLORS: initColor(),
        PROPOSED_COMBINATION: undefined,
        getProposedCombination: function () {
            let combination;
            do {
                combination = console.readString(`Propose a combination: `);
                this.printErrors(combination);
            } while (this.anyError(combination))
            this.PROPOSED_COMBINATION = combination;
            return combination;
        },

        anyError: function (combination) {
            return !this.isRightLength(combination) || !this.isInColorSet(combination) || !this.containUniqueColors(combination);
        },
        
        isRightLength: function (combination) {        
            return combination.length === this.COMBINATION_LENGTH;
        },

        isInColorSet: function (combination) {
            let isInColorSet = true;
            let utils = initUtils();
            for (let i = 0; i < combination.length; i++) {
                isInColorSet &&= utils.isIn(combination[i], this.POSSIBLE_COLORS);
            };
            return isInColorSet;
        },

        containUniqueColors: function (combination) {
            let colorCount = {};
            for (let i = 0; i < combination.length; i++) {
                if (colorCount[combination[i]] === undefined) {
                    colorCount[combination[i]] = 1
                } else {
                    return false;
                }
            };
            return true;
        },

        printErrors(combination) {
            let errorLiterals = {
                isRightLength: [`Wrong proposed combination length`, ``],
                isInColorSet: [`Wrong colors, they must be: rgybmc`, ``],
                containUniqueColors : [`Repeated colors are not allowed`, ``]
            };

            let errors = {};
            errors.isRightLength = this.isRightLength(combination);
            errors.isInColorSet = this.isInColorSet(combination);
            errors.containUniqueColors = this.containUniqueColors(combination);

            for (errorMethod in errors) {
                let LiteralIndex = errors[errorMethod] ? 1 : 0       
                console.writeln(errorLiterals[errorMethod][LiteralIndex])
            }
        }
    }

    that.getProposedCombination();

    return {PROPOSED_COMBINATION: that.PROPOSED_COMBINATION}
};

function initColor () {
    const posibleColors = [`r`, `g`, `y`, `b`, `m`, `c`];
    return posibleColors;
};

function initUtils () {
    return {
        isIn: function (element, vector) {
            let isIn = false;
            for (let item of vector) {
                if (item == element) {
                    isIn = true;
                };
            };
            return isIn;
        }
    }
    
}
