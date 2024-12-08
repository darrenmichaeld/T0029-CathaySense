const express = require('express');
const flightRoutes = require('./src/data/routes');


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/api/v1/flightData', flightRoutes);

app.listen(port, () => console.log(`App listening on ${port}`));