# 🏥 Clínica Movimentar - Sistema de Fisioterapia

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

O Clínica Movimentar é um sistema completo de gestão para clínicas de fisioterapia, desenvolvido com tecnologias modernas e focado em proporcionar uma experiência eficiente tanto para profissionais quanto para pacientes.

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT para autenticação
- Bcrypt para criptografia

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/clinica-movimentar.git
cd clinica-movimentar
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` no diretório backend baseado no `.env.example`
   - Configure as variáveis necessárias para conexão com o MongoDB e outras configurações

## 🏃‍♂️ Executando o Projeto

1. Inicie o servidor backend:
```bash
cd backend
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse a aplicação em `http://localhost:5173`

## 📦 Estrutura do Projeto

```
clinica-movimentar/
├── backend/           # API REST
│   ├── controllers/   # Controladores da aplicação
│   ├── models/        # Modelos do MongoDB
│   ├── routes/        # Rotas da API
│   └── middleware/    # Middlewares
├── frontend/          # Aplicação React
│   ├── src/           # Código fonte
│   └── public/        # Arquivos estáticos
└── clinica-infra/     # Configurações de infraestrutura
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Recursos Principais

- Gestão de pacientes
- Agendamento de consultas
- Prontuário eletrônico
- Controle financeiro
- Relatórios e estatísticas
- Interface responsiva e moderna

## 📞 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ pela equipe Clínica Movimentar 