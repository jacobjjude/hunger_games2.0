const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const contestantFile = path.resolve(__dirname, '../events/contestants.json');

app.get('/contestants', (req, res) => {
    fs.readFile(contestantFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `${err.message}` });
        }

        res.json(JSON.parse(data));
    })
});

app.post('/contestants', (req, res) => {
    var newContestant = req.body.name;

    if (!newContestant) return res.status(400).json({ error: 'Name is required' });

    fs.readFile(contestantFile, 'utf-8', (err, data) => {
        var contestants = data ? JSON.parse(data) : [];

        contestants.push({ name: newContestant});

        fs.writeFile(contestantFile, JSON.stringify(contestants, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing file' });
            }
            res.json({ message: 'Contestant added', contestants });
        })
    })
})

app.get('/day_events', (req, res) => {
    let filePath = path.join(__dirname, '../events/day_events.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `${err.message}` });
        }

        res.json(JSON.parse(data));
    })
});

app.post('/day_events', (req, res) => {
    let filePath = path.join(__dirname, '../events/day_events.json');

    var newDayEvents = req.body.events?.flat();

    if (!Array.isArray(newDayEvents) || newDayEvents.length === 0) {
        return res.status(400).json({ error: 'Invalid event data' });
    }

    let existingData = [];

    if (fs.existsSync(filePath)) {
        try {
            let fileData = fs.readFileSync(filePath, 'utf8');
            existingData = JSON.parse(fileData);
            if (!Array.isArray(existingData)) existingData = [];
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return res.status(500).json({ error: 'Error reading JSON data' });
        }
    }

    let counter = existingData.length + 1;

    existingData.push({
        game: counter,
        events: newDayEvents
    });

    try {
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
        return res.status(200).json({ message: 'Events added successfully', gameId: counter });
    } catch (error) {
        console.error('Write Error:', error);
        return res.status(500).json({ error: 'Error writing to JSON file' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));