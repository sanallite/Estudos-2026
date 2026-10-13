/* Gerado pelo Gemini como exemplo completo de um sistema de resolução de dependências. */
type Grafo = Map<string, Set<string>>;

class GerenciadorDeDependencias {
  private grafo: Grafo = new Map();

  // Garante que o vértice exista na lista de adjacência
  registrarModulo(modulo: string) {
    if (!this.grafo.has(modulo)) {
      this.grafo.set(modulo, new Set());
    }
  }

  // Grafo Direcionado: 'origem' precisa rodar ANTES de 'destino' (origem -> destino)
  adicionarDependencia(origem: string, destino: string) {
    this.registrarModulo(origem);
    this.registrarModulo(destino);
    this.grafo.get(origem)!.add(destino);
  }

  // Algoritmo de Kahn para Ordenação Topológica e Detecção de Ciclos
  resolverOrdemDeBuild(): string[] {
    const inDegree = new Map<string, number>();

    // 1. Inicializa o grau de entrada de todos os nós em 0
    for (const modulo of this.grafo.keys()) {
      inDegree.set(modulo, 0);
    }

    // 2. Calcula o grau de entrada (quantas dependências chegam em cada nó)
    for (const [, vizinhos] of this.grafo) {
      for (const vizinho of vizinhos) {
        inDegree.set(vizinho, (inDegree.get(vizinho) || 0) + 1);
      }
    }

    // 3. Fila (Queue) com nós prontos: grau de entrada igual a 0
    const fila: string[] = [];
    for (const [modulo, grau] of inDegree.entries()) {
      if (grau === 0) {
        fila.push(modulo);
      }
    }

    const ordemExecucao: string[] = [];

    // 4. Processa a fila camada por camada (estilo BFS)
    while (fila.length > 0) {
      const atual = fila.shift()!;
      ordemExecucao.push(atual);

      // "Remove" as arestas que saem deste nó processado
      const vizinhos = this.grafo.get(atual) || new Set();
      for (const vizinho of vizinhos) {
        const novoGrau = inDegree.get(vizinho)! - 1;
        inDegree.set(vizinho, novoGrau);

        // Se zerou as dependências prévias, já pode ser executado
        if (novoGrau === 0) {
          fila.push(vizinho);
        }
      }
    }

    // 5. Verificação de Ciclo
    if (ordemExecucao.length !== this.grafo.size) {
      throw new Error("Dependência circular detectada! Impossível resolver a ordem.");
    }

    return ordemExecucao;
  }
}

// --- Teste com Sucesso (DAG) ---
const projeto = new GerenciadorDeDependencias();

// Configurações e tokens não dependem de ninguém
// 'ui' precisa de 'tokens'
// 'auth' precisa de 'http'
// 'dashboard' precisa de 'ui' e 'auth'
projeto.adicionarDependencia("tokens", "ui");
projeto.adicionarDependencia("http", "auth");
projeto.adicionarDependencia("ui", "dashboard");
projeto.adicionarDependencia("auth", "dashboard");

console.log("Ordem válida de build:", projeto.resolverOrdemDeBuild());
// Saída válida: ['tokens', 'http', 'ui', 'auth', 'dashboard'] (ou 'http' antes de 'tokens')

// --- Teste com Ciclo (Erro) ---
try {
  const projetoComErro = new GerenciadorDeDependencias();
  projetoComErro.adicionarDependencia("moduloA", "moduloB");
  projetoComErro.adicionarDependencia("moduloB", "moduloA"); // Ciclo A -> B -> A
  projetoComErro.resolverOrdemDeBuild();
} catch (erro: any) {
  console.error(erro.message); // Captura o erro de dependência circular!
}