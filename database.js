import mysql from 'mysql'

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abcdefgh",
    database: "blog",
    post: 3306
})

