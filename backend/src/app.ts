import express from 'express';
import cors from 'cors';
import routes from './routes';
import corsConfig from './configs/cors';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.use(routes);

export default app;
