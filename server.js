var express = require('express');
var app = express();
var port = { dev: 3100, prod: 3000 }


const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'databaseinstancenode.cjmgcprn4hck.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '1234567890',
    connectionLimit: 5
});

app.get('/saludo/:key1/:key2', function(req, res) {
    const { valor1, valor2 } = req.query //con query se recibe datos por parametro de get
    res.send('<h1>hola ' + valor1 + ' - ' + valor2 + '</h1>')
})

app.get('/getUsers', function(req, res) {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * FROM trabajofinaldb.usuarios")
                .then((rows) => {
                    console.log(rows);
                    return res.status(200).json(rows)
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

app.get('/getUser/:email?', function(req, res) {
    console.log("==========>1", req.query.email)
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * FROM trabajofinaldb.usuarios where email = ?", [req.query.email])
                .then((rows) => {
                    console.log(rows);
                    return res.status(200).json(rows)
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

app.get('/setUser/:nombre?/:email?', function(req, res) {
    // const { nombre, email } = req.body
    pool.getConnection()
        .then(conn => {
            conn.query(`
            INSERT INTO 
            trabajofinaldb.usuarios (
                nombre,
                email) 
                VALUES
                (?, ?);`, [req.query.nombre, req.query.email])
                .then((rows) => {
                    console.log("response=>", rows);
                    return res.status(200).json({ response: 'ok' })
                })
                .then((res) => {
                    console.log(res);
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
})


app.listen(port.prod, () => { console.log('listening on port 3000'); });