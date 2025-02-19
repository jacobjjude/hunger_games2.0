let game_contestants = [];
let game_events = [];
let day_events = [];
let game_deaths = [];
let day_counter = 1;

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
            game_contestants.forEach((x) => {
                x.isAlive = true;
            })
        })

    fetch('../events/events.json')
        .then(response => response.json())
        .then(data => {
            game_events = [...data];
        })
    addDayCounter();
}

function endGame() {
    game_contestants = [];
    game_events = [];
    day_events = [];
    game_deaths = [];
    day_counter = 1;

    let log = document.getElementById('events');
    if (log) {
        log.innerHTML = '';
    }
    let deaths = document.getElementById('dead');
    if (dead) {
        deaths.innerHTML = '';
    }
}

function roll(int) {
    return Math.floor(Math.random() * int);
}

function gameEvent() {
    let eligible_contestants = chooseContestant(game_contestants);

    if (checkGameEnd(eligible_contestants)) {
        return;
    }

    let contestant = eligible_contestants[roll(eligible_contestants.length)];
    let event = game_events[roll(game_events.length)];

    processEvent(contestant, event);
}

function chooseContestant(contestants) {
    let eligible = contestants.filter(x => 
        x.isAlive === true &&
        !day_events.some(event => event.name === x.name) &&
        !game_deaths.some(y => x.name === y.name)
    );
    return eligible;
}

function logEvent(selected_contestant, selected_event) {
    let obj = {
        name: selected_contestant.name,
        event: selected_event.description,
        fatal: selected_event.isFatal,
        day: day_counter
    }
    day_events.push(obj);
}

function addDayCounter() {
    let div = document.getElementById('events');
    let newDay = document.createElement('h3');
    newDay.textContent = `Day ${day_counter}`;
    div.append(newDay);
}

function declareWinner() {
    let winner = game_contestants.find(x => x.isAlive);
    let div = document.getElementById('events');
    let winnerElement = document.createElement('h1');
    winnerElement.textContent = `${winner.name} has won the Hunger Games!`

    div.append(winnerElement);
}

function checkGameEnd(eligible) {
    if (game_contestants.filter(c => c.isAlive).length === 1) {
        console.log('declaring winner triggered')
        honorTheDead();
        declareWinner();
        return true;
    } else if (eligible.length === 0) {
        honorTheDead();
        day_events = [];
        day_counter++;
        addDayCounter();
        return true;
    }

    return false;
}

function processEvent(c, e) {
    let log = document.getElementById('events');
    let newEvent = document.createElement('p');

    if (e.isFatal) {
        newEvent.textContent = `${c.name} ${e.description} (fatal)`;
        dead = {
            name: c.name,
            event: e.description,
            day: day_counter
        }
        c.isAlive = false;
        game_deaths.push(dead);
    } else {
        newEvent.textContent = `${c.name} ${e.description}`;
    }
    log.appendChild(newEvent);
    logEvent(c,e);
}

function honorTheDead() {
    let dead = [...game_deaths].filter(x => x.day === day_counter);
    let deadDiv = document.getElementById('dead');
    dead.forEach(x => {
        let element = document.createElement('p');
        element.textContent = `${x.name} - Day ${x.day}`;
        deadDiv.append(element);
    })
}