import express, { urlencoded } from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';

const app = express();
const Port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }))


app.listen(Port, () => {
    console.log(`Server is listening on port - ${Port}`);
})

const messages = [
    {
        text: "Hi There!",
        user: "Amando",
        added: new Date()
    },
    {
        text: "Hello World!",
        user: "Charles",
        added: new Date()
    }
]

app.get('/', (req, res) => {
    res.render("index", { messages: messages })
})

app.get('/new', (req, res) => {
    res.render("form")
})

app.post('/new', (req, res) => {
    const message = req.body.messageText;
    const user = req.body.messageUser;

    messages.push({ text: message, user: user, added: new Date() });

    res.redirect('/')
})
