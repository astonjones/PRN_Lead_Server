require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
const axios = require('axios');

app.set('port', process.env.PORT || 5500);
app.listen(app.get('port'));

app.use(cors());
app.use(bodyParser.json());

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_SERVER = process.env.DB_SERVER;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = 1433;

const conn = new sql.ConnectionPool({
    server: DB_SERVER,
    port: DB_PORT,
    database: DB_DATABASE,
    driver: "msnodesqlv8",
    options: {
      trustedConnection: true
    }
})

if(!(DB_USER && DB_PASS && DB_SERVER && DB_DATABASE)){
    console.error('MISSING CONFIG VALUES');
}


app.get('/', async function(req, res){

    conn.connect().then(()=>{
        //query
        conn.request().query('SELECT * FROM AGENT_PERFORMACE_DETAIL20211028$', (err, result) =>{
            console.log(result);
            res.send(result);
        })
    });

});

app.get('/topagents', async function(req, res){

    conn.connect().then(()=>{
        //query
        conn.request().query(
            'SELECT TOP 8 [USER NAME], [CALLS], [XFER] FROM AGENT_PERFORMACE_DETAIL20211028$ ORDER BY [XFER] DESC',
            (err, result) =>{
                console.log(result);
                res.send(result);
        })
    });

});

app.get('/allagents', async function(req, res){
    let param = req.query.foo //Grabs he parameters sent from front-end application, can make use of them 
    console.log(param);

    conn.connect().then(()=>{
        //query
        conn.request().query(
            'SELECT DISTINCT [USER NAME], [CALLS], [XFER] FROM AGENT_PERFORMACE_DETAIL20211028$ ORDER BY [XFER] DESC',
            (err, result) =>{
                res.send(result);
        })
    });

});

app.get('/todayxfer', async function(req, res){

    conn.connect().then(()=>{
        //query
        conn.request().query(
            'SELECT TOP 1 [XFER] FROM AGENT_PERFORMACE_DETAIL20211028$ ORDER BY [XFER] DESC',
            (err, result) =>{
                console.log(result);
                res.send(result);
        })
    });

});

app.get('/todaycalls', async function(req, res){

    conn.connect().then(()=>{
        //query
        conn.request().query(
            'SELECT TOP 1 [XFER], [CALLS] FROM AGENT_PERFORMACE_DETAIL20211028$ ORDER BY [XFER] DESC',
            (err, result) =>{
                console.log(result);
                res.send(result);
        })
    });

})

app.listen(() => {
    console.log("node server is running");
});