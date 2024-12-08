const pool = require('../../db');
const queries = require('./queries');
const fs = require('fs');
const path = require('path');

const getData = (req, res) => {
    pool.query(queries.getData, (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).send("Error fetching data");
        }

        const data = results.rows;

        // Define the path to the JSON file
        const filePath = path.join(__dirname, '../../app/db-tester.json');

        // Write data to the JSON file
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error("Error writing to JSON file:", err);
                return res.status(500).send("Error writing to file");
            }
            console.log("JSON file updated successfully");

            // Respond to the client
            res.status(200).json({ message: "JSON file updated", data });
        });
    });
};

module.exports = {
    getData,
};
