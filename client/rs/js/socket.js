var roomName = location.hash.replace('#', '');
if (roomName === "") {
    roomName = "home";
}

var socket = io.connect();
var min = 0;
var timeleft = 10;

var startTime = 0;
var currentTime = 0;

socket.on('startgame', function () {
    // var interval = setInterval(timeIt, 1000);
    // setup()
    console.log("START");
});
socket.on('youareblack', function () {
    Chess.Board.MyColor = 100;
});

socket.on('roomState', function (roomState, pawnstate) {
    if (typeof localStorage[roomName] !== 'undefined') {
        Chess.Board.SetActive(true);
    }
    Chess.Board.CloseWaiting();
    Chess.Board.CurrentState = roomState;
    Chess.Board.PawnFirstMove = pawnstate;
    Chess.Board.Render();
});
socket.on('yourturn', function (myturn) {
    if (myturn) {
        Chess.Board.StateCode = STATUS_READY;
    } else {
        Chess.Board.StateCode = STATUS_WAITING;
    }
});
socket.on('resetGame', function () {
    // Reset rules to initiate state.
    Chess.Board.PawnFirstMove = [];
    Chess.Board.MovedPieces = [];
});

socket.on('youareplayer', function () {
    localStorage[roomName] = true;
    Chess.Board.SetActive(true);
});

socket.emit('join', roomName);

function Push() {
    socket.emit(socket.emit('roomState', roomName, Chess.Board.CurrentState, Chess.Board.PawnFirstMove));
}

function ResetGame() {
    socket.emit(socket.emit('resetGame', roomName));
}
$(function () {
    socket.emit('getRooms', getRooms);
    setInterval(function () {
        socket.emit('getRooms', getRooms);
    }, 3000);
});

function getRooms(rooms) {
    $('#list_room').html('');
    $.each(rooms, function (k, v) {
        if (k !== "") {
            $('#list_room').append('<p><a href="javascript:;" onclick="window.location=\'#' + k.replace("/", "") + '\';location.reload()">#' + k.replace("/", "") + '</a></p>');
        }
    });
}

function convertSeconds(s) {
    var min = floor(s / 60);
    var sec = s % 60;
    return nf(min, 2) + ':' + nf(sec, 2);
}


var i=1;
function setup() {
    noCanvas();
    startTime = millis();
    min = $("#time_per_match").val()
    timeleft = eval(min)*60;
    var interval1 = setInterval(timeIt1, 1000);
    var interval2 = setInterval(timeIt2, 1000);
    if(i%2 == 1){
        interval2 = setInterval(timeIt2, 1000);
        clearInterval(interval1);
        i=2;
    }
    else {
        interval1 = setInterval(timeIt1, 1000);
        clearInterval(interval2);
        i=2;
    }

    // clearInterval(interval1);
    // clearInterval(interval2);
}
function timeIt1() {
    var timer = $('#white_play_timer');
    timer.html(convertSeconds(timeleft - currentTime));
    currentTime = floor((millis() - startTime) / 1000);
    timer.html(convertSeconds(timeleft - currentTime));
    if (currentTime == timeleft) {
        clearInterval(interval);
        //counter = 0;
    }
}
function timeIt2() {
    var timer = $('#black_play_timer');
    timer.html(convertSeconds(timeleft - currentTime));
    currentTime = floor((millis() - startTime) / 1000);
    timer.html(convertSeconds(timeleft - currentTime));
    if (currentTime == timeleft) {
        clearInterval(interval);
        //counter = 0;
    }
}

