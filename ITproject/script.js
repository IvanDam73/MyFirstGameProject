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
let luk = {pName: userName.value, pScore: score};
  if(nt < 0){
    iStop();
    clearTimeout(timer);
    theGameEnd();
    saveResult(luk);
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
}


endBtn.addEventListener('click', function(){
    gameOver.style.display = 'none';
    gameOver.style.zIndex = '0';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while (records.firstChild) {
        records.removeChild(records.firstChild);
    }
    getAllResult();
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


const baseName = 'Dyatlov_Game12345';
let url = 'https://fe.it-academy.by/AjaxStringStorage2.php';

async function initDB(){
    let allUserData = await getAllResult();
    if(Array.isArray(allUserData)) return;

    let formData = new FormData();
    formData.append('f', 'INSERT');
    formData.append('n', baseName);
    formData.append('v', JSON.stringify([]));
    
    fetch(url, {
        method: 'POST',
        body: formData,
    }).then((res) => res.json()).then((data) => {
        console.log(data.result);
    });
}



function getAllResult(){
    let formData = new FormData();
    formData.append('f', 'READ');
    formData.append('n', baseName);

    return fetch(url, {
        method: 'POST',
        body: formData,
    }).then((res) => res.json()).then((data) => {
        let lak = JSON.parse(data.result);
        lak.sort(function(a,b) {return a.pScore == b.pScore ? 0 : a.pScore < b.pScore ? 1 : -1;});
        let bestScore = document.querySelector('.BestIdScore');
        bestScore.innerHTML = `${lak[0].pName}  ${lak[0].pScore}`;
        for(let i = 0; i < lak.length; i++){
            let tr = document.createElement('tr');
            records.appendChild(tr);
            tr.innerHTML = `<td class"place">${i}</td><td>${lak[i].pName}</td><td>${lak[i].pScore}</td>`;
            if(lak.length > 9) lak.splice(10, 1);
        }
    });
}


async function saveResult(result) {
    let idPassword = Math.random();

    let formData = new FormData();
    formData.append('f', 'LOCKGET');
    formData.append('n', baseName);
    formData.append('p', idPassword);

    fetch(url, {
        method: 'POST',
        body: formData,
    }).then((res) => res.json()).then((data) => {
        let kek= JSON.parse(data.result);
        console.log(kek);
        if(!Array.isArray(kek)){
            kek = [];
            kek.push(result);
        }

        if(Array.isArray(kek)) kek.push(result);

        let formDataUpdate = new FormData();
        formDataUpdate.append('f', 'UPDATE');
        formDataUpdate.append('n', baseName);
        formDataUpdate.append('p', idPassword);
        formDataUpdate.append('v', JSON.stringify(kek));


        fetch(url, {
            method: 'POST',
            body: formDataUpdate,
        }).then((res) => res.json()).then((data) => {
            console.log(data);
        });
    });
}


window.onload = initDB();



