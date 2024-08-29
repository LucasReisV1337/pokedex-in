# Pokémon Details App

Este é um aplicativo frontend desenvolvido com React e Next.js que permite aos usuários buscar detalhes sobre Pokémon. Ele inclui funcionalidade de pesquisa, histórico de buscas, modo escuro e mais.
Por padrão, a branch mais estávael para testes e a "master".

## Funcionalidades

- **Pesquisa de Pokémon**: Os usuários podem digitar o nome de um Pokémon e obter detalhes sobre ele, incluindo habilidades, tipos, estatísticas e sprite.
- **Histórico de Busca**: O histórico de pesquisas é armazenado localmente e sugestões são fornecidas com base nas buscas anteriores.
- **Modo Escuro**: Alterna entre modo claro e escuro com base na preferência do usuário.
- **Feedback**: Mensagens de erro são exibidas se a busca falhar ou se houver problemas na comunicação com o backend.

## Tecnologias Utilizadas

- **React**: Biblioteca para construir interfaces de usuário.
- **Next.js**: Framework React para renderização do lado do servidor e geração de sites estáticos.
- **Axios**: Cliente HTTP para fazer requisições ao backend.
- **Tailwind CSS**: Framework de CSS utilitário para estilização rápida e responsiva.

## Instalação e Execução

Para executar o aplicativo localmente, siga os passos abaixo:

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd <NOME_DO_REPOSITÓRIO>
   
2. **Instale as dependências**:
   ```bash
   npm install

3. **Execute o aplicativo**:
    ```bash
   npm run dev

O aplicativo estará disponível em http://localhost:7000.

## Estrutura do Projeto

/pages/index.tsx: Componente principal do aplicativo que inclui a lógica de busca e exibição dos detalhes do Pokémon.

/components/interface.ts: Define as interfaces TypeScript para os detalhes do Pokémon.

/public/: Imagens e outros arquivos públicos.

## Comportamento do Componente

O componente principal Home gerencia o estado das buscas e detalhes do Pokémon. As seguintes funcionalidades são implementadas:

- fetchPokemonDetails: Obtém os detalhes do Pokémon a partir do backend.
- handleSearch: Atualiza o histórico de pesquisas e busca detalhes do Pokémon.
- handleSuggestionClick: Permite ao usuário selecionar uma sugestão do histórico de buscas.
- toggleDarkMode: Alterna entre modo claro e escuro e salva a preferência no armazenamento local.
