import express from 'express'
import multer from 'multer'

import cors from 'cors'

const storage = multer({ dest: './public/temp/' })

const app = express();
app.use(cors())

app.use('/public', express.static(process.cwd() + '/public'));

app.listen(3000, () => {
    console.log("Server is listening on Port - 3000");
})

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
});


app.post('/api/fileanalyse', storage.single('upfile'), (req, res) => {
    try {
        res.json({
            "name": req.file.originalname,
            "type": req.file.mimetype,
            "size": req.file.size
        })
    } catch (error) {
        res.send(400);
    }
})

app.get('/Hello', (req, res) => {
    res.send("Hello API")
})
