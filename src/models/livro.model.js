class Livro {
  constructor({ id, titulo, autor, categoria, ano, editora, numeroPaginas }) {
    this.id = id !== undefined ? id : null;
    this.titulo = String(titulo || "").trim();
    this.autor = String(autor || "").trim();
    this.categoria = String(categoria || "").trim();
    this.ano = ano ? parseInt(ano, 10) : null;
    this.editora = String(editora || "").trim();
    this.numeroPaginas = numeroPaginas ? parseInt(numeroPaginas, 10) : null;

    this._validar();
  }

  _validar() {
    const erros = [];
    if (!this.titulo) erros.push("Título é obrigatório");
    if (!this.autor) erros.push("Autor é obrigatório");
    if (!this.categoria) erros.push("Categoria é obrigatória");
    if (!this.ano || !Number.isInteger(this.ano)) erros.push("Ano deve ser um número válido");
    if (!this.editora) erros.push("Editora é obrigatória");
    if (!this.numeroPaginas || !Number.isInteger(this.numeroPaginas) || this.numeroPaginas <= 0) {
      erros.push("Número de páginas deve ser um número inteiro positivo");
    }

    if (erros.length > 0) {
      const error = new Error("Dados inválidos");
      error.statusCode = 400;
      error.details = erros;
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      categoria: this.categoria,
      ano: this.ano,
      editora: this.editora,
      numeroPaginas: this.numeroPaginas,
    };
  }

  static fromJSON(json) {
    return new Livro({
      id: json.id ?? null,
      titulo: json.titulo,
      autor: json.autor,
      categoria: json.categoria,
      ano: json.ano,
      editora: json.editora,
      numeroPaginas: json.numeroPaginas,
    });
  }
}

module.exports = Livro;