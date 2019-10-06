const express = require('express');
const server = express();

server.use(express.json());

const projetos = [];

let totalChamadas = 0;

function chamadas(req, res, next) {
    totalChamadas++;
    console.log('total de chamadas: ', totalChamadas);

    return next();
}
server.use(chamadas);

function verificarID(req, res, next) {
    const id = req.params.id;
    const index = projetos.findIndex(function(projeto) { return projeto.id === id });

    if(index === -1) {
        return res.status(404).send('Projeto não existe');
    }

    req.projeto = projetos[index];
    req.indexProjeto = index;

    return next();
}

server.post(
    '/projects',
    function(req, res) {
        const { id, title } = req.body;

        if(projetos.find(function(projeto) { return projeto.id === id })) {
            return res.status(409).send('ID já cadastrado');
        }

        const projeto = { id, title, tasks: [] };
        projetos.push(projeto);

        return res.json(projeto);
    }
);

server.get(
    '/projects',
    function(req, res) {
        return res.json(projetos);
    }
);

server.put(
    '/projects/:id',
    verificarID,
    function(req, res) {
        const { title } = req.body;
        const { projeto } = req;

        projeto.title = title;

        return res.json(projeto);
    }
);

server.delete(
    '/projects/:id',
    verificarID,
    function(req, res) {
        const { indexProjeto } = req;

        projetos.splice(indexProjeto, 1);

        return res.status(204).send();
    }
);

server.post(
    '/projects/:id/tasks',
    verificarID,
    function(req, res) {
        const { projeto, body } = req;
        const { title } = body;

        projeto.tasks.push(title);

        return res.json(projeto);
    }
);

server.listen(3005);
