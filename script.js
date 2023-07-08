let blackjackGame={
    'you':{'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnOver':false,

}
const YOU=blackjackGame['you']
const DEALER=blackjackGame['dealer']
const hitSound=new Audio('static/sound/swish.m4a');
const winSound=new Audio('static/sound/cash.mp3');
const lossSound=new Audio('static/sound/aww.mp3');


document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogic);
document.querySelector('#blackjack-dealer-button').addEventListener('click',blackjackDeal);


function randomCard(){
    let randomIndex=Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];

}
function blackjackHit(){
if(blackjackGame['isStand']===false){
    let card=randomCard();
showCard(card,YOU);
updateScore(card,YOU);
showScore(YOU);
}

}
function showCard(card,activePlayer){
    if(activePlayer['score']<=21){
    let cardImage=  document.createElement('img');
    cardImage.src=`static/image/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
  hitSound.play();
    }
}

function updateScore(card,activePlayer){
    if(card==='A'){
    //if adding A gets less than 11 then add 11 else add 1
    if(activePlayer['score']+blackjackGame['cardsMap'][card][1]<=21){
        activePlayer['score']+= blackjackGame['cardsMap'][card][1];
    }else{
        activePlayer['score']+= blackjackGame['cardsMap'][card][0];
    }
    } else{

activePlayer['score']+=blackjackGame['cardsMap'][card];
    }

}
function showScore(activePlayer){
    if(activePlayer['score']>21){
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';


    }else{
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}
function blackjackDeal(){
    if(blackjackGame['turnOver']===true){
        blackjackGame['isStand']=false;
     let yourImages=document.querySelector('#your-box').querySelectorAll('img');
     let dealerImages=document.querySelector('#dealer-box').querySelectorAll('img');
 
     for(i=0;i<yourImages.length;i++){
         yourImages[i].remove();
     }
     for(i=0;i<dealerImages.length;i++){
         dealerImages[i].remove();}
         YOU['score']=0;
         DEALER['score']=0;
         document.querySelector('#your-blackjack-result').textContent=0;
         document.querySelector('#dealer-blackjack-result').textContent=0;
         document.querySelector('#your-blackjack-result').style.color='#fff';
         document.querySelector('#dealer-blackjack-result').style.color='#fff';
         document.querySelector('#blackjack-result').textContent="Lets Play!";
         document.querySelector('#blackjack-result').style.color='black';
 blackjackGame['turnOver']=false;
     }
 }
function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}
async function dealerLogic(){
    blackjackGame['isStand']=true;
    while(DEALER['score']<16 && blackjackGame['isStand']===true){
    let card=randomCard();
    showCard(card,DEALER);
    updateScore(card,DEALER);
    showScore(DEALER);
    await sleep(1000);
    }
        blackjackGame['turnOver']=true;
        let winner=computeWinner();
        showResult(winner);
    
    
}
function computeWinner()
{
    let winner;
    if(YOU['score']<=21){
        if(YOU['score']> DEALER['score']  || (DEALER['score']>21 )){
            blackjackGame['wins']++;
            winner=YOU;
        }else if(YOU['score']<DEALER['score']){
            blackjackGame['losses']++;
             winner=DEALER;
        }else if(YOU['score']===DEALER['score']){
            blackjackGame['draws']++;
            
        }
    }else if(YOU['score']>21&& DEALER['score']<=21){
        blackjackGame['losses']++;
        
        winner=DEALER;

    }else if(YOU['score']>21 && DEALER['score']>21){
        blackjackGame['draws']++;
        
    }
    console.log('Winner is',winner);
    return winner;
}

function showResult(winner){
    let message,messageColor;
    if(blackjackGame['turnOver']===true){
    if (winner===YOU){
        document.querySelector('#wins').textContent=blackjackGame['wins'];
        message='You Won!!!';
        messageColor='green';
        winSound.play();
    }else if(winner===DEALER){
        document.querySelector('#losses').textContent=blackjackGame['losses'];
         message='You Lost!!!';
        messageColor='red';
        lossSound.play();
    }else{
        document.querySelector('#draws').textContent=blackjackGame['draws'];
        message='You drew!!';
        messageColor='black';
    }
    document.querySelector('#blackjack-result').textContent=message;
    document.querySelector('#blackjack-result').style.color=messageColor;
    }
}