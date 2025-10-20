const fs = require("fs");
const path = require("path");
const RepositoryBase = require("./repository.interface");
const Livro = require("../models/livro.model");

class LivrosRepository extends RepositoryBase {
  constructor() {
    super();
    this.caminhoArquivo = path.join(__dirname, "..", "data", "livros.json");
  }

  async _lerArquivo() {
    try {
      const dados = await fs.promises.readFile(this.caminhoArquivo, "utf8");
      return JSON.parse(dados);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error("Erro ao ler o arquivo de livros.");
    }
  }

  async _salvarArquivo(livros) {
    const dataToSave = livros.map(livro => livro.toJSON());
    await fs.promises.writeFile(this.caminhoArquivo, JSON.stringify(dataToSave, null, 2), "utf8");
  }

  async findAll({ titulo, categoria, page = 1, limit = 10 }) {
    const dados = await this._lerArquivo();
    let livrosFiltrados = dados.map(item => Livro.fromJSON(item));

    if (titulo) {
      livrosFiltrados = livrosFiltrados.filter(livro =>
        livro.titulo.toLowerCase().includes(titulo.toLowerCase())
      );
    }
    if (categoria) {
      livrosFiltrados = livrosFiltrados.filter(livro =>
        livro.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;
    const paginatedLivros = livrosFiltrados.slice(startIndex, endIndex);

    return paginatedLivros;
  }

  async findById(id) {
    const livros = await this.findAll({});
    return livros.find((l) => l.id === id);
  }

  async create(livroData) {
    const livros = await this.findAll({});
    const novoId = await this.getNextId();
    const novoLivro = new Livro({ id: novoId, ...livroData });
    livros.push(novoLivro);
    await this._salvarArquivo(livros);
    return novoLivro;
  }

  async update(id, dadosAtualizados) {
    const livros = await this.findAll({});
    const indice = livros.findIndex((l) => l.id === id);
    if (indice === -1) {
      const error = new Error("Livro não encontrado");
      error.statusCode = 404;
      throw error;
    }
    const livroExistente = livros[indice].toJSON();
    livros[indice] = new Livro({ ...livroExistente, ...dadosAtualizados });
    await this._salvarArquivo(livros);
    return livros[indice];
  }

  async delete(id) {
    const livros = await this.findAll({});
    const indice = livros.findIndex((l) => l.id === id);
    if (indice === -1) {
      const error = new Error("Livro não encontrado");
      error.statusCode = 404;
      throw error;
    }
    const [livroRemovido] = livros.splice(indice, 1);
    await this._salvarArquivo(livros);
    return livroRemovido;
  }
}

module.exports = LivrosRepository;