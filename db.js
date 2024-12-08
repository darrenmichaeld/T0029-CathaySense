const Pool = require('pg').Pool;

const pool= new Pool({
    user: "postgres",
    host : "localhost",
    database : "students",
    password: "laptopdeem",
    port: "4000"
})

module.exports = pool;