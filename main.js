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

const { count } = require("console");
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
    return finalBet*lines;
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
const GetWin = (slots, lines, balance, bet) => {
    if (bet > balance){
        console.log("YOU WERE KICKED OUTA CASINO U GAMBLIN SHI");
        return -1;
    }

    let multiply = 1;
    let multipyValue;
    let sameInRow = true;
    const toTest = [];

    for (let i=0; i<COLS; i++){                    //rows - - - 
        toTest.push([]);
        for (let j=0; j<slots.length; j++){         //cols | | |
            toTest[i].push(slots[j][i]);
        }
    }
    DisplayMachine(toTest);

    for (let j=0; j<lines; j++){
        multipyValue = toTest[j][0];

        for (let i=1; i<ROWS; i++){
            if ( toTest[j][0]!==toTest[j][i] ){
                sameInRow = false;
                break;
            }
        }
        
        if (sameInRow){
            multiply *= SYMBOLS_VALUE[multipyValue];
            console.log(
                "-----------------WIN: " + (j+1) + ". line --> + "
                + SYMBOLS_VALUE[multipyValue] + "x (" + multiply*100 + "% overall)"
            );
        }
        sameInRow = true;
    }
    if (multiply===1){
        console.log("-----------------You lost your bet");
        multiply *= -1;
        balance += multiply*bet;
        console.log("----------------- " + multiply*bet + "$");
    }
    else{
        balance += multiply*bet;
        console.log("----------------- +" + multiply*bet + "$");
    }
    console.log("\n-----------------Your balance is " + balance);

    return balance;
}

const SpinningSlots = (lines, balance, bet) => {
    let stop = false;
    let spinNo=0;
    let newbala = balance;

    while ( newbala !== -1 ){
        spinNo++;
        console.log("-----------------" + spinNo + "th spin")
        newbala = GetWin(spin(), lines, newbala, bet);

        const stopNow = prompt("-----------------STOP?  1/0: \n\n");
        const numStop = parseFloat(stopNow);

        if ( numStop === 1){
            break
        }
    }
    console.log("\n\nYou have lost everything");
}

let balance = Deposit();
const lines = GetNumberOfLines();
let bet = PlaceBet(balance, lines);

SpinningSlots(lines, balance, bet);