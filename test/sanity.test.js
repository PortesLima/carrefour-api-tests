const { expect } = require('chai');

describe('Teste de sanidade', () => {
  it('deve somar 2 + 2 e dar 4', () => {
    expect(2 + 2).to.equal(4);
  });
});