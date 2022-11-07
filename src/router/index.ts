import { Router } from 'express'
import { ControllerUser, ModelUser, ServiceUser } from '../modules';
import { collectionUser } from '../mongo_connection';

const router = Router();

let controller: ControllerUser;

async function initializeController() {
    const collection = await collectionUser()
    const model = new ModelUser(collection)
    const service = new ServiceUser(model);
    controller = new ControllerUser(service)
}

initializeController();


router.get('/', async (req, res) => {
    const result = await controller.listUsers({ query: req.query as any });
    res.status(result.status).send(result.data);
})