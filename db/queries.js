const mysql = require('mysql');
const fs = require('fs');

const config = {
    host: 'localhost',
    user: 'bpc',
    password: 'senha',
    database: 'URL_IDENTIFIER',
    // port: 3000
    // database: process.env.BOT_DB
}

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}


db = new Database(config);

// connection = mysql.createConnection(config); 

// const connect = () => { 
//     connection.connect((err) => {             
//         if (err) {                                    
//             console.log('error when connecting to db:', err);
//             setTimeout(connect, 2000); 
//         } 
//         console.log('DB connected');
//     });
// 
//     connection.on('error', (err) => { 
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
//             console.log('reconnecting DB');
//             connectDB();
//         }
//         else {
//             throw err;
//         }
//     });
// };



// const end = () => {
//     connection.end((err) => {
//         console.log("ending DB connection");
//         if (err) throw err;
//     });
//     console.log('DB disconnected');
// };

function insertNewWebsite(url, status) {
    return db.query(
        "INSERT INTO Request(current_status) VALUES (?)",
        [status]
    ).then( (results) => {
        reqId = results.insertId || results[0].id;
        console.log ("Inserted website: " + url);
        return db.query(
            "INSERT INTO Website(url, evaluation_id, request_id)\
            VALUES (?, ?, ?)",
            [url, null, reqId],
        ) 
    })
}

module.exports = {
    Database,
    // connection,
    // connect,
    // end,
    insertNewWebsite
}
