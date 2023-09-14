const { Console } = require("./console");
const console = new Console();


mastermind().play();

function mastermind() {

    return {
        play: function () {
            let retryDialog = initYesNoDialog(`Do you want to continue? `);
            do {
                const game = initGame();
                game.play();
                retryDialog.askToPlayAgain();
            } while (retryDialog.isAffirmative());
        }   
    }
};

function initYesNoDialog (question) {
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

function initGame () {
    let that = {
        MAX_ATTEMPTS: 10,

        resume (secretCombination, proposedCombination) {
            return secretCombination.get() !== proposedCombination.getLast() && 
                proposedCombination.count() < this.MAX_ATTEMPTS;
        }
    };

    return {
        play () {
            initGameView().printTitle();
            const secretCombination = initSecretCombination();
            secretCombination.create();
            const proposedCombination = initProposedCombination();
            initGameView().printHeader(proposedCombination);
            do {
                proposedCombination.add(proposedCombination.request());
                initGameView().printHeader(proposedCombination);
                initGameView().printBoard(initResult().calculate(secretCombination, proposedCombination)); 
            } while (that.resume(secretCombination, proposedCombination));
            initGameView().printFinalResult(secretCombination, proposedCombination);
        },
    };

};

function initResult () {

    let that = {
        createResultHolder () {
            return {
                proposedCombination: `` ,
                blackCount: 0,
                whiteCount: 0
            }
        },
    
        countBlacks (secretCombination, proposedCombinationItem) {
            let blackCounter = 0
            for (let i = 0; i < secretCombination.get().length; i++) {
                if (secretCombination.get()[i] === proposedCombinationItem[i]) {
                    blackCounter++;
                }
            }
            return blackCounter;
        },
    
        countWhites (secretCombination, proposedCombinationItem) {
            let matches = 0;
            for (let i = 0; i < secretCombination.get().length; i++) {
                for (let j = 0; j < proposedCombinationItem.length; j++) {
                    if (secretCombination.get()[i] === proposedCombinationItem[j]) {matches++}
                }
            }
            return matches - this.countBlacks(secretCombination, proposedCombinationItem)
        }
    }

    return {
        calculate (secretCombination, proposedCombination) {
            let results = []
            for (let combinationItem of proposedCombination.getAll()) {
                let result = that.createResultHolder();
                result.proposedCombination = combinationItem
                result.blackCount = that.countBlacks(secretCombination, combinationItem);
                result.whiteCount = that.countWhites(secretCombination, combinationItem);
                results[results.length] = result               
            }
            return results;
        }
    }
}

function initGameView () {
    return {

        printTitle () {
            console.writeln(`--- MASTERMIND ---`)
        },

        printWinner () {
            console.writeln(`You've won!!! ;-)`)
        },

        printLosser () {
            console.writeln(`You've lost!!! :-(`) 
        },

        printHeader (proposedCombination) {
            console.writeln(`${proposedCombination.count()} attempt(s)\n****`)
        },

        printFinalResult (secretCombination, proposedCombination) {
            console.writeln(secretCombination.get() === proposedCombination.getLast() ? 
                this.printWinner() : this.printLosser());
        },

        printBoard (results) {
            let msgResult = ``; 
            for (resultItem of results) {
                msgResult += `${resultItem.proposedCombination} --> ${resultItem.blackCount} Black(s) and ${resultItem.whiteCount} white(s)\n` 
            }
            console.writeln(msgResult)
        }
    }
};

function initSecretCombination() {
    let that = {
        SECRET_COMBINATION: [],
        createRandomSecretCombination: function () {
            for (let i = 0; i<initCombinationError().getCombinationLength();i++ ) {
                do {
                    this.assignRandomLetter(i)
                } while (!initCombinationError().containUniqueColors(this.SECRET_COMBINATION))
            }
        },

        getRandomInt: function (max) {
            return Math.floor(Math.random() * max);
        },
        
        assignRandomLetter (index) {
            this.SECRET_COMBINATION[index] = initColor()[this.getRandomInt(initColor().length)]
        }
    }

    return {
        create () {
            that.createRandomSecretCombination();
        },

        get () {
            let stringCombination = ``; 
            for (item of that.SECRET_COMBINATION) {
                stringCombination += item;
            }
            return stringCombination;
        }
    };
}

function initProposedCombination() {
    let that = {
        proposedCombinations: [],
    }

    return {
        request () {
            let combination;
            do {
                combination = initProposedCombinationView().read();
                initCombinationErrorView().printErrors(combination);
            } while (initCombinationError().anyError(combination));
            return combination;
        },

        add (proposedCombination) {
            that.proposedCombinations[that.proposedCombinations.length] = proposedCombination;
        },

        getLast () {
            if (this.count() > 0) {
                return that.proposedCombinations[this.count() - 1];
            } else { return undefined} 
        },

        getAll () {
            return that.proposedCombinations;
        },

        count () {
            return that.proposedCombinations.length;
        }
    }
};

function initProposedCombinationView () {
    return {
        read () {
            return console.readString(`Propose a combination: `);
        }
    }
};

function initCombinationError () {
    let that = {
        COMBINATION_LENGTH: 4,
        POSSIBLE_COLORS: initColor(),
    }
    return {
        anyError: function (combination) {
            return !this.isRightLength(combination) || !this.isInColorSet(combination) || !this.containUniqueColors(combination);
        },
        
        isRightLength: function (combination) {        
            return combination.length === that.COMBINATION_LENGTH;
        },

        isInColorSet: function (combination) {
            let isInColorSet = true;
            for (let i = 0; i < combination.length; i++) {
                isInColorSet &&= this.isIn(combination[i], that.POSSIBLE_COLORS);
            };
            return isInColorSet;
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

        getCombinationLength () {
            return that.COMBINATION_LENGTH;
        },
    }
};

function initCombinationErrorView () {
    return {
        printErrors (combination) {
            let errorLiterals = {
                isRightLength: [`Wrong proposed combination length`, ``],
                isInColorSet: [`Wrong colors, they must be: rgybmc`, ``],
                containUniqueColors : [`Repeated colors are not allowed`, ``]
            };

            let errors = {};
            errors.isRightLength = initCombinationError().isRightLength(combination);
            errors.isInColorSet = initCombinationError().isInColorSet(combination);
            errors.containUniqueColors = initCombinationError().containUniqueColors(combination);
            for (isError in errors) {
                let LiteralIndex = errors[isError] ? 1 : 0     
                if(!errors[isError]){console.writeln(errorLiterals[isError][LiteralIndex])}
            }
        }
    }
};

function initColor () {
    return [`r`, `g`, `y`, `b`, `m`, `c`];
};



