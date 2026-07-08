const { expect } = require('chai');
const axios = require('axios');

const baseURL = 'https://serverest.dev';

describe('API ServeRest - Login/Autenticação', () => {

  const emailUsuario = `login${Date.now()}@qa.com`;
  const senhaUsuario = 'senha123';

  before(async () => {
    // antes dos testes de login, criamos um usuário válido pra testar o login com ele
    await axios.post(`${baseURL}/usuarios`, {
      nome: 'Usuario Login Teste',
      email: emailUsuario,
      password: senhaUsuario,
      administrador: 'true'
    });
  });

  it('POST /login deve autenticar com sucesso e retornar um token', async () => {
    const response = await axios.post(`${baseURL}/login`, {
      email: emailUsuario,
      password: senhaUsuario
    });

    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Login realizado com sucesso');
    expect(response.data).to.have.property('authorization');
    expect(response.data.authorization).to.include('Bearer');
  });

  it('POST /login não deve autenticar com senha incorreta', async () => {
    try {
      await axios.post(`${baseURL}/login`, {
        email: emailUsuario,
        password: 'senhaErrada'
      });
      throw new Error('Deveria ter dado erro, mas não deu');
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data.message).to.equal('Email e/ou senha inválidos');
    }
  });

  it('POST /login não deve autenticar com e-mail inexistente', async () => {
    try {
      await axios.post(`${baseURL}/login`, {
        email: 'naoexiste@qa.com',
        password: 'qualquerSenha'
      });
      throw new Error('Deveria ter dado erro, mas não deu');
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data.message).to.equal('Email e/ou senha inválidos');
    }
  });

});