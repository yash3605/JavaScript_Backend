import { getAllUsernames, insertUsername } from '../db/queries.js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url))

async function getUsernames(req, res) {
    const usernames = await getAllUsernames();
    console.log("Usernames: ", usernames);
    res.send("Usernames: " + usernames.map(user => user.username).join(", "));
}

async function createUsernameGet(req, res) {
    const filepath = join(__dirname, '../public/form.html');
    res.sendFile(filepath)
}

async function createUsernamePost(req, res) {
    const username = req.body.username;
    await insertUsername(username);
    res.redirect("/");
}

export { getUsernames, createUsernameGet, createUsernamePost }
