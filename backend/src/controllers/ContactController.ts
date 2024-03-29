import { Request, Response } from 'express';
import { Transaction, ValidationError } from 'sequelize';

import database from '../database';

import Contact from '../models/Contact';
import Phone from '../models/Phone';
import Email from '../models/Email';

import jwtUtil from '../utils/jwtUtil';

import JsonError from '../errors/JsonError';

export default {
    async create(request: Request, response: Response) {
        try {
            const user_id = jwtUtil.getIdFromToken(request.headers['authorization']!);
            let transaction: Transaction | undefined;
            try {
                transaction = await database.getTransaction();
                const contact = request.body as IContact;
                contact.user_id = user_id;
                const result = await Contact.create(contact as any, {
                    include: [
                        Phone,
                        Email
                    ],
                    transaction
                });
                await transaction.commit();
                response.status(201);
                response.json(result.get({ plain: true }));
            } catch (error: ValidationError | any) {
                if (transaction) {
                    await transaction.rollback();
                }
                if (error instanceof ValidationError) {
                    const err = error as ValidationError;
                    response.status(400);
                    response.json(JsonError(request, response, err.message.replace('Validation error: ', '')));
                } else {
                    response.status(500);
                    response.json(JsonError(request, response, 'Não foi possível cadastrar o contato'));
                }
            }
        } catch (error: any) {
            response.status(error.status);
            response.json(JsonError(request, response, error.message));
        }
    },

    async read(request: Request, response: Response) {
        try {
            const user_id = jwtUtil.getIdFromToken(request.headers['authorization']!);
            const { page: _page, size: _size } = request.query;
            let page: number | null = Number(_page);
            let size: number | null = Number(_size);
            if (!page || page < 0) {
                page = null;
                size = null;
            } else {
                size = (!size || size < 1) ? 10 : size;
                page = page * size;
            }
            try {
                const result = (await Contact.findAll({
                    where: {
                        user_id,
                        deleted: false
                    },
                    offset: page!,
                    limit: size!,
                    raw: false
                })).map(contact => contact.get({ plain: true }));
                response.json(result);
            } catch {
                response.status(500);
                response.json(JsonError(request, response, 'Não foi possível buscar os contatos'));
            }
        } catch (error: any) {
            response.status(error.status);
            response.json(JsonError(request, response, error.message));
        }
    },

    async update(request: Request, response: Response) {
        try {
            const user_id = jwtUtil.getIdFromToken(request.headers['authorization']!);
            const { id: contact_id } = request.params;
            let transaction: Transaction | undefined;
            try {
                transaction = await database.getTransaction();
                const { name, alias, phone, email } = request.body;
                const result = await Contact.findOne({
                    where: {
                        id: contact_id,
                        user_id
                    },
                    raw: false
                });
                if (result) {
                    await Promise.all(phone.map(async (p: IPhone) => {
                        await Phone.upsert({
                            id: p.id,
                            phone: p.phone,
                            contact_id,
                            deleted: p.deleted
                        }, { transaction });
                    }));
                    await Promise.all(email.map(async (e: IEmail) => {
                        await Email.upsert({
                            id: e.id,
                            email: e.email,
                            contact_id,
                            deleted: e.deleted
                        }, { transaction });
                    }));
                    await result.update({ name, alias }, { transaction });
                    await transaction.commit();
                    response.sendStatus(204);
                } else {
                    response.status(404);
                    response.json(JsonError(request, response, 'Contato não encontrado'));
                }
            } catch (error: ValidationError | any) {
                if (transaction) {
                    await transaction.rollback();
                }
                if (error instanceof ValidationError) {
                    const err = error as ValidationError;
                    response.status(400);
                    response.json(JsonError(request, response, err.message.replace('Validation error: ', '')));
                } else {
                    response.status(500);
                    response.json(JsonError(request, response, 'Não foi possível atualizar o contato'));
                }
            }
        } catch (error: any) {
            response.status(error.status);
            response.json(JsonError(request, response, error.message));
        }
    },

    async destroy(request: Request, response: Response) {
        try {
            const user_id = jwtUtil.getIdFromToken(request.headers['authorization']!);
            try {
                const result = await Contact.findOne({
                    where: {
                        id: request.params.id,
                        user_id,
                        deleted: false
                    }
                });
                if (result) {
                    await result.update({ deleted: true });
                    response.sendStatus(204);
                } else {
                    response.status(404);
                    response.json(JsonError(request, response, 'Contato não encontrado'));
                }
            } catch {
                response.status(500);
                response.json(JsonError(request, response, 'Não foi possível excluir o contato'));
            }
        } catch (error: any) {
            response.status(error.status);
            response.json(JsonError(request, response, error.message));
        }
    }
};
