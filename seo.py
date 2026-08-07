# -*- coding: utf-8 -*-
"""Aplica títulos, descrições e dados estruturados nas páginas do site."""
import hashlib
import io
import json
import os
import re

RAIZ = os.path.dirname(os.path.abspath(__file__))
SITE = 'https://codigoxrcapital.com.br'

os.chdir(RAIZ)
v_og = hashlib.sha1(open('assets/img/og-codigo-xr.jpg', 'rb').read()).hexdigest()[:8]
OG = '%s/assets/img/og-codigo-xr.jpg?v=%s' % (SITE, v_og)

# ---------------------------------------------------------------- textos ----
PAGINAS = {
    'index.html': {
        'url': SITE + '/',
        'titulo': 'Estruturação Empresarial e Governança | Código XR Capital',
        'desc': ('Estruturamos empresas familiares e grupos empresariais que entraram em um novo '
                 'ciclo de crescimento: gestão, liderança, governança, indicadores e capital.'),
        'og_titulo': 'Código XR Capital | Estruturação empresarial e governança',
    },
    'sobre.html': {
        'url': SITE + '/sobre',
        'titulo': 'Sobre a Código XR Capital | Inteligência Executiva',
        'desc': ('Conheça Rodrigo Pedreira e Tercilia Pinheiro e a forma de atuação da Código XR '
                 'Capital na estruturação de empresas em crescimento. Alphaville, Barueri/SP.'),
        'og_titulo': 'Sobre a Código XR Capital',
        'trilha': 'Sobre Nós',
    },
    'capital.html': {
        'url': SITE + '/capital',
        'titulo': 'Acesso a Capital e Crédito Empresarial | Código XR Capital',
        'desc': ('Home Equity, capital de giro, crédito para o agronegócio, antecipação de recebíveis '
                 'e Home Cash. Estruturamos crédito, liquidez e reorganização de dívidas.'),
        'og_titulo': 'Acesso a Capital | Código XR Capital',
        'trilha': 'Acesso a Capital',
    },
    'contato.html': {
        'url': SITE + '/contato',
        'titulo': 'Contato | Agende uma Conversa Executiva com a Código XR',
        'desc': ('Fale com a Código XR Capital sobre estruturação empresarial, governança e acesso a '
                 'capital. Escritório em Alphaville, Barueri/SP. Agende uma conversa executiva.'),
        'og_titulo': 'Contato | Código XR Capital',
        'trilha': 'Contato',
    },
}

# ------------------------------------------------------- dados estruturados --
ORGANIZACAO = {
    '@type': 'ProfessionalService',
    '@id': SITE + '/#organizacao',
    'name': 'Código XR Capital',
    'alternateName': 'Código XR',
    'url': SITE + '/',
    'logo': SITE + '/assets/brand/logo-azul.png',
    'image': OG,
    'description': ('Consultoria de estruturação empresarial, governança e acesso a capital para '
                    'empresas familiares e grupos empresariais em crescimento.'),
    'email': 'rodrigopedreira@codigoxrcapital.com.br',
    'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Alameda Rio Negro, 500, Sala 408, Torre 1, Edifício West Tower',
        'addressLocality': 'Barueri',
        'addressRegion': 'SP',
        'postalCode': '06454-000',
        'addressCountry': 'BR',
    },
    'areaServed': {'@type': 'Country', 'name': 'Brasil'},
    'sameAs': ['https://www.instagram.com/rodpedreira/'],
    'employee': [
        {'@type': 'Person', 'name': 'Rodrigo Pedreira', 'jobTitle': 'Inteligência executiva'},
        {'@type': 'Person', 'name': 'Tercilia Pinheiro', 'jobTitle': 'Inteligência executiva'},
    ],
    'knowsAbout': [
        'Estruturação empresarial',
        'Governança corporativa',
        'Gestão orientada por indicadores',
        'Desenvolvimento de lideranças',
        'Sucessão em empresas familiares',
        'Acesso a capital',
        'Crédito com garantia de imóvel',
        'Reestruturação de dívidas empresariais',
    ],
}

SITE_SCHEMA = {
    '@type': 'WebSite',
    '@id': SITE + '/#site',
    'url': SITE + '/',
    'name': 'Código XR Capital',
    'inLanguage': 'pt-BR',
    'publisher': {'@id': SITE + '/#organizacao'},
}

LINHAS = [
    ('Home Equity', 'Crédito com garantia de imóvel para geração de liquidez, reorganização financeira, investimentos ou expansão empresarial.'),
    ('Financiamento imobiliário', 'Aquisição de imóveis residenciais, comerciais, terrenos e propriedades de maior valor.'),
    ('Crédito para construção', 'Capital para construção residencial, incorporação, loteamentos e projetos imobiliários.'),
    ('Capital de giro', 'Crédito para financiar operações, estoques, fornecedores, expansão e necessidades de caixa.'),
    ('Antecipação de recebíveis', 'Transformação de vendas futuras, contratos e recebíveis em liquidez imediata.'),
    ('Consórcio', 'Aquisição planejada de imóveis, veículos, máquinas, equipamentos e outros ativos.'),
    ('Crédito empresarial com garantia', 'Estruturas apoiadas em imóveis, recebíveis, contratos, estoques ou outros ativos da empresa.'),
    ('Financiamento de máquinas e equipamentos', 'Aquisição ou modernização de equipamentos produtivos.'),
    ('Crédito para o agronegócio', 'Soluções para produtores, tradings, armazenadores e empresas da cadeia do agronegócio.'),
    ('Renegociação e consolidação de dívidas', 'Troca de dívidas caras e de curto prazo por operações com prazos maiores e custos mais adequados.'),
]


def blocos(arquivo, dados):
    grafo = [dict(ORGANIZACAO)]

    if arquivo == 'index.html':
        grafo.append(SITE_SCHEMA)
        grafo.append({
            '@type': 'WebPage', '@id': dados['url'] + '#pagina',
            'url': dados['url'], 'name': dados['titulo'], 'description': dados['desc'],
            'inLanguage': 'pt-BR', 'isPartOf': {'@id': SITE + '/#site'},
            'about': {'@id': SITE + '/#organizacao'},
        })
    else:
        tipo = {'sobre.html': 'AboutPage', 'contato.html': 'ContactPage'}.get(arquivo, 'WebPage')
        grafo.append({
            '@type': tipo, '@id': dados['url'] + '#pagina',
            'url': dados['url'], 'name': dados['titulo'], 'description': dados['desc'],
            'inLanguage': 'pt-BR', 'isPartOf': {'@id': SITE + '/#site'},
            'about': {'@id': SITE + '/#organizacao'},
        })
        grafo.append({
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'},
                {'@type': 'ListItem', 'position': 2, 'name': dados['trilha'], 'item': dados['url']},
            ],
        })

    if arquivo == 'capital.html':
        grafo.append({
            '@type': 'Service',
            '@id': dados['url'] + '#servico',
            'name': 'Acesso a Capital',
            'serviceType': 'Originação e estruturação de crédito empresarial',
            'provider': {'@id': SITE + '/#organizacao'},
            'areaServed': {'@type': 'Country', 'name': 'Brasil'},
            'description': ('Originação, análise, modelagem e estruturação de operações de crédito, '
                            'liquidez e reorganização de passivos, em conjunto com bancos, fundos, '
                            'securitizadoras e gestoras.'),
            'hasOfferCatalog': {
                '@type': 'OfferCatalog',
                'name': 'Produtos financeiros',
                'itemListElement': [
                    {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n, 'description': d}}
                    for n, d in LINHAS
                ],
            },
        })

    return json.dumps({'@context': 'https://schema.org', '@graph': grafo},
                      ensure_ascii=False, indent=2)


# ------------------------------------------------------------------ aplica ---
for arquivo, dados in PAGINAS.items():
    s = io.open(arquivo, encoding='utf-8').read()

    s = re.sub(r'<title>.*?</title>', '<title>%s</title>' % dados['titulo'], s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*">',
               '<meta name="description" content="%s">' % dados['desc'], s, count=1)
    s = re.sub(r'<meta property="og:title" content="[^"]*">',
               '<meta property="og:title" content="%s">' % dados['og_titulo'], s, count=1)
    s = re.sub(r'<meta property="og:description" content="[^"]*">',
               '<meta property="og:description" content="%s">' % dados['desc'], s, count=1)
    # a miniatura mudou de conteúdo, então o carimbo precisa acompanhar
    s = re.sub(r'https://codigoxrcapital\.com\.br/assets/img/og-codigo-xr\.jpg(\?v=[0-9a-f]+)?', OG, s)
    s = s.replace('<meta property="og:image:alt" content="Produtor no campo ao entardecer, atendimento da Código XR Capital">',
                  '<meta property="og:image:alt" content="Código XR Capital">')

    # dados estruturados
    s = re.sub(r'\n<script type="application/ld\+json">.*?</script>', '', s, flags=re.S)
    s = s.replace('</head>', '<script type="application/ld+json">\n%s\n</script>\n</head>'
                  % blocos(arquivo, dados), 1)

    io.open(arquivo, 'w', encoding='utf-8').write(s)
    print('ok %-14s %s' % (arquivo, dados['titulo']))

print('\nminiatura:', OG)
