/* Exercício
"Dado o texto de um log de acesso a um site, com várias linhas no formato horário - usuário - página, eu quero saber: (1) quantas páginas distintas cada usuário visitou, e (2) para cada página, a lista de usuários que a visitaram mais de uma vez." 
*/

/* Passo 1 - Extrair cada registro do log para um objeto que será armazenado num array. */
type RegistroDeAcesso = {usuario: string, pagina: string, horario: string}

const separandoRegistros = (acessos: RegistroDeAcesso[]) => {
    /* Passo 2 - Separar os usuários num mapa com um set das páginas visitadas. */
    const porUsuario = new Map<string, Set<string>>()
    /* Passo 3 - Separar as páginas num mapa com outro mapa que terá os usuários e a sua quantidade de visitas. */
    const porPagina = new Map<string, Map<string, number>>()

    for (const a of acessos) {
        /* Passo 2.1 - Adicionar os usuários ao mapa e as páginas ao set enquanto percorre o array. */
        if (!porUsuario.has(a.usuario)) {
            porUsuario.set(a.usuario, new Set())
        }
        
        porUsuario.get(a.usuario)!.add(a.pagina)

        /* Passo 3.1 Adicionar as páginas e os usuários aos mapas enquanto percorre o array. */
        if (!porPagina.has(a.pagina)) {
            porPagina.set(a.pagina, new Map())
        }

        const usuarios = porPagina.get(a.pagina)!
        usuarios.set(a.usuario, (usuarios.get(a.usuario) ?? 0) + 1)
    }

    /* Passo 4 - Filtrar as informações pedidas pelo enunciado. */

    /* Passo 4.1 - Filtrar a lista dos usuários de cada página para guardar os que visitaram mais de uma vez. */
    const paginasComRepetidos = new Map<string, string[]>()

    for (const [pagina, listaUsuarios] of porPagina) {
        const repetidos: string[] = []

        /* Percorrendo um mapa aninhado. */
        for (const [usuario, contagem] of listaUsuarios) {
            if (contagem > 1) {
                repetidos.push(usuario)
            }
        }

        if (repetidos.length > 0) {
            paginasComRepetidos.set(pagina, repetidos)
        }
    }

    /* Passo 4.2 - Armazenar os usuários e a quantidade de páginas que eles visitaram. */
    const quantidadePaginasPorUsuario: Map<string, number> = new Map()

    for (const [usuario, listaPaginas] of porUsuario) {
        quantidadePaginasPorUsuario.set(usuario, listaPaginas.size)
    }

    /* Passo 5 - Retornando as informações pedidas pelo enunciado. */
    return {
        mapa_de_usuarios_e_quantidade_de_visitas: quantidadePaginasPorUsuario,
        mapa_de_usuarios_e_paginas_visitadas: porUsuario,
        mapa_de_paginas_e_usuarios_que_visitaram_mais_de_uma_vez: paginasComRepetidos
    }
}