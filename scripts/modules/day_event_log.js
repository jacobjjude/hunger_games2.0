export function dayEventsLog(events) {
    fetch('http://localhost:3000/day_events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ events })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(`Error: ${data.error}`);
            } else {
                console.log('Events successfully logged');
            }
        })
} 