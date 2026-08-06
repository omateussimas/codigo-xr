# Código XR Capital, site institucional

Site estático (HTML, CSS e JavaScript puros). Basta subir a pasta inteira em qualquer
hospedagem ou na Vercel. Não há build.

**No ar:** https://codigoxrcapital.com.br (Hostinger) e https://codigo-xr.vercel.app (prévia)
**Repositório:** https://github.com/omateussimas/codigo-xr (branch `main`)

### Como publicar uma nova versão

O repositório é a raiz do site: o que está em `main` é o que fica no ar.

```
git add -A && git commit -m "mensagem" && git push
vercel --prod          # atualiza a prévia na Vercel
```

Depois, na Hostinger: **hPanel → Avançado → GIT → Implantar** no repositório
`codigo-xr`. O deploy é manual por padrão; se quiser automático, copie a
URL de Webhook que a Hostinger mostra e cadastre em GitHub → Settings →
Webhooks do repositório.

### Endereços sem .html

O `.htaccess` serve `/sobre` a partir de `sobre.html`, e quem chegar por um
endereço com `.html` é redirecionado em 301 para a versão limpa. A home fica na
raiz; `/home`, `/index` e `/index.html` levam para lá.

Por isso **todo caminho de asset no HTML é absoluto** (`/assets/...`). Com
caminho relativo, qualquer endereço com um nível a mais ou barra no fim quebraria
o CSS e as imagens.

### Cache: sempre carimbar antes de publicar

O `.htaccess` manda CSS, JS, fontes e imagens com cache de um ano e `immutable`,
o que é ótimo para velocidade e péssimo para atualização: a URL não muda, então
o CDN da Hostinger continua servindo a versão antiga mesmo depois do deploy.

Por isso as referências levam um hash do conteúdo, como
`style.css?v=6f1a8a77`. **Sempre que alterar `style.css` ou `main.js`, rode
o carimbador antes do commit**, senão a mudança não chega em quem já visitou:

```
python versionar.py
```

Se trocar uma imagem mantendo o mesmo nome de arquivo, o problema é o mesmo.
Nesse caso, use um nome novo ou limpe o cache em hPanel → Painel de controle →
Cache → Limpar cache.

### Configuração de servidor

O arquivo `.htaccess` cuida do Apache/LiteSpeed da Hostinger: força HTTPS,
tira o `www`, redireciona as duas URLs antigas para as âncoras da one page,
liga compressão e cache, e bloqueia o acesso web a `.git`, `LEIA-ME.md` e
`vercel.json`, que vão junto no deploy por Git.

O `vercel.json` só vale para a Vercel e é ignorado pela Hostinger.

## Páginas

| Arquivo | Endereço | Página |
|---|---|---|
| `index.html` | `/` | Home (9 dobras) |
| `sobre.html` | `/sobre` | Sobre Nós / Quem Somos |
| `capital.html` | `/capital` | Acesso a Capital (one page com toda a área) |
| `blog.html` | `/blog` | Blog (fora do ar, sem link e redirecionando para a home) |
| `contato.html` | `/contato` | Contato e formulário executivo |

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

A Home usa as seis fotos do primeiro envio do cliente, sem repetição:

| Foto | Onde aparece |
|---|---|
| `hero-principal.jpg` | hero |
| `bento-conselho.jpg` | card "Quem somos" |
| `bento-governanca.jpg` | card de destaque azul |
| `perfil-expansao.jpg` | Empresas em expansão |
| `perfil-familiar.jpg` | Empresas familiares |
| `perfil-transformacao.jpg` | Empresas em transformação |

Sobre Nós, Acesso a Capital e Contato usam a pasta **Fotos Site Codigo XR**, com
fotografia real dos sócios em campo, eventos, indústria e escritório. Os arquivos
foram recortados por slot e otimizados (JPEG progressivo, qualidade 82):

| Arquivo | Origem | Onde aparece |
|---|---|---|
| `xr-hero-capital.jpg` | `Imagem_02` | hero de Acesso a Capital |
| `xr-produtos.jpg` | `Imagem_03` | jornada de produtos financeiros |
| `xr-home-cash.jpg` | `Imagem_04` | jornada Home Cash |
| `xr-banner-sobre.jpg` | `Imagem_05` | banner de abertura de Sobre Nós |
| `xr-retrato-contato.jpg` | `Contato` | coluna lateral de Contato |
| `setor-agronegocio.jpg` | `Imagem_02` | setor Agronegócio em Sobre Nós |
| `xr-juntos-1` a `xr-juntos-6` | diversas | carrossel de Sobre Nós |
| `xr-estrutura.jpg` | diversas | dobra "Trajetória construída em empresas" |
| `setor-*.jpg` (outros 5) | diversas | setores de atuação em Sobre Nós |

`Imagem_02` foi pedida em dois lugares pelo cliente, então a aeronave aparece
tanto no hero de Acesso a Capital quanto no card de Agronegócio.

O **carrossel** troca de foto a cada 3 segundos e para o automático assim que o
visitante usa uma das setas ou os pontos, para não trocar a imagem na mão de quem
está navegando. Fora da tela ele fica parado. Respeita `prefers-reduced-motion`.

Onze fotos do envio ficaram de reserva (aviação, colheita ao pôr do sol, palestras
e retratos), disponíveis para novas dobras.

## Pontos que dependem do cliente

1. **Números institucionais** (`+25 anos`, `6 setores`, `100%`). Os dados de empresas
   acompanhadas e de projetos conduzidos foram retirados do site a pedido do cliente.
   Estão marcados no HTML com `<!-- AJUSTAR COM O CLIENTE -->` na Home e em Sobre Nós.
2. ~~Biografias dos fundadores~~: texto e formação de Rodrigo Pedreira e Tercilia Pinheiro
   já validados pelo cliente e publicados.
3. **Foto institucional dos dois fundadores juntos** na dobra de abertura de Sobre Nós
   (`assets/img/fundadores.jpg` é temporária).
4. **Telefone**: ainda não informado. E-mail e endereço já são os definitivos
   (`rodrigopedreira@codigoxrcapital.com.br` e o escritório em Alphaville, Barueri/SP,
   presente na página de Contato e no rodapé de todas as páginas). O Instagram já aponta para
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
