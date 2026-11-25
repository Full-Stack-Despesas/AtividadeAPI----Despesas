const UserModel = require('../models/user');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');


class UserService {

    constructor () {}

    async login(email, password){

        if(!email || !password){
            throw new Error('Insira todas as informações de login!');
        }

        const user = await UserModel.findOne({ where: { email: email }});

        if (!user){
            throw new Error("Email ou Senha inválidos!");
        }

        const valid = await bcrypt.compare(password, user.password_hash);

        if(!valid){
            throw new Error("Email ou Senha inválidos!");
        }

        const token = jwt.sign(
            {id: user.id, name: user.name, email: user.email }, config.jwt.secret, {expiresIn: config.jwt.expiresIn }
        )

        return { token, user };

    }
    
    async getAll(){
        // Lista apenas dados básicos; as despesas de cada usuário não são expostas aqui
        return await UserModel.findAll({ attributes: ['id', 'name', 'email', 'created_at', 'updated_at'] });
    }

    async createUser(name, email, password){

        if(!name || !email || !password){
            throw new Error('Envie todos os dados');
        }

        const id = crypto.randomUUID();
        const password_hash = await bcrypt.hash(password, 10);
        return await UserModel.create({id, name, email, password_hash});
    }

    async getUserById(id){
        const response = await UserModel.findByPk(id, { include: [{ association: 'expenses' }] });
       
        if(!response){
            const error = new Error('Usuário não encontrado!');
            error.statusCode = 404;
            throw error;
        }

        return response;

    }

    async updateUser(id, name, email, password){

        if (!id || !name || !email || !password) {
            throw new Error('Envie todos os dados');
        }

        const user = await this.getUserById(id);

        if (!user) {
            return null
        }

        user.name = name
        user.email = email

        if (password) {
            const password_hash = await bcrypt.hash(password, 10);
            user.password_hash = password_hash;
        }

        await user.save();
        return user;
    }

    async deleteUser(id){

        if(!id){
            throw new Error('Envie um id');
        }

        const user = await this.getUserById(id);

        if(!user){
            return null
        }
        
        await user.destroy();
        return true;
    }
}

module.exports = new UserService();