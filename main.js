/**
 * What are we gonna collect:
 *      1) Deposit money
 *      2) Lines thats betted on
 *      3) Decrease balance by betted amout
 *      4) Very spin
 *      5) Validate if user won
 *      6) Sent the winning amount
 *      7) Play again / exit / kick in case low balance
 */

const { totalmem } = require("os");
const { parse } = require("path");
const prompt = require("prompt-sync")();




/**
 * Slot machine settings
 */
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {     // Frequency of each letter in one "col"
    A: 2,
    B: 4,
    C: 6,
    D: 8
}
const SYMBOLS_VALUE = {     // Multiplier if rows are the same
    A: 5,
    B: 4,
    C: 3,
    D: 2
}




const Deposit = () => {
    while ( true ){
        const depositAmout = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmout);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0 ){
            console.log("     Wrong input");
        }
        else {
            console.log("     + " + numberDepositAmount + "$");
            return numberDepositAmount;
        }
    }
}

const GetNumberOfLines = () => {
    while( true ){
        const lines = prompt("Enter amount of lines u wanna bet on: ");
        const numberLines = parseFloat(lines);

        if (isNaN(numberLines)){
            console.log("     Wrong input");
        }
        else if ( numberLines <= 0 || numberLines >= 4){
            console.log("     Wrong input");
        }
        else{
            console.log("     Bet is placed on " + numberLines + " lines.");
            return numberLines;
        }
    }
}

const CalculateFinalBet = ( finalBet, lines ) => {
    finalBet = finalBet / lines;
    console.log(
        "     Your bet is: " + finalBet + "$ per line (" + finalBet*lines + "$) in total"
    );
    return;
}

const PlaceBet = (balance, lines) => {
    
    let bet = false;
    let finalBet = 0;

    while ( !bet ){
        const betInput = prompt("Input money you wanna bet: ");
        const numberBetInput = parseFloat(betInput);
        
        let tmpBalance = balance - numberBetInput;

        if ( tmpBalance < 0){
            console.log("     Not enough balance");
            console.log("     It would fall to " + tmpBalance + "$.");
            bet = false;
        }
        else if ( tmpBalance <= 50 ){
            console.log("     Risky bet -> gonna be below 50$!!");
            const validator = prompt("     1/0 --- Still wanna bet this amount?: ");
            const numValidator = parseFloat(validator);
            if ( numValidator == 1 ) bet = true;
            else bet = false;
        }

        if ( tmpBalance > 50 || bet ) {
            console.log("     Bet placed successfully")
            balance -= numberBetInput;
            finalBet = numberBetInput;
            
            bet = true;
        }
    }
    
    finalBet = CalculateFinalBet( finalBet, lines );
    return finalBet;
}


const spin = () => {
    const symbols = [];

    for ( const[symbol, count] of Object.entries(SYMBOLS_COUNT) ) {
        for (let i=0; i<count; i++){
            symbols.push(symbol);
        }
    }

    const spinMachine = [];

    for (let i=0; i<COLS; i++){
        spinMachine.push([]);                   // Every iteration adds empty array to store symbols
        const symbolsInRoW = [...symbols];      // Create copy of symbols for each col

        for (let j=0; j<ROWS; j++){
            const randomIndex = Math.floor( Math.random() * symbolsInRoW.length )
            const selectByRandom = symbolsInRoW[randomIndex];

            spinMachine[i].push(selectByRandom);
            symbolsInRoW.splice(randomIndex, 1);
        }
    }

    return spinMachine;
}
const DisplayMachine = (toTest) => {
    for (let i=0; i<ROWS; i++){
        console.log(toTest[i]);
    }
}
const CheckSpin = (slots, lines) => {
    let multiply = 1;
    let multipyValue;
    let sameInRow = true;
    const toTest = [];

    for (let i=0; i<lines; i++){                    //rows - - - 
        toTest.push([]);
        for (let j=0; j<slots.length; j++){         //cols | | |
            toTest[i].push(slots[j][i]);
        }
    }
    DisplayMachine(toTest);

    for (let j=0; j<lines; j++){
        for (let i=1; i<ROWS; i++){
            console.log("porovnavam: " + toTest[j][0] + " a " + toTest[j][i])
            if ( toTest[j][0]!==toTest[j][i] ){
                sameInRow = false;
            }
            console.log("A vyslo " + sameInRow);
        }
        console.log(j + " row is " + sameInRow);
        sameInRow = true;

        // if (sameInRow){
        //     multipyValue = toTest[j][0];
        //     multiply *= multipyValue;
        //     console.log("You won in " + j + " line: " + multipyValue + " --- current multiplicity this spin " + multiply);

        //     sameInRow = true;
        // }

    }
}

const SpinningSlots = (lines) => {
    let stop = false;

    while ( true ){
        const slots = spin();
        let winning = CheckSpin(slots, lines);
        
        const stopNow = prompt("     STOP?  1/0: ");
        const numStop = parseFloat(stopNow);

        if ( numStop === 1){
            break
        }
    }
}

let balance = Deposit();
const lines = GetNumberOfLines();
let bet = PlaceBet(balance, lines);

SpinningSlots(lines);

// const slots = spin();
// console.log(slots)
// let winning = CheckSpin(slots, lines);