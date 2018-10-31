const mysql = require( 'mysql' );

class Database {
    constructor () {
        const config = {
            host: process.env.BOT_DB_HOST,
            user: process.env.BOT_DB_USER,
            password: process.env.BOT_DB_PASSWORD,
            database: process.env.BOT_DB
        }
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, ( err, rows ) => {
                if (err)
                    return reject(err);
                resolve(rows);
            } );
        } );
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            } );
        } );
    }
}

module.exports = Database;
