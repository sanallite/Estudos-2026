/* Verificando o número maior e o segundo maior de um array. */
/* const numeros:number[] = [5, 9, 9, 3] */
const numeros:number[] = [1, 2, 10]

if (numeros.length > 0) {
    let maior = numeros[0]
    let segundoMaior = numeros[0]

    for ( let i = 0; i < numeros.length; i++ ) {
        if (numeros[i] > maior) {
            segundoMaior = maior
            maior = numeros[i]
        }
        else if (numeros[i] < maior && numeros[i] > segundoMaior) {
            segundoMaior = numeros[i]
        }

        console.log("Maior: ", maior, "Segundo maior: ", segundoMaior)
    }
}

else {
    console.log('Lista vazia.')
}

/* Usando Map */
type Pedido = { idCliente: string, valor: number }

const lista: Pedido[] = [
    {idCliente: "M", valor: 4},
    {idCliente: "F", valor: 8},
    {idCliente: "M", valor: 2},
    {idCliente: "A", valor: 5},
    {idCliente: "F", valor: 3}
]

function totalPorCliente(pedidos: Pedido[]): Map<string, number> {
    const mapa = new Map<string, number>()

    for (const item of pedidos) {
        if (mapa.has(item.idCliente)) {
            const valorParcial = mapa.get(item.idCliente)
            mapa.set(item.idCliente, valorParcial ?? 0 + item.valor)
        }

        else {
            mapa.set(item.idCliente, item.valor)
        }
    }

    return mapa
}

const totais = totalPorCliente(lista)

for (const [chave, valor] of totais) {
    console.log(chave, valor)
}

/* Usando Set */
const cursoA = ["Ana", "Bruno", "Carla", "Diego"]
const cursoB = ["Carla", "Diego", "Elisa"]

function alunosEmAmbos(a: string[], b: string[]): string[] {
    const setA = new Set<string>(a)
    const setB = new Set<string>(b)
    const setC = new Set<string>()

    for (const item of setA) {
        if (setB.has(item)) {
            setC.add(item)
        }
    }

    return [...setC]
}

console.log(alunosEmAmbos(cursoA, cursoB))

function alunosEmAmbosAlt(a: string[], b: string[]): string[] {
    const setAlunos = new Set<string>(a)

    for (const item of setAlunos) {
        if (!new Set(b).has(item)) {
            setAlunos.delete(item)
        }
    }

    return [...setAlunos]
}

console.log(alunosEmAmbosAlt(cursoA, cursoB))

/* Verificando pré-condições e casos de borda. */
function calcularMedia(notas: number[]): number {
    /* Pré-condição com fail fast. Regra estrutural/técnica. Precisa ser atendida para o código funcionar. */
    if (notas.length === 0) {
        throw new Error("A lista de notas não pode estar vazia.")
    }

    /* Para alterar/mutar o array original, se usa for, não for...of, que itera sobre cópias dos valores do array original. */
    /* for (let i = 0; i < notas.length; i++) {
        if (notas[i] < 0) notas[i] = 0
        if (notas[i] > 100) notas[i] = 100
    } */

    /* Implementação mais segura, não mutar o array o original e fazer uma cópia com .map() */
    const notasAjustadas = notas.map(nota => {
        /* Pré-condição com fail fast. Regra estrutural/técnica. Precisa ser atendida para o código funcionar. */
        if (typeof nota !== "number") throw new Error("Valor de tipo inválido")

        /* Caso de borda: Nota negativa, solução torná-la 0. (Uma regra de negócio hipotética.) */
        if (nota < 0) return 0

        /* Caso de borda: Nota maior que 100, solução torná-la 100. (Uma regra de negócio hipotética.) */
        if (nota > 100) return 100

        return nota
    })

    const soma = notasAjustadas.reduce((acc, n) => acc + n, 0)
    return soma / notasAjustadas.length
}