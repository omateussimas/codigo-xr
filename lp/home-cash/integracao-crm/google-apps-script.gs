/**
 * Código XR Capital — LP Home Cash
 * Recebe o envio do formulário e grava uma linha na planilha "Leads".
 *
 * Como usar:
 * 1. Cole este arquivo inteiro no editor de Apps Script da planilha
 *    (Extensões → Apps Script), substituindo o conteúdo padrão.
 * 2. Rode a função `criarCabecalho` uma vez (menu "Executar" no topo,
 *    selecionando essa função) para criar a linha de título na planilha.
 *    Na primeira vez ele vai pedir autorização da sua conta Google.
 * 3. Implante como App da Web (Implantar → Nova implantação → App da Web),
 *    executar como "Eu", acesso "Qualquer pessoa".
 * 4. Copie a URL gerada e mande para quem está cuidando da LP.
 */

const NOME_DA_ABA = 'Leads';

const COLUNAS = [
  'Data/Hora',
  'Nome',
  'WhatsApp',
  'Valor estimado do imóvel',
  'Cidade / Estado',
  'Documentação do imóvel',
  'Objetivo',
  'Objetivo (detalhado)',
  'Página de origem',
];

function criarCabecalho() {
  const aba = obterAba();
  aba.getRange(1, 1, 1, COLUNAS.length).setValues([COLUNAS]);
  aba.setFrozenRows(1);
}

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_DA_ABA);
  if (!aba) {
    aba = planilha.insertSheet(NOME_DA_ABA);
  }
  return aba;
}

function doPost(e) {
  try {
    const dados = (e && e.parameter) || {};

    /* -------- proteção simples contra robôs -------- */
    // campo invisível que humano nunca preenche
    if (dados.website) {
      return respostaOk();
    }
    // envio muito rápido (menos de 2s) indica automação
    const carimbo = Number(dados.carimbo || 0);
    if (carimbo > 0 && Date.now() - carimbo < 2000) {
      return respostaOk();
    }

    const aba = obterAba();
    if (aba.getLastRow() === 0) {
      criarCabecalho();
    }

    aba.appendRow([
      new Date(),
      dados.nome || '',
      dados.whatsapp || '',
      dados.valor || '',
      dados.cidade || '',
      dados.documentacao || '',
      dados.objetivo || '',
      dados.objetivoOutro || '',
      dados.pagina || '',
    ]);

    return respostaOk();
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(erro) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function respostaOk() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
