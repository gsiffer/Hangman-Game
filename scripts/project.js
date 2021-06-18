

const hints             = document.getElementById('hint');
const displayWord       = document.getElementById('display-word');
const abcButtons        = document.querySelectorAll('#abc input');
const hangmanImg        = document.getElementById('hangman-img');
const incorrect        = document.getElementById('incorrect');

const popUpFrame        = document.getElementById('pop-up');
const welcomePopUp      = document.getElementById('welcome-pop-up');
const gameRulePopUp     = document.getElementById('game-rule-pop-up');
const popUpTitle        = document.getElementById('pop-up-title');
const popUpImage        = document.getElementById('pop-up-image');

const btnStart          = document.getElementById('start');
const btnGameRule       = document.getElementById('game-rule');
const btnClose          = document.getElementById('close');
const btnOk             = document.getElementById('ok');

let popUpFrameOpacity   = 0;
let popUpAnimationHandler;
let popUpTimeoutHandler;

let firstRun = true;
let wrongAnswerCount;
let isMatched;
let wordObj;
let magicWordArray  = [];

let $childLabel;

class Hangman{

    constructor(){

        this.words = [
                        "St. John's",
                        'Charlottetown',
                        'Halifax',
                        'Fredericton',
                        'Quebec City',
                        'Toronto',
                        'Winnipeg',
                        'Regina',
                        'Edmonton',
                        'Victoria',
                        'Iqaluit',
                        'Yellowknife',
                        'Whitehorse'
                    ];

        this.hints = [
                        'City in Newfoundland and Labrador',
                        'City in Prince Edward Island',
                        'City in Nova Scotia',
                        'City in New Brunswick',
                        'City in Quebec',
                        'City in Ontario',
                        'City in Manitoba',
                        'City in Saskatchewan',
                        'City in Alberta',
                        'City in British Columbia',
                        'City in Nunavut',
                        'City in Northwest Territories',
                        'City in Yukon Territory'
                    ];
    }

    selectRandom() {

        const randomNum = Math.floor(Math.random() * this.words.length); 
        
        return { Word: this.words[randomNum], Hint: this.hints[randomNum] };
    }            
}

class Word {
    
    static get LINE(){
        return '__';
    }
    constructor(word){
        this.solution = word;
    }

    maskedSolution(){

        let magicWordArray = [];

        if(this.solution.length != 0) {
            
            [...this.solution].forEach((char) =>{
                
                if(char != ' ' && char != "'" && char != ".") {
                    magicWordArray.push(Word.LINE);
                } 
                else {
                    magicWordArray.push(char);
                }
            });
        }

        return magicWordArray;
    }

    letterInText(char){

        let letterPositionArray = [];

        if(char.length === 1) {
            
            for(let i = 0; i < this.solution.length; i++){

                if(this.solution[i].toLowerCase() === char.toLowerCase()){
                    
                    letterPositionArray.push(i);
                }
            }
        }
        
        return letterPositionArray;
    }

    isMatch(magicWordArray){
        
        if(this.solution.toLowerCase() === magicWordArray.join('').toLowerCase()){
            return true;
        }

        return false;
    }
}

const hangmanObj = new Hangman();

run();

function run(){

    popUpAnimationHandler  = requestAnimationFrame(fadePopUp);

    abcButtons.forEach(function(button){
        button.addEventListener('click', hitButton);
        button.disabled = 'disabled';
    });
}

function fadePopUp(){
   
    if(popUpFrameOpacity <  1){
        popUpFrameOpacity += 0.01;
        popUpFrame.style.opacity = popUpFrameOpacity;
        popUpTimeoutHandler = setTimeout(function(){
            popUpAnimationHandler = requestAnimationFrame(fadePopUp);
        }, 10);
    }
    else{
        clearTimeout(popUpTimeoutHandler);
        cancelAnimationFrame(popUpAnimationHandler);
        popUpFrameOpacity = 0;
    }  
}

btnStart.addEventListener('click', function(){
    startTheGame();
    btnStart.style.display = 'none';
    firstRun ? btnStart.textContent = 'Play again' : firstRun = false;
});

function startTheGame(){

    const wordAndHintObj = hangmanObj.selectRandom();

    wordObj         = new Word(wordAndHintObj.Word);
    hints.innerHTML = wordAndHintObj.Hint;
    
    magicWordArray   = wordObj.maskedSolution();

    initialize(magicWordArray);
}

function initialize(magicWordArray){

    displayWord.innerHTML = '';
    incorrect.innerHTML = '0';
    wrongAnswerCount = 0;
    isMatched = false;

    hangmanImg.firstElementChild.setAttribute('src', `images/hangman0.png`);

    magicWordArray.forEach(function(char){
        displayLabel(char);
    })

    abcButtons.forEach(function(button){
        button.classList.remove('used-letter');
        button.disabled = false;
    });
}

function displayLabel(char){

    if(char != '.' && char != "'"){
        displayWord.innerHTML += `<label>${char}</label>`;
    }
    else{
        displayWord.innerHTML += `<label style='width: auto'>${char}</label>`;
    }
}

function hitButton(e){
   
    const letter = this.getAttribute('value')
    const letterPositionArray = wordObj.letterInText(letter);
   
    if(letterPositionArray.length != 0 && wrongAnswerCount < 6){

        letterAnimation(letterPositionArray, letter);

        this.disabled = 'disabled';
        this.classList.toggle('used-letter');
        
        if(wordObj.isMatch(magicWordArray)){
            isMatched = true;
            endGame('Won');
        }
    }
    else if(wrongAnswerCount < 6 && !isMatched){

        hangmanImg.firstElementChild.setAttribute('src', `images/hangman${++wrongAnswerCount}.png`);
        incorrect.innerHTML = `${wrongAnswerCount}`;

        this.disabled = 'disabled';
        this.classList.toggle('used-letter');

        if(wrongAnswerCount === 6){
            endGame('Lost');
        } 
    } 
}

function letterAnimation(letterPositionArray, letter){

    letterPositionArray.forEach(function(index){

        magicWordArray[index] = letter;

        $childLabel = $('#display-word').children('label').eq(`${index}`);
        $childLabel.css({'opacity':'0'});
        $childLabel.text(`${letter}`);
        $childLabel.animate({opacity:'1'}, 1500, 'linear');
    });
}

function endGame(text){
    btnStart.style.display = 'block';
    
    if(text != 'Won'){  
        popUpTitle.innerHTML = `You ${text} - Try again.`;
        popUpImage.firstElementChild.setAttribute('src', `images/sad.jpg`);
    }
    else{
        popUpTitle.innerHTML = `Congratulation - You ${text}!`; 
        popUpImage.firstElementChild.setAttribute('src', `images/happy.jpg`);
    }

    welcomePopUp.style.display      = 'block';
    popUpFrame.style.display        = 'block';
    popUpAnimationHandler = requestAnimationFrame(fadePopUp);
}

btnClose.addEventListener('click', function(){
    welcomePopUp.style.display      = 'none';
    btnGameRule.style.display       = 'none';
    hidePopUpFrame();
});

btnGameRule.addEventListener('click', function(){
    welcomePopUp.style.display      = 'none';
    popUpFrame.style.opacity = 0;
    gameRulePopUp.style.display = 'block';
    popUpAnimationHandler = requestAnimationFrame(fadePopUp);
});

btnOk.addEventListener('click', function(){
    gameRulePopUp.style.display      = 'none';
    btnGameRule.style.display        = 'none';
    hidePopUpFrame();
});

function hidePopUpFrame(){
    popUpFrame.style.display = 'none';
    popUpFrame.style.opacity = 0;
}
