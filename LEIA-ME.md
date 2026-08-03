# Código XR Capital — Site institucional

Site estático (HTML, CSS e JavaScript puros). Basta subir a pasta inteira em qualquer
hospedagem ou na Vercel. Não há build.

**No ar:** https://codigo-xr.vercel.app
**Repositório:** https://github.com/omateussimas/codigo-xr (branch `main`)

Para publicar uma nova versão, dentro desta pasta:

```
git add -A && git commit -m "mensagem" && git push
vercel --prod
```

## Páginas

| Arquivo | Página |
|---|---|
| `index.html` | Home (9 dobras) |
| `sobre.html` | Sobre Nós / Quem Somos |
| `capital.html` | Acesso a Capital (one page com toda a área) |
| `blog.html` | Blog |
| `contato.html` | Contato e formulário executivo |

## Área de Acesso a Capital

Toda a área vive em uma única página, `capital.html`, na ordem da diretriz:

1. Posicionamento e as três chamadas principais
2. Os oito movimentos atendidos
3. Jornada 01, produtos financeiros, com as dez linhas (`#produtos`)
4. Jornada 02, Home Cash (`#home-cash`)
5. As seis etapas da operação e o aviso institucional (`#home-cash-etapas`)
6. Chamada "Seu imóvel pode ser uma fonte estratégica de capital"
7. Formulário de qualificação do Home Cash (`#qualificacao`)
8. Alavancagem e desalavancagem (`#movimentos`)
9. Estruturas de capital sob medida (`#estruturadas`)
10. Escolha por onde começar, com os três caminhos (`#caminhos`)
11. Fechamento

O item **Acesso a Capital** do menu abre um submenu de dez entradas, todas âncoras
desta mesma página, com exceção de "Simule sua operação", que abre a plataforma
externa em nova aba. No mobile o submenu vira lista dentro do drawer.

Cada produto tem âncora própria (`#home-equity`, `#credito-empresarial`,
`#agronegocio`, `#reestruturacao-dividas` e assim por diante) e a seta leva para
`contato.html?produto=NOME`. O formulário de contato abre já sabendo qual linha
o visitante veio pedir (função `iniciarProdutoNaUrl` em `assets/js/main.js`).

O rodapé carrega a nota de compliance obrigatória (`.rodape__legal`).

As páginas `produtos-financeiros.html` e `home-cash.html` foram absorvidas por
esta one page. O `vercel.json` mantém redirecionamento permanente das duas URLs
antigas para as âncoras correspondentes.

### Pendências desta área

1. **Loja de produtos.** Os botões "Simular uma operação", "Acessar produtos
   financeiros" e "Simule sua operação" abrem a plataforma Teddy360 do cliente.
   As setas de cada linha continuam levando ao formulário de contato, para
   capturar o lead qualificado antes do redirecionamento.
2. **Fotografia própria.** A área usa imagens do banco complementar já presente
   no site. Vale produzir fotografia dedicada para mercado imobiliário e dados
   financeiros.
3. **Destino do formulário.** O de Home Cash valida e confirma no front-end,
   igual ao de contato. Falta conectar ao destino final, inclusive os anexos.
4. **Validação jurídica.** Antes de citar qualquer fundo, gestora ou
   administradora, o time jurídico precisa aprovar nome, marca, descrição da
   operação, menções regulatórias e responsabilidades de cada parte. Nenhuma
   instituição foi nomeada no site por esse motivo.

## Identidade

* **Títulos:** Archetica (Light 300, Medium 500)
* **Texto, menu, botões e rótulos:** Maxima Nouva (Regular 400, SemiBold 600)
* Fontes convertidas para `.woff2` a partir do manual da marca e servidas localmente em `assets/fonts/`.
* A Carbon OT foi retirada do projeto a pedido do cliente.

Paleta:

| Cor | Hex | Uso |
|---|---|---|
| Código Marinho | `#0E121A` | fundos escuros, texto, blocos institucionais |
| Azul Expansão | `#A5CBD9` | títulos sobre fundo escuro, cards de destaque |
| Laranja Ação | `#F24E24` | botões de CTA, marcadores, hovers |

Logotipo em `assets/brand/` (versões azul, marinho, branca e ícone), extraído de
`06_Logotipo/01_Principal/1x/Ativo 2.png`.

## Interatividade

* Animações de entrada por seção e por elemento (`data-anima`, `data-grupo`, `data-fatiar`)
* Títulos revelados linha a linha, com recálculo em resize e após o carregamento das fontes
* Cabeçalho que se esconde ao descer e reaparece ao subir
* Menu mobile em drawer com máscara circular
* Contadores animados, marquee de setores, parallax suave, barra de progresso de leitura
* Filtros por categoria no blog
* Validação do formulário em português com mensagem de confirmação
* Tudo respeita `prefers-reduced-motion`

## Fotografia

A Home usa exclusivamente as seis fotos enviadas pelo cliente, sem repetição:

| Foto | Onde aparece |
|---|---|
| `hero-principal.jpg` | hero |
| `bento-conselho.jpg` | card "Quem somos" |
| `bento-governanca.jpg` | card de destaque azul |
| `perfil-expansao.jpg` | Empresas em expansão |
| `perfil-familiar.jpg` | Empresas familiares |
| `perfil-transformacao.jpg` | Empresas em transformação |

Como o acervo tem seis imagens, as seções de "Como atuamos", o bloco "Nosso jeito de atuar"
e os cards de conteúdo passaram a ser tipográficos, sem fotografia. Com mais fotos aprovadas
dá para devolver imagem a esses blocos.

Sobre Nós, Blog e Contato ainda usam banco de imagens complementar nas seções de setores e artigos.

## Pontos que dependem do cliente

1. **Números institucionais** (`+25 anos`, `+40 empresas`, `+70 projetos`, `6 setores`, `100%`).
   Estão marcados no HTML com `<!-- AJUSTAR COM O CLIENTE -->` na Home e em Sobre Nós.
2. ~~Biografias dos fundadores~~: texto e formação de Rodrigo Pedreira e Tercilia Pinheiro
   já validados pelo cliente e publicados.
3. **Foto institucional dos dois fundadores juntos** na dobra de abertura de Sobre Nós
   (`assets/img/fundadores.jpg` é temporária).
4. **Telefone e endereço**: ainda não informados. O e-mail já é o definitivo,
   `rodrigopedreira@codigoxrcapital.com.br`. O Instagram já aponta para
   `instagram.com/rodpedreira`. O LinkedIn foi retirado do site.
5. **Artigos do blog**: títulos e resumos são exemplos; os links apontam para `#`.
6. **Formulário**: valida e confirma no front-end. Falta conectar ao destino final
   (e-mail, CRM ou serviço como Formspree). O ponto de integração fica em
   `assets/js/main.js`, função `iniciarFormulario`.

## Observações de escrita

Todo o texto do site foi escrito sem travessão, conforme solicitado.
Títulos usam `text-wrap: balance` e parágrafos `text-wrap: pretty`, para que nenhuma
linha termine com uma palavra sozinha.

O rodapé traz o crédito "Produzido por Forma Branding", com link para formabranding.com.br.

## Estrutura

```
codigo-xr/
├── index.html  sobre.html  blog.html  contato.html
├── favicon.ico
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── fonts/      Archetica, Maxima Nouva e Carbon OT em woff2
    ├── brand/      logotipos, ícone e favicon
    ├── icons/      ícones do manual da marca (recoloridos por CSS mask)
    └── img/        fotografias do site
```
