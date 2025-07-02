import express from 'express';
import userRouter from './routes/user.routes.js';
const app = express();
app.use(express.urlencoded({ extended: true }))

app.use('/', userRouter)

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})


