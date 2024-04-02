const express = require('express')
const { Rcon } = require('rcon-client')
const path = require('path')
const bodyParser = require('body-parser')
const { error } = require('console')
require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const host = process.env.ip
const password = process.env.password
const port = 25575
var options = {
    challenge: false
};
app.use(express.static(path.join(__dirname, 'public')));

const ejecutar = async (comand)=>{
    try {
        const client = await Rcon.connect({
            host: host,
            por: port,
            password: password
        });
        const result = await client.send(comand)
        return result
    } catch (error) {
        console.error(error)
    }
}
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/ejecutar', async (req, res)=>{
    console.log(req.body)
    if (req.body.password != password) res.json({ status: 'error auth'})
    else {
        res.json({ status: true, data: await ejecutar(req.body.comando)})
    }
})

app.listen('3000', async () => {
    console.log('Escuchando en puerto: 3000')
})