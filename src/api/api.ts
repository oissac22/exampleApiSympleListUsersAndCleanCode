import express from 'express';
import { routerUser } from '../router';

export const Api = express();



Api.use('/user', routerUser);

Api.use((req, res) => res.status(404).send(`<h1>Página "${req.path}" não encontrada</h1>`));

