const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

// Simulação de BD
const usuarios = { 
    'admin': { senha: '1234', funcao: 'admin' },
    'user': { senha: 'abcd', funcao: 'user' }
};

// Simulação de BD com senhas criptografadas
const usuariosSeguros = {
    'admin': { senha: '$2a$12$NuTArywhAB5hlzdnnhmGgOwMWkUl/mfoN/6EGkU7k22ljOmald7EC', funcao: 'admin' }, // senha '1234'
    'user': { senha: '$2a$12$eyG5Csoyt/5tVXkMoADt3OB.PxsO2qr6p7H9lx6w4CfReHl3S1THm', funcao: 'user' } // senha 'abcd'
}

// Rota de login
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    const usuario = usuariosSeguros[nome]
    if(usuario) {
        bcrypt.compare(senha, usuario.senha)
            .then(resultado => {
                if (resultado) {
                    console.log(nome+' fez login com a senha '+senha)
                    res.json({ sucesso: true, funcao: usuario.funcao })
                }
                else {
                    console.error(nome+' tentou login com a senha '+senha)
                    res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos!' })
                }
            })
            .catch(erro => {
                console.log(erro)
                res.status(500).json({ sucesso: false, mensagem: erro })
            })
    }
    else {
        res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos!' })
    }
});

// Execução do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});