import { Router } from 'express';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import ContactController from './controllers/ContactController';

const routes = Router();

routes.post('/users', UserController.create);
routes.post('/login', SessionController.create);

routes.post('/contacts', ContactController.create);
routes.get('/contacts', ContactController.read);
routes.put('/contacts/:id', ContactController.update);
routes.delete('/contacts/:id', ContactController.destroy);

export default routes;
