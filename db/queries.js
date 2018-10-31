const mysql = require('mysql');
const fs = require('fs');
const Database = require('./database');

const config = {
    host: 'localhost',
    user: 'bpc',
    password: 'senha',
    port: 3000
    // database: process.env.BOT_DB
}
// const db  = mysql.createConnection(config);
const connectDB = () => { 
    connection = mysql.createConnection(config); 

    connection.connect((err) => {             
        if (err) {                                    
            console.log('error when connecting to db:', err);
            setTimeout(connectDB, 2000); 
        } 
    });
    console.log('DB connected');

    connection.on('error', (err) => { 
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            console.log('reconnecting DB');
            connectDB();
        }
        else {
            throw err;
        }
    });
};

module.exports = {
    connectDB,

    insertNewWebsite: (url, status) => {

        db.query(
            'INSERT INTO Request (current_status) VALUES (status)',
            [status],
            (err, result) => {
                if (err) throw err;
                console.log('Added Request');
            }
        )
    }
}
