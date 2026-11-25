const UserService = require('../services/user');

const NodeCache = require('node-cache');
const cache = new NodeCache();


class UserController {

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const response = await UserService.login(email, password);
            return res.status(200).json({data: response});
        } catch(e) {
            next(e);
        }
    }


    async getAll(req, res, next) {
        try {
            const cacheUsers = cache.get("getAllUsers");

            if (cacheUsers) {
                console.log("retorno do cache!");
                return res.status(200).json({
                    data: cacheUsers, links: [
                        { rel: "create", href: "/api/v2/users", method: "POST" },
                    ]
                });
            }

            const response = JSON.parse(JSON.stringify(await UserService.getAll()));

            const cached = cache.set("getAllUsers", response);

            if (!cached) {
                console.log("Não foi possível cachear a requisição!");
            }

            return res.status(200).json({
                data: response, links: [
                    { rel: "create", href: "/api/v2/users", method: "POST" },
                ]
            });

        } catch(e) {
            next(e);
        }
    }

    async getById(req, res, next){
        try {
            const id = req.params.id;

            if (req.user.id !== id) {
                return res.status(403).json({ error: "Você só pode visualizar o seu próprio usuário." });
            }

            const cacheUsers = cache.get(id);
            if (cacheUsers) {
                console.log("retorno do cache!");
                return res.status(200).json({
                    data: cacheUsers, links: [
                        { rel: "getAll", href: "/api/v2/users", method: "GET" },
                        { rel: "update", href: `/api/v2/users/${id}`, method: "PUT" },
                        { rel: "delete", href: `/api/v2/users/${id}`, method: "DELETE" },
                    ]
                });
            }

            const response = JSON.parse(JSON.stringify(await UserService.getUserById(id)));

            const cached = cache.set(id, response);
            if (!cached) {
                console.log("Não foi possível cachear a requisição!");
            }

            return res.status(200).json({
                data: response, links: [
                    { rel: "getAll", href: "/api/v2/users", method: "GET" },
                    { rel: "update", href: `/api/v2/users/${id}`, method: "PUT" },
                    { rel: "delete", href: `/api/v2/users/${id}`, method: "DELETE" },
                ]
            });

        } catch(e) {
            next(e);
        }
    }

    async create(req, res, next){
        try{
            const { name, email, password } = req.body;

            const response = await UserService.createUser(name, email, password);

            if (!response) {
                return res.status(400).json("Erro ao criar usuario!");
            }

            cache.del("getAllUsers");

            return res.status(201).json({
                message: "Usuário criado com sucesso.", data: response, links: [
                    { rel: "getById", href: `/api/v2/users/${response.id}`, method: "GET" },
                    { rel: "getAll", href: "/api/v2/users/", method: "GET" },
                    { rel: "update", href: `/api/v2/users/${response.id}`, method: "PUT" },
                    { rel: "delete", href: `/api/v2/users/${response.id}`, method: "DELETE" }
                ]
            });

        } catch(e){
            next(e);
        }
    }

    async update(req, res, next){
        try {
            const id = req.params.id;

            if (req.user.id !== id) {
                return res.status(403).json({ error: "Você só pode alterar o seu próprio usuário." });
            }

            const { name, email, password } = req.body;

            const response = await UserService.updateUser(id, name, email, password);

            if (!response) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            cache.del([id, "getAllUsers"]);

            return res.status(200).json({
                message: "Usuário atualizado com sucesso.", data: response, links: [
                    { rel: "getById", href: `/api/v2/users/${response.id}`, method: "GET" },
                    { rel: "getAll", href: "/api/v2/users", method: "POST" },
                    { rel: "delete", href: `/api/v2/users/${response.id}`, method: "DELETE" }
                ]
            });

        } catch(e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;

            if (req.user.id !== id) {
                return res.status(403).json({ error: "Você só pode excluir o seu próprio usuário." });
            }

            const deleted = await UserService.deleteUser(id);

            if (!deleted) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            cache.del([id, "getAllUsers"]);

            return res.status(200).json({
                message: "Usuário excluído com sucesso.", links: [
                    { rel: "getAll", href: `/api/v2/users`, method: "GET" },
                    { rel: "create", href: "/api/v2/users", method: "POST" }
                ]
            });
        } catch(e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(409).json({ error: "Não é possível excluir: o usuário possui despesas cadastradas." });
            }
            next(e);
        }
    }
}

module.exports = new UserController();