'use server'

const Pool = require('pg').Pool;

const pool= new Pool({
    user: "postgres",
    host : "localhost",
    database : "flights",
    password: "laptopdeem",
    port: "4000"
})

module.exports = pool;
