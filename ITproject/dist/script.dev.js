"use strict";

var startBG = document.querySelector('.startBG');
var clicker = document.querySelector('.clicker');
var soundOn = document.querySelector('.volume');
var soundOff = document.querySelector('.mute');
var imgSettings = document.querySelector('.settings');
var imgOptions = document.querySelector('.imgOptions');
var gameBox = document.querySelector('.gameBox');
var mainText = document.querySelector('.mainText');
var sayStart = document.querySelector('.sayStart');
var RadioFM = document.querySelector('.imgRadio');
var clickRecords = document.querySelector('.imgRecord');
var stupidImg = document.querySelector('.imgOptions img');
var userName = document.querySelector('.input1');
var records = document.querySelector('.records');
var timerTime = document.querySelector('.timer');
var curResult = document.querySelector('.curResult');
var clickVoice = document.querySelector('.clickVoice');
var gameOver = document.querySelector('.gameOver');
var innerResult = document.querySelector('.innerResult');
var endBtn = document.querySelector('.endBtn');
var treck1 = document.querySelector('.treck1');
var treck2 = document.querySelector('.treck2');
var treck3 = document.querySelector('.treck3');
var select = document.querySelector('.select');
var gameInfo = document.querySelector('.gameInfo'); //глобальные переменные

var roundArr = {
  x: null,
  y: null,
  r: null
};
var timer;
var nt = 60;
var score = 0;
var intervalID; // let requestURL = 'https://fe.it-academy.by/AjaxStringStorage2.php';

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var sX = 0;
var sY = 0; //создание круга в и сохранение его координат.

function showRound() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  var r = 10;
  var x = Math.floor(Math.random() * canvas.width);
  var y = Math.floor(Math.random() * canvas.height);
  ctx.fillStyle = 'lightgray';
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  roundArr.x = x;
  roundArr.y = y;
  roundArr.r = r;
} //создание меньшего круга как обозначение координат клика и подсчёт очков


function searchClick(event) {
  ctx.beginPath();
  var rad = 4;
  var sX = event.offsetX;
  var sY = event.offsetY;
  ctx.fillStyle = 'red';
  ctx.arc(sX, sY, rad, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  var distanceFromCenter = Math.sqrt(Math.pow(roundArr.x - sX, 2) + Math.pow(roundArr.y - sY, 2));

  if (distanceFromCenter <= roundArr.r) {
    score += 20;
    showUserResult();
  } else if (distanceFromCenter > roundArr.r) {
    score -= 10;
    showUserResult();
  }

  if (select.options.selectedIndex == 1) {
    firstVoice();
  } else if (select.options.selectedIndex == 2) {
    secondVoice();
  } else if (select.options.selectedIndex == 3) {
    thirdVoice();
  }
} //проверка формы и запуск canvas


function creatGame() {
  if (!userName.value) {
    userName.focus();
  } else {
    canvas.style.zIndex = '2';
    canvas.style.background = 'black';
    canvas.style.display = 'block';
    canvas.style.width = '540px';
    canvas.style.height = '540px';
    canvas.style.boxShadow = '0 0 10px rgb(255, 255, 255)';
    stupidImg.style.top = '-34px';
    stupidImg.style.right = '-19px';
    iStart();
    showTimer();
    showUserResult();
  }
}

sayStart.addEventListener('click', creatGame); //интервал

function iStart() {
  intervalID = setInterval(showRound, 900);
}

function iStop() {
  clearInterval(intervalID);
} //отображение/скрывание радио


RadioFM.addEventListener('click', function () {
  var RadioPlay = document.querySelector('.audioRadio');
  RadioPlay.style.display === 'none' ? RadioPlay.style.display = 'initial' : RadioPlay.style.display = 'none';
}); //чуток анимации экрана приветствия

clicker.addEventListener('click', function () {
  startBG.style.animationName = 'start_bg';
  clicker.style.animationName = 'none';
  gameInfo.style.animationName = 'show_info';
}); //работа с иконками звука вкл/выкл

soundOn.addEventListener('click', function () {
  document.querySelectorAll('audio').forEach(function (elem) {
    elem.muted = true;
    elem.pause();
  });
  soundOn.style.display = 'none';
  soundOff.style.display = 'block';
});
soundOff.addEventListener('click', function () {
  document.querySelectorAll('audio').forEach(function (elem) {
    elem.muted = false;
    if (!RadioFM) elem.play();
  });
  soundOff.style.display = 'none';
  soundOn.style.display = 'block';
}); //отображение панели опций  

imgOptions.addEventListener('click', function () {
  imgSettings.style.display = 'block';
  imgSettings.style.animationName = 'settings_up';
}); //чуток js для текста

imgSettings.addEventListener('mouseleave', function () {
  imgSettings.style.display = 'none';
  imgSettings.style.animationFillMode = 'forwards';
}); //создание таблицы

function showRecords() {
  records.style.display === 'none' ? records.style.display = 'block' : records.style.display = 'none';

  if (canvas.style.display === 'block') {
    records.style.left = '-260px';
  }
}

;
clickRecords.addEventListener('click', showRecords); //добавление в localstorage

function localRecords() {
  var userDataInfo = {
    pName: userName.value,
    pScore: score
  };
  var nextUserInfo = JSON.parse(localStorage.getItem('users'));
  if (nextUserInfo == null) nextUserInfo = [];
  nextUserInfo.push(userDataInfo);
  localStorage.setItem("users", JSON.stringify(nextUserInfo));
} //обнуление отыгравшего и его результата


function refreshAll() {
  nt = 60;
  userName.value = "";
  score = 0;
} // таймер и его работа по окончании времени


function showTimer() {
  timerTime.innerHTML = "<p><b>".concat(nt, "</b></p>");
  nt--;

  if (nt < 0) {
    iStop();
    clearTimeout(timer);
    localRecords();
    theGameEnd();
    refreshAll();
  } else {
    timer = setTimeout(showTimer, 200);
  }
} //информация об текущем игроке


function showUserResult() {
  curResult.innerHTML = "<p><b>".concat(userName.value, "</b></p><p><b>").concat(score, "</b></p>");
} //окно конца игры


function theGameEnd() {
  gameOver.style.display = 'flex';
  gameOver.style.zIndex = '2';
  canvas.style.zIndex = '0';
  canvas.style.display = 'none';
  gameOver.style.animationName = 'show_me_end';
  stupidImg.style.top = '5px';
  stupidImg.style.right = '10px';
  innerResult.innerHTML = "<b>".concat(userName.value, "</b><b>").concat(score, "</b>");
}

endBtn.addEventListener('click', function () {
  gameOver.style.display = 'none';
  gameOver.style.zIndex = '0';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  while (records.firstChild) {
    records.removeChild(records.firstChild);
  }

  refreshAll();
  takeARecords();
}); //звуки клика

function firstVoice() {
  var audio1 = new Audio();
  audio1.src = 'audio/treck1.mp3';
  audio1.volume = 0.2;
  audio1.autoplay = true;
}

;

function secondVoice() {
  var audio2 = new Audio();
  audio2.src = 'audio/treck2.mp3';
  audio2.volume = 0.2;
  audio2.autoplay = true;
}

;

function thirdVoice() {
  var audio3 = new Audio();
  audio3.src = 'audio/treck3.mp3';
  audio3.volume = 0.2;
  audio3.autoplay = true;
}

;

function takeARecords() {
  var nextParse = JSON.parse(localStorage.getItem('users'));
  nextParse.sort(function (a, b) {
    return a.pScore == b.pScore ? 0 : a.pScore < b.pScore ? 1 : -1;
  });
  var bestScore = document.querySelector('.BestIdScore');
  bestScore.innerHTML = "".concat(nextParse[0].pName, "  ").concat(nextParse[0].pScore);

  for (var i = 0; i < nextParse.length; i++) {
    var tr = document.createElement('tr');
    records.appendChild(tr);
    tr.innerHTML = "<td class\"place\">".concat(i, "</td><td>").concat(nextParse[i].pName, "</td><td>").concat(nextParse[i].pScore, "</td>");
    if (nextParse.length > 9) nextParse.splice(10, 1);
  }
}