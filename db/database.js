const mysql = require( 'mysql' );

class Database {
    constructor() {
        const config = {
            host: 'localhost',
            user: 'bpc',
            password: 'senha',
            database: 'URL_IDENTIFIER',
            // port: 3000
        }
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise( (resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            } );
        } );
    }
}

module.exports = Database;
