import express from 'express'


const app = express();

app.listen(3000, () => {
    console.log("App is listening on port 3000");
})

app.get('/', (req, res) => {
    res.send("Hello World")
})


pp.get('/api/:date', (req, res) => {
    res.json({
        "unix": Date.parse(req.params.date),
        "utc": new Date(req.params.date).toUTCString()
    })
})


app.get('/api', (req, res) => {
    res.json({
        "unix": new Date().getTime(),
        "utc": new Date().toUTCString()
    })
})
