import mysql from 'mysql'

export const db = mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "abcdefgh",
    database: process.env.DATABASE || "blog",
    post: process.env.PORT || 3306
})

