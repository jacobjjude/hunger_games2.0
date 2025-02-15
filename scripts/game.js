let game_contestants = [];
let game_events = [];

document.addEventListener("DOMContentLoaded", function () {
    let gameButton = document.querySelector('.game-button');
    let endButton = document.querySelector('.game-end-button');
    let eventButton = document.querySelector('.new-event');

    gameButton.addEventListener('click', function () {
        grabGameEvents();
    })

    endButton.addEventListener('click', function () {
        endGame();
    })

    eventButton.addEventListener('click', function () {
        gameEvent();
    })
})

function grabGameEvents() {
    fetch('http://localhost:3000/contestants')
        .then(response => response.json())
        .then(data => {
            game_contestants = [...data];
            console.log(game_contestants);

        })

    fetch('../events/events.json')
        .then(response => response.json())
        .then(data => {
            game_events = [...data];
            console.log(game_events);
        })
}

function endGame() {
    game_contestants = [];
    game_events = [];

    let log = document.getElementById('events');
    if (log) {
        log.innerHTML = '';
    }
}

function roll(int) {
    return Math.floor(Math.random() * int);
}

function gameEvent() {
    let contestant = game_contestants[roll(game_contestants.length)];
    let event = game_events[roll(game_events.length)];
    let log = document.getElementById('events');
    let newEvent = document.createElement('p');
    newEvent.textContent = `${contestant.name} ${event.description}`;
    log.appendChild(newEvent);
}