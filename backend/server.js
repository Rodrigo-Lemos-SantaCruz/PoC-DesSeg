const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
const jwt = require('jsonwebtoken');

//Senha do JWT
const SEGREDO = 'DesenvolvimentoSeguro2025.1';

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

//Função que verifica token
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' });

    jwt.verify(token, SEGREDO, (err, usuario) => {
        if (err) return res.status(403).json({ mensagem: 'Token inválido' });

        req.usuario = usuario; // guarda no request para uso posterior
        next();
    });
}
//Rota restrita
app.get('/restrita', autenticarToken, (req, res) => {
    console.log('aqui')
    if (req.usuario.funcao !== 'admin') {
        return res.status(403).json({ mensagem: 'Acesso negado: apenas administradores' });
    }

    res.json({ mensagem: `Bem-vindo, ${req.usuario.nome}. Você está na área restrita!` });
})
// Rota de login
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    const usuario = usuariosSeguros[nome]
    if(usuario) {
        bcrypt.compare(senha, usuario.senha)
            .then(resultado => {
                if (resultado) {
                    console.log(nome+' fez login com a senha '+senha)
                    const token = jwt.sign({ nome, funcao: usuario.funcao }, SEGREDO, { expiresIn: '1h' })
                    res.json({ sucesso: true, token, funcao: usuario.funcao })
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