const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const contestantFile = path.join(__dirname, '..', 'events', 'contestants.json');

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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));