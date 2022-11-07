import express from 'express';
import cors from 'cors';
import { routerUser } from './router';

const PORT = Number(process.env.PORT || 4000)

const api = express();

api.use(cors({ credentials: true, origin: '*' }))

api.use('/user', routerUser)





api.listen(
    PORT,
    () =>
        console.table([
            {
                status: 'run',
                port: PORT
            }
        ])
)