import { Api } from "./api";
import { routerUser } from "../router";

Api.use('/user', routerUser);

Api.use((req, res) => res.status(404).send(`<h1>Página "${req.path}" não encontrada</h1>`));