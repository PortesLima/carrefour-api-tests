const { expect } = require('chai');
const axios = require('axios');

const baseURL = 'https://serverest.dev';

describe('API ServeRest - Usuários', () => {

  let idUsuarioCriado; // vamos guardar o id aqui pra usar nos próximos testes
  const emailUsuario = `teste${Date.now()}@qa.com`;

  it('GET /usuarios deve retornar status 200 e uma lista', async () => {
    const response = await axios.get(`${baseURL}/usuarios`);

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('usuarios');
    expect(response.data.usuarios).to.be.an('array');
  });

  it('POST /usuarios deve cadastrar um novo usuário com sucesso', async () => {
    const novoUsuario = {
      nome: 'Usuario Teste',
      email: emailUsuario,
      password: 'senha123',
      administrador: 'true'
    };

    const response = await axios.post(`${baseURL}/usuarios`, novoUsuario);

    expect(response.status).to.equal(201);
    expect(response.data.message).to.equal('Cadastro realizado com sucesso');
    expect(response.data).to.have.property('_id');

    idUsuarioCriado = response.data._id; // guarda o id pra reutilizar depois
  });

  it('GET /usuarios/{id} deve retornar os dados do usuário criado', async () => {
    const response = await axios.get(`${baseURL}/usuarios/${idUsuarioCriado}`);

    expect(response.status).to.equal(200);
    expect(response.data.email).to.equal(emailUsuario);
  });

  it('PUT /usuarios/{id} deve atualizar o usuário criado', async () => {
    const dadosAtualizados = {
      nome: 'Usuario Teste Atualizado',
      email: emailUsuario,
      password: 'novaSenha123',
      administrador: 'true'
    };

    const response = await axios.put(`${baseURL}/usuarios/${idUsuarioCriado}`, dadosAtualizados);

    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Registro alterado com sucesso');
  });

  it('DELETE /usuarios/{id} deve excluir o usuário criado', async () => {
    const response = await axios.delete(`${baseURL}/usuarios/${idUsuarioCriado}`);

    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Registro excluído com sucesso');
  });

  it('POST /usuarios não deve permitir cadastro com e-mail já existente', async () => {
    const usuarioDuplicado = {
      nome: 'Usuario Duplicado',
      email: 'fulano@qa.com',
      password: 'senha123',
      administrador: 'true'
    };

    await axios.post(`${baseURL}/usuarios`, usuarioDuplicado).catch(() => {});

    try {
      await axios.post(`${baseURL}/usuarios`, usuarioDuplicado);
      throw new Error('Deveria ter dado erro, mas não deu');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.message).to.equal('Este email já está sendo usado');
    }
  });

  it('GET /usuarios/{id} deve retornar erro para id em formato inválido', async () => {
    try {
      await axios.get(`${baseURL}/usuarios/idQueNaoExiste123`);
      throw new Error('Deveria ter dado erro, mas não deu');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
    }
  });

  it('POST /usuarios não deve permitir cadastro sem o campo nome', async () => {
    const usuarioSemNome = {
      email: `semnome${Date.now()}@qa.com`,
      password: 'senha123',
      administrador: 'true'
    };

    try {
      await axios.post(`${baseURL}/usuarios`, usuarioSemNome);
      throw new Error('Deveria ter dado erro, mas não deu');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.nome).to.equal('nome é obrigatório');
    }
  });

  it('PUT /usuarios/{id} inexistente deve criar um novo usuário (comportamento upsert)', async () => {
    const dados = {
      nome: 'Nome Qualquer',
      email: `unico${Date.now()}@qa.com`,
      password: 'senha123',
      administrador: 'true'
    };

    const response = await axios.put(`${baseURL}/usuarios/idInvalido123`, dados);

    expect(response.status).to.equal(201);
    expect(response.data.message).to.equal('Cadastro realizado com sucesso');
    expect(response.data).to.have.property('_id');
  });

  it('DELETE /usuarios/{id} inexistente deve retornar mensagem de nenhum registro excluído', async () => {
    const response = await axios.delete(`${baseURL}/usuarios/idInvalido123`);

    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Nenhum registro excluído');
  });

  it('DELETE /usuarios/{id} deve funcionar mesmo sem token de autorização (comportamento da API)', async () => {
    const novoUsuario = {
      nome: 'Usuario Sem Auth',
      email: `semauth${Date.now()}@qa.com`,
      password: 'senha123',
      administrador: 'true'
    };
    const criado = await axios.post(`${baseURL}/usuarios`, novoUsuario);
    const idCriado = criado.data._id;

    const response = await axios.delete(`${baseURL}/usuarios/${idCriado}`);

    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Registro excluído com sucesso');
  });

});