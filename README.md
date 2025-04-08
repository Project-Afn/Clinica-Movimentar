# MoviCare System

Sistema de gerenciamento de pacientes e prontuários para clínicas de fisioterapia.

## 🚀 Visão Geral

O MoviCare System é uma aplicação web desenvolvida para auxiliar clínicas de fisioterapia no gerenciamento de pacientes e seus prontuários. O sistema permite o cadastro de pacientes, registro de prontuários e acompanhamento do histórico de tratamentos.

## ✨ Funcionalidades

- **Autenticação de Usuários**
  - Login de administradores e fisioterapeutas
  - Controle de acesso baseado em perfil
  - Gerenciamento de sessão

- **Gestão de Pacientes**
  - Cadastro de novos pacientes
  - Visualização detalhada de pacientes
  - Edição de informações
  - Histórico completo de prontuários

- **Prontuários**
  - Criação de prontuários
  - Registro de diagnósticos e tratamentos
  - Adição de observações
  - Busca por nome do paciente
  - Visualização do histórico de atendimentos

- **Interface Intuitiva**
  - Design moderno e responsivo
  - Navegação simplificada
  - Feedback visual para ações
  - Mensagens de erro claras

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Axios
- React Router
- React Query

### Backend
- Node.js
- Express
- MongoDB
- JWT para autenticação
- Mongoose

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/movi-care-system.git
cd movi-care-system
```

2. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

3. Instale as dependências do backend:
```bash
cd ../backend
npm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` no diretório do backend
   - Adicione as seguintes variáveis:
     ```
     MONGODB_URI=sua_uri_do_mongodb
     JWT_SECRET=seu_secret_jwt
     PORT=5000
     ```

5. Inicie o servidor backend:
```bash
npm run dev
```

6. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

## 📝 Uso

1. Acesse a aplicação em `http://localhost:3000`
2. Faça login com suas credenciais
3. Navegue pelo sistema usando o menu lateral
4. Gerencie pacientes e prontuários conforme necessário


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
