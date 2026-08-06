# -*- coding: utf-8 -*-
"""
Carimba o CSS e o JS com um hash do conteúdo nas referências do HTML.

Sem isso, o cache de um ano com immutable trava a versão antiga no CDN:
o arquivo muda no servidor, mas a URL continua a mesma e ninguém recebe
a atualização. Com ?v=<hash>, cada alteração vira uma URL nova.
"""
import hashlib
import io
import os
import re

RAIZ = os.path.dirname(os.path.abspath(__file__))
ALVOS = ['assets/css/style.css', 'assets/js/main.js']


def hash_curto(caminho):
    with open(caminho, 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]


versoes = {}
for rel in ALVOS:
    versoes[rel] = hash_curto(os.path.join(RAIZ, rel))
    print('%-24s v=%s' % (rel, versoes[rel]))

alterados = 0
for nome in sorted(os.listdir(RAIZ)):
    if not nome.endswith('.html'):
        continue
    caminho = os.path.join(RAIZ, nome)
    s = io.open(caminho, encoding='utf-8').read()
    orig = s
    for rel, v in versoes.items():
        # troca o ?v= antigo, se existir, ou acrescenta um novo
        s = re.sub(re.escape(rel) + r'(\?v=[0-9a-f]+)?', rel + '?v=' + v, s)
    if s != orig:
        io.open(caminho, 'w', encoding='utf-8').write(s)
        alterados += 1
        print('  carimbado:', nome)

print('\npáginas atualizadas: %d' % alterados)
