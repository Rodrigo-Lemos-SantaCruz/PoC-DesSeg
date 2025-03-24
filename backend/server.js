const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

// Simulação de BD
const usuarios = { 
    'admin': { senha: '1234', funcao: 'admin' },
    'user': { senha: 'abcd', funcao: 'user' }
};

// Rota de login
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;

    if (usuarios[nome] && usuarios[nome].senha === senha) {
        res.json({ sucesso: true, funcao: usuarios[nome].funcao });
    } else {
        res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos!' });
    }
});

// Execução do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});