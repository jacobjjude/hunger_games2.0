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
}

function roll(int) {
    return Math.floor(Math.random() * int);
}

// okay this function is getting too complex. Need to break it up
function gameEvent() {
    let eligible_contestants = chooseContestant(game_contestants);

    console.log(`Day ${day_counter}`);
    console.log(`Total Contestants: ${game_contestants.length}`);
    console.log(`Game Deaths: ${game_deaths.length}`);
    console.log(`Alive Contestants: ${game_contestants.filter(c => c.isAlive).length}`);
    console.log(`Eligible Contestants: ${eligible_contestants.length}`);

    //if there's only one eligible contestant AND all other contestants are dead, end game
    if (game_contestants.filter(c => c.isAlive).length === 1) {
        let winner = game_contestants.filter(x => x.isAlive);
        declareWinner(winner);
        return;
    } else if (eligible_contestants.length === 0) {
        console.log('days events over. Resetting');
        day_events = [];
        day_counter++;
        addDayCounter();
        return;
    }
    let contestant = eligible_contestants[roll(eligible_contestants.length)];
    let event = game_events[roll(game_events.length)];
    logEvent(contestant, event);
    let log = document.getElementById('events');
    let newEvent = document.createElement('p');

    if (event.isFatal) {
        newEvent.textContent = `${contestant.name} ${event.description} (fatal)`;
        contestant.isAlive = false;
        game_deaths.push(contestant.name);
    } else {
        newEvent.textContent = `${contestant.name} ${event.description}`;
    }
    log.appendChild(newEvent);
}

function chooseContestant(contestants) {
    let eligible = contestants.filter(x => 
        x.isAlive === true &&
        !day_events.some(event => event.name === x.name) &&
        !game_deaths.includes(x.name)
    );
    return eligible;
}

function logEvent(selected_contestant, selected_event) {
    let obj = {
        name: selected_contestant.name,
        event: selected_event.description,
        fatal: selected_event.isFatal
    }
    day_events.push(obj);
}

function addDayCounter() {
    let div = document.getElementById('events');
    let newDay = document.createElement('h3');
    newDay.textContent = `Day ${day_counter}`;
    div.append(newDay);
}

function declareWinner(winner) {
    let div = document.getElementById('events');
    let winnerElement = document.createElement('h1');
    winnerElement.textContent = `${winner.name} has won the Hunger Games!`

    div.append(winnerElement);
}