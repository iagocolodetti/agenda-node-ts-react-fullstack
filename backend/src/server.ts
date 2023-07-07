import { config } from 'dotenv';
import { ok } from 'assert';
import { join } from 'path';

config({ path: join(__dirname, '../config/', `.${process.env.NODE_ENV}`) });
ok(process.env.NODE_ENV === 'env.development', 'env inválido.');

import app from './app';
import database from './database';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

database.connect();

const swaggerDocument = YAML.load(join(__dirname, './configs/swagger.yaml'));
app.use(`${process.env.SV_API_DOCS}`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.SV_PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.SV_PORT}`);
    console.log(`Documentação: '${process.env.SV_API_DOCS}'`);
});
