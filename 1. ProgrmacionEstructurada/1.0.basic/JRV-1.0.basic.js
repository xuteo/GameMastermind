const { Console } = require("../../node_modules/console-mpds");
const console = new Console();

playMastermind();

function playMastermind(){
    do{
        playGame();
    }while(isResumed());

    function playGame(){
        const MAX_PLAYERS = 2;
        const COMBINATION_LENGTH = 4;
        const MAX_ATTEMPTS = 10
        let attempsCount = 0;
        let msgCombinationsRecord = ``;
        let winner;
        console.writeln(`---- MASTERMIND ----`);
        let secretCombination = makeSecretCombination();
        updateBoard();
        let proposedCombination;
        let result;
        do{
            proposedCombination = proposeCombination();
            result = getResult(secretCombination, proposedCombination);
            updateBoard(proposedCombination, result);
            winner = result ===`4 Black(s) and 0 white(s)`?true:false;
        }while(!winner && attempsCount <= MAX_ATTEMPTS);
        if (winner){
            console.writeln(`You've won!!! ;-)`)
        }else{
            console.writeln(`You've lost!!! :-(`)
        }

        function makeSecretCombination(){
            let error;
            let secret;
            do{
                secret = console.readString(`Introduce a secret combination: `)
                error = !isPosibleCombination(secret)
            }while(error)
            return secret;
        }

        function isPosibleCombination(combination){
            let wrongLength = combination.length !== COMBINATION_LENGTH
            if(wrongLength){
                console.writeln(`Wrong proposed combination length`);
            };
            let rightColors = true;
            let possibleColors = [`r`,`g`,`y`,`b`,`m`,`c`];
            for(let i=0; i< combination.length; i++){
                rightColors &&= isIn(combination[i], possibleColors);
            }
            if(!rightColors){
                console.writeln(`Wrong colors, they must be: rgybmc`)
            }
            return !wrongLength && rightColors;
        }

        function isIn(element, vector){
            let isIn = false;
                for(let item of vector){
                    if(item == element){
                        isIn = true;
                    };
                };
            return isIn;
        }

        function proposeCombination(){
            let error;
            let proposedCombination;
            do{
                proposedCombination = console.readString(`Propose a combination: `)
                error = !isPosibleCombination(proposedCombination)
            }while(error)
            return proposedCombination;
        }

        function getResult(secretCombination, proposedCombination){
            let blackCounter = 0;
            let whiteCounter = 0;
            for(let i=0; i< COMBINATION_LENGTH; i++){
                if (secretCombination[i] === proposedCombination[i]){
                    blackCounter++
                }else{
                    if (isIn(proposedCombination[i],secretCombination)){
                        whiteCounter++
                    }
                }
            }
            return `${blackCounter} Black(s) and ${whiteCounter} white(s)`
        }

        function updateBoard(proposedCombination, result){
            let msg = `${attempsCount} attempt(s) \n****\n` 
            if(proposedCombination !== undefined && result !== undefined){
                msgCombinationsRecord+= `${proposedCombination} --> ${result}\n`
            }
            msg += msgCombinationsRecord
            console.writeln(msg)
            attempsCount++
        }
    }
    function isResumed(){
    let result;
    let answer;
    let error = false;
    do {
      answer = console.readString(`Do you want to continue? `);
      result = answer === `y`;
      error = !result && answer !== `n`;
      if (error) {
        console.writeln(`Pleaser, answer "y" or "n"`);
      }
    } while (error);
    return result;
    }
}
