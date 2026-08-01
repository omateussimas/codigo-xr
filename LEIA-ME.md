# Código XR Capital — Site institucional

Site estático (HTML, CSS e JavaScript puros). Basta subir a pasta inteira em qualquer
hospedagem ou na Vercel. Não há build.

## Páginas

| Arquivo | Página |
|---|---|
| `index.html` | Home (9 dobras) |
| `sobre.html` | Sobre Nós / Quem Somos |
| `blog.html` | Blog |
| `contato.html` | Contato e formulário executivo |

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
2. **Biografias dos fundadores** (Rodrigo Pedreira e Tercilia Pinheiro): texto redigido a partir
   do briefing, marcado com `<!-- CONTEÚDO A VALIDAR -->`. Certificações ainda não foram informadas.
3. **Foto institucional dos dois fundadores juntos** na dobra de abertura de Sobre Nós
   (`assets/img/fundadores.jpg` é temporária).
4. **E-mail, telefone e endereço**: hoje `contato@codigoxr.com.br`. O Instagram já aponta para
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
