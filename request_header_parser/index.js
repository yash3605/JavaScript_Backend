import express from 'express'

const app = express();

app.listen(3000, () => {
    console.log("Server is Listening on port 3000");
})

const response = await fetch("https://api.ipify.org/?format=json");
const data = await response.json();
const ip = data.ip



app.get('/', (req, res) => {
    res.send("Hello World")
})

app.get('/api/whoami', (req, res) => {
    var soft = req.headers['user-agent'].split(";")
    res.json({
        "ipaddress": `${ip}`,
        "language": req.headers['accept-language'],
        "software": `${soft}`,
    })
})
