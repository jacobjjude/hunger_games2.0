let contestants = [];

document.addEventListener("DOMContentLoaded", function () {
    let button = document.querySelector('.button');

    button.addEventListener('click', function () {
        let contestant = document.getElementById('contestant');

        if (contestant.value.trim() !== "") {
            updateContestants(contestant.value);
            contestant.value = "";
        } else {
            alert("Enter a fuckin name, dipshit")
        }
    })
})

function updateContestants(contestant) {
    contestants.push(contestant);

    var table = document.querySelector('#contestant-table tbody');
    var newRow = document.createElement('tr');
    var newCell = document.createElement('td');
    var indexCell = document.createElement('td');

    indexCell.textContent = contestants.length;
    newCell.textContent = contestant;

    newRow.appendChild(indexCell);
    newRow.appendChild(newCell);
    table.appendChild(newRow);
}