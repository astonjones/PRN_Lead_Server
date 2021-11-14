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

//------------  TESTING PURPOSES ONLY ---------------
// const params  = {
//     phone_code: "1",
//     list_id: "98769876", //ASSIGNED TO TEST LIST
//     source: "This is coming from an outside network.",
//     function: "add_lead",
//     user: "5004",
//     pass: "agent5004",
//     first_name: "A",
//     last_name: "J",
//     phone_number: "0123456789"
// };

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

    conn.connect().then(()=>{
        //query
        conn.request().query(
            'SELECT DISTINCT [USER NAME], [CALLS], [XFER] FROM AGENT_PERFORMACE_DETAIL20211028$ ORDER BY [XFER] DESC',
            (err, result) =>{
                console.log(result);
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

// ----------------  TESTING PURPOSES ONLY -----------------------
// app.get('/testingvici', function(req, res){
//     axios.post(`http://12.184.68.100/vicidial/non_agent_api.php`, {}, params)
//         .then(res => {
//             console.log("axios request went through")
//             console.log(`statusCode: ${res.status}`);
//         })
//         .catch(error => { console.error(error)});

//     res.send("This is the test page for vici");
// });

app.listen(() => {
    console.log("node server is running");
});