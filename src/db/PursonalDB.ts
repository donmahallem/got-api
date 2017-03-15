import * as mysql from "mysql";


export class PursonalDB {
    private connection: mysql.IConnection;

    public connect() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'me',
            password: 'secret',
            database: 'my_db'
        });
        this.connection.connect();
    }

    public disconnect() {
        this.connection.end();
    }

    private query(query: string): mysql.IQueryFunction {
        return this.connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
        });
    }
}