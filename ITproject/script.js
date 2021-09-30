"use strict";

let startBG = document.querySelector('.startBG');
let clicker = document.querySelector('.clicker');
let soundOn = document.querySelector('.volume');
let soundOff = document.querySelector('.mute');
let imgSettings = document.querySelector('.settings');
let imgOptions = document.querySelector('.imgOptions');
let gameBox = document.querySelector('.gameBox');
let mainText = document.querySelector('.mainText');
let sayStart = document.querySelector('.sayStart');
let RadioFM = document.querySelector('.imgRadio');
let clickRecords = document.querySelector('.imgRecord');
let stupidImg = document.querySelector('.imgOptions img');
let userName = document.querySelector('.input1')
let records = document.querySelector('.records');
let timerTime = document.querySelector('.timer');
let curResult = document.querySelector('.curResult');
let clickVoice = document.querySelector('.clickVoice');
let gameOver = document.querySelector('.gameOver');
let innerResult = document.querySelector('.innerResult');
let endBtn = document.querySelector('.endBtn');
let treck1 = document.querySelector('.treck1');
let treck2 = document.querySelector('.treck2');
let treck3 = document.querySelector('.treck3');
let select = document.querySelector('.select');
let gameInfo = document.querySelector('.gameInfo');


                                                      //глобальные переменные
let roundArr = {x: null, y: null, r:null};
let timer; 
let nt = 60;
let score=0;
let intervalID;





let canvas = document.querySelector('canvas');  
let ctx = canvas.getContext('2d');
let sX = 0; 
let sY = 0;


                                                        //создание круга в и сохранение его координат.
function showRound(){                                                   
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    let r = 10;
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height);
    ctx.fillStyle = 'lightgray';
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    roundArr.x = x;
    roundArr.y = y;
    roundArr.r = r;

}

                                                 //создание меньшего круга как обозначение координат клика и подсчёт очков
function searchClick(event){
    ctx.beginPath();
    let rad = 4;
    let sX = event.offsetX;
    let sY = event.offsetY;
    ctx.fillStyle = 'red';
    ctx.arc(sX, sY, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    let distanceFromCenter = Math.sqrt(Math.pow(roundArr.x - sX, 2) + Math.pow(roundArr.y - sY, 2));
        if (distanceFromCenter <= roundArr.r){
            score+=20;
            showUserResult();
        }else if(distanceFromCenter > roundArr.r){
            score-=10;
            showUserResult();
        }
    
    if(select.options.selectedIndex == 1){
        firstVoice();
    }else if(select.options.selectedIndex == 2){
        secondVoice();
    }else if(select.options.selectedIndex == 3){
        thirdVoice();
    }
}

                                                                //проверка формы и запуск canvas
function creatGame(){
    if(!userName.value){
        userName.focus();
    }else{
        canvas.style.zIndex = '2';
        canvas.style.background = 'black';
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.style.boxShadow = '0 0 10px rgb(255, 255, 255)';
        iStart();
        showTimer();
        showUserResult();
    }

}
sayStart.addEventListener('click', creatGame); 

                                                                            //интервал
function iStart(){
    intervalID = setInterval(showRound, 980);
}

function iStop(){
    clearInterval(intervalID);
}

                                                                        //отображение/скрывание радио
RadioFM.addEventListener('click', function(){                 
    let RadioPlay = document.querySelector('.audioRadio');
    RadioPlay.style.display === 'none' ? RadioPlay.style.display = 'initial' : RadioPlay.style.display = 'none';
});

                                                                        //чуток анимации экрана приветствия
clicker.addEventListener('click', function(){   
    startBG.style.animationName = 'start_bg';
    clicker.style.animationName = 'none';
    gameInfo.style.animationName = 'show_info';
});

                                                                        //работа с иконками звука вкл/выкл
soundOn.addEventListener('click', function(){                   
    document.querySelectorAll('audio').forEach(function(elem){
        elem.muted = true;
        elem.pause();
    });
    soundOn.style.display = 'none';
    soundOff.style.display = 'block';
});

soundOff.addEventListener('click', function(){
    document.querySelectorAll('audio').forEach(function(elem){
        elem.muted = false;
        if(!RadioFM) elem.play();
    });
    soundOff.style.display = 'none';
    soundOn.style.display = 'block';
});

                                                                        //отображение панели опций  
imgOptions.addEventListener('click', function(){                   
    imgSettings.style.display = 'block';
    imgSettings.style.animationName = 'settings_up';
});

                                                                        //чуток js для текста
imgSettings.addEventListener('mouseleave', function(){                    
    imgSettings.style.display = 'none'                               
    imgSettings.style.animationFillMode = 'forwards';
});
    
                                                                        //создание таблицы
function  showRecords(){
    records.style.display === 'none' ? records.style.display = 'block' : records.style.display = 'none';
    if(canvas.style.display === 'block'){
        records.style.left = '-260px';
    }
};
clickRecords.addEventListener('click', showRecords);


                                                                           //добавление в localstorage
function localRecords(){
    let userDataInfo = {
        pName: userName.value,
        pScore: score
    };
    let nextUserInfo = JSON.parse(localStorage.getItem('users'));
    if(nextUserInfo == null) nextUserInfo = [];
    nextUserInfo.push(userDataInfo);
    localStorage.setItem("users", JSON.stringify(nextUserInfo)); 
    myAttempt2();  
}

                                                                            //обнуление отыгравшего и его результата
function refreshAll(){
    nt = 60;
    userName.value = "";
    score = 0;
}

                                                                             // таймер и его работа по окончании времени
function showTimer(){
timerTime.innerHTML = `<p><b>${nt}</b></p>`;
nt--;
  if(nt < 0){
    iStop();
    clearTimeout(timer);
    localRecords();
    theGameEnd();
    refreshAll();
  }else{
    timer = setTimeout(showTimer, 100);
  }
}

                                                                                //информация об текущем игроке
function showUserResult(){
    curResult.innerHTML = `<p><b>${userName.value}</b></p><p><b>${score}</b></p>`;
}

                                                                                 //окно конца игры
function theGameEnd(){
    gameOver.style.display = 'flex';
    gameOver.style.zIndex = '2';
    canvas.style.zIndex = '0';
    canvas.style.display = 'none';
    gameOver.style.animationName = 'show_me_end';
    stupidImg.style.top = '5px';
    stupidImg.style.right = '10px';
    innerResult.innerHTML = `<b>${userName.value}</b><b>${score}</b>`;
    myAttempt1();
}


endBtn.addEventListener('click', function(){
    gameOver.style.display = 'none';
    gameOver.style.zIndex = '0';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while (records.firstChild) {
        records.removeChild(records.firstChild);
    }
    refreshAll();
    takeARecords();
});


                                                                    //звуки клика
function firstVoice(){
    let audio1 = new Audio();
    audio1.src = 'audio/treck1.mp3';
    audio1.volume = 0.2;
    audio1.autoplay = true;
};

function secondVoice(){
    let audio2 = new Audio();
    audio2.src = 'audio/treck2.mp3';
    audio2.volume = 0.2;
    audio2.autoplay = true;
};

function thirdVoice(){
    let audio3 = new Audio();
    audio3.src = 'audio/treck3.mp3';
    audio3.volume = 0.2;
    audio3.autoplay = true;
};


function takeARecords(){
    let nextParse = JSON.parse(localStorage.getItem('users'));
    nextParse.sort(function(a,b) {return a.pScore == b.pScore ? 0 : a.pScore < b.pScore ? 1 : -1;});
    let bestScore = document.querySelector('.BestIdScore');
    bestScore.innerHTML = `${nextParse[0].pName}  ${nextParse[0].pScore}`;
    for(let i = 0; i < nextParse.length; i++){
        let tr = document.createElement('tr');
        records.appendChild(tr);
        tr.innerHTML = `<td class"place">${i}</td><td>${nextParse[i].pName}</td><td>${nextParse[i].pScore}</td>`;
        if(nextParse.length > 9) nextParse.splice(10, 1);
    }
}


function myAttempt1(){
    let url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
    let formData = new FormData();
    formData.append('f', 'READ');
    formData.append('n', userName.value);

    fetch(url, {
        method: 'POST',
        body: formData,
    }).then((res) => res.json()).then((data) => {
        console.log(JSON.parse(data.result));
    });

}

function myAttempt2(){
    let userDataInfo = {
        pName: userName.value,
        pScore: score
    };
    let url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
    let formData = new FormData();
    formData.append('f', 'INSERT');
    formData.append('n', userName.value);
    formData.append('v', JSON.stringify(userDataInfo));

    fetch(url, {
        method: 'POST',
        body: formData,
    }).then((res) => res.json()).then((data) => console.log(data));
}