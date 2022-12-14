import { Router } from 'express'
import { ControllerUser, ModelUser, ServiceUser } from '../../modules';
import { collectionUser } from '../../mongo_connection';

export const routerUser = Router();

let controller: ControllerUser;

async function initializeController() {
    const collection = await collectionUser()
    const model = new ModelUser(collection)
    const service = new ServiceUser(model);
    controller = new ControllerUser(service)
}

initializeController();



routerUser.get('/', async (req, res) => {
    const result = await controller.listUsers({ query: req.query as any });
    res.status(result.status).send(result.data);
})

routerUser.get('/:id', async (req, res) => {
    const result = await controller.userByEmail({ params: req.params });
    res.status(result.status).send(result.data);
})

routerUser.post('/', async (req, res) => {
    const result = await controller.insertNewUser({ body: req.body as any });
    res.status(result.status).send(result.data);
})

routerUser.put('/:id', async (req, res) => {
    const result = await controller.updateUser({ params: req.params, body: req.body as any });
    res.status(result.status).send(result.data);
})

routerUser.delete('/:id', async (req, res) => {
    const result = await controller.deleteUserByEmail({ params: req.params });
    res.status(result.status).send(result.data);
})