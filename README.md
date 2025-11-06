O arquivo da coleção do Postman (`API Livraria - Completa.postman_collection.json`) está em anexo neste repositório.

Link do Postman:
https://victorcasagrande0205-5927154.postman.co/workspace/My-Workspace~8f3d4b85-be15-4ab5-a308-435a7008024e/collection/49225667-2ea23d7d-9d9d-44e1-b618-bc6182a52b60?action=share&creator=49225667

Execução:
Clonar esse repositório.
Na pasta raiz, rode `npm install` para baixar as dependências.
Rode `npm run dev` para iniciar o servidor.
O servidor estará rodando em `http://localhost:3000`.

Teste (Fluxo de Autenticação)

Use a coleção do Postman para testar.
Nota: As rotas de POST, PUT e DELETE de Livros são protegidas e exigem login.

Fluxo para validar o funcionamento:

Teste de Proteção (Falha):**
Tente usar a rota "Criar Novo Livro" (`POST /livros`).
Resultado esperado: `401 Não autorizado`.

Registro / Login:
Use "Auth: Registrar Usuário" (`POST /auth/register`) para criar uma conta.
O Postman salvará o cookie de sessão automaticamente.
use "Auth: Login" se o usuário já existir

Teste de Rota Protegida (Sucesso):
Tente usar "Criar Novo Livro" (`POST /livros`) novamente.
Resultado esperado: `201 Criado`.

Logout:
Use "Auth: Logout" (`POST /auth/logout`).
Resultado esperado: `200 OK`.

Teste Pós-Logout (Falha):
Tente usar "Criar Novo Livro" (`POST /livros`) mais uma vez.
Resultado esperado: `401 Não autorizado`.