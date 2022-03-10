var express = require('express');
var app = express();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'databaseinstancenode.cjmgcprn4hck.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '1234567890',
    connectionLimit: 5
});


app.get('/saludo', function(req, res) {
    pool.getConnection()
        .then(conn => {

            conn.query("SELECT * FROM trabajofinaldb.usuarios")
                .then((rows) => {
                    console.log(rows);
                    return res.status(200).json({ saludo: rows })
                })
                .then((res) => {
                    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                    conn.end();
                })
                .catch(err => {
                    //handle error
                    console.log(err);
                    conn.end();
                })

        }).catch(err => {
            //not connected
        });

});



app.listen(3000, () => { console.log('listening on port 3000'); });