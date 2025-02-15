let contestants = [];

document.addEventListener("DOMContentLoaded", function () {
    let button = document.querySelector('.button');

    button.addEventListener('click', function () {
        let contestant = document.getElementById('contestant');
        let name = contestant.value.trim();

        if (name === "") {
            alert("Enter a name, dipshit");
            return;
        }

        fetch('http://localhost:3000/contestants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ name })
        })
            .then(response => response.json())
            .then(data => {
                contestant.value = "";
                updateContestants(data.contestants)
            })
            .catch(error => console.error('Error: ', error))

    })

    loadContestants();
})

function loadContestants() {
    fetch('http://localhost:3000/contestants')
        .then(response => response.json())
        .then(data => updateContestants(data))
        .catch(error => console.error('Error: ', error))
}

function updateContestants(contestants) {
    var table = document.querySelector('#contestant-table tbody');
    table.innerHTML = "";

    contestants.forEach((contestant, index) => {
        var newRow = document.createElement('tr');
        var indexCell = document.createElement('td');
        var nameCell = document.createElement('td');

        indexCell.textContent = index + 1;
        nameCell.textContent = contestant.name;

        newRow.appendChild(indexCell);
        newRow.appendChild(nameCell);
        table.appendChild(newRow);
    });
}