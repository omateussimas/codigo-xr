<?php
/**
 * Código XR Capital
 * Recebe os formulários do site e envia por e-mail para a equipe.
 *
 * Responde JSON quando chamado por fetch e redireciona quando o visitante
 * está sem JavaScript, para o formulário funcionar nos dois casos.
 */

declare(strict_types=1);

const DESTINATARIOS = [
    'rodrigopedreira@codigoxrcapital.com.br',
    'tercilia.pinheiro@codigoxrcapital.com.br',
];
const ASSUNTO   = 'Nova Oportunidade na Código XR (formulário preenchido)';
// Precisa ser uma caixa que exista no domínio, senão o servidor recusa o envio.
// Se criarem site@codigoxrcapital.com.br no hPanel, troque aqui.
const REMETENTE = 'rodrigopedreira@codigoxrcapital.com.br';
const DOMINIO   = 'codigoxrcapital.com.br';

// anexos: só o que faz sentido para matrícula, IPTU e fotos do imóvel
const EXTENSOES_OK = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
const LIMITE_ARQUIVO = 8 * 1024 * 1024;   // 8 MB por arquivo
const LIMITE_TOTAL   = 20 * 1024 * 1024;  // 20 MB somando todos

/* ------------------------------------------------------------------ */
/* Rótulos amigáveis. O que não estiver aqui entra com o nome do campo. */
/* ------------------------------------------------------------------ */
const ROTULOS = [
    'formulario'     => 'Formulário',
    'nome'           => 'Nome',
    'empresa'        => 'Empresa',
    'cargo'          => 'Cargo',
    'email'          => 'E-mail',
    'telefone'       => 'Telefone',
    'whatsapp'       => 'WhatsApp',
    'documento'      => 'CPF ou CNPJ',
    'cidade'         => 'Cidade',
    'estado'         => 'Estado',
    'colaboradores'  => 'Número de colaboradores',
    'segmento'       => 'Segmento',
    'desafio'        => 'Principal desafio',
    'momento'        => 'Momento da empresa',
    'mensagem'       => 'Mensagem',
    'origem'         => 'Como conheceu a Código XR',
    'tipo-imovel'    => 'Tipo de imóvel',
    'valor-imovel'   => 'Valor estimado do imóvel',
    'valor-capital'  => 'Valor de capital desejado',
    'tem-divida'     => 'Financiamento ou dívida sobre o imóvel',
    'saldo-divida'   => 'Saldo aproximado da dívida',
    'valor-parcela'  => 'Valor atual da parcela',
    'finalidade'     => 'Finalidade dos recursos',
    'prazo'          => 'Prazo para receber o capital',
    'contexto'       => 'Contexto da operação',
    'consentimento'  => 'Autorização de contato e tratamento de dados',
];

/* campos de controle que não entram no corpo do e-mail */
const IGNORAR = ['website', 'carimbo', 'formulario'];

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/** Remove quebras de linha, que é como se injeta cabeçalho em e-mail. */
function limparCabecalho(string $v): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], '', $v));
}

function ehAjax(): bool
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
        && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'fetch';
}

function responder(int $codigo, bool $ok, string $mensagem): void
{
    http_response_code($codigo);
    if (ehAjax()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    } else {
        $destino = $ok ? '/contato?enviado=1' : '/contato?erro=1';
        header('Location: ' . $destino, true, 303);
    }
    exit;
}

/** Codifica o assunto para não quebrar acentuação em cliente antigo. */
function assuntoMime(string $s): string
{
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

/* ------------------------------------------------------------------ */
/* Validação da requisição                                             */
/* ------------------------------------------------------------------ */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, false, 'Método não permitido.');
}

/* armadilha para robô: campo invisível que humano nunca preenche */
if (!empty($_POST['website'])) {
    responder(200, true, 'Recebemos suas informações.');
}

/* envio instantâneo é robô; pessoa leva alguns segundos preenchendo */
$carimbo = (int) ($_POST['carimbo'] ?? 0);
if ($carimbo > 0 && (time() * 1000 - $carimbo) < 3000) {
    responder(200, true, 'Recebemos suas informações.');
}

$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if ($email === false) {
    responder(422, false, 'Informe um e-mail válido para retornarmos o contato.');
}

$nome = limparCabecalho((string) ($_POST['nome'] ?? ''));
if ($nome === '') {
    responder(422, false, 'Informe seu nome.');
}

/* ------------------------------------------------------------------ */
/* Monta o corpo do e-mail                                             */
/* ------------------------------------------------------------------ */

$qual = limparCabecalho((string) ($_POST['formulario'] ?? 'Formulário do site'));

$linhas = [];
foreach ($_POST as $campo => $valor) {
    if (in_array($campo, IGNORAR, true)) {
        continue;
    }
    if (is_array($valor)) {
        $valor = implode(', ', $valor);
    }
    $valor = trim((string) $valor);
    if ($valor === '') {
        continue;
    }
    if ($campo === 'consentimento') {
        $valor = 'Sim, autorizado';
    }
    $linhas[] = [ROTULOS[$campo] ?? ucfirst(str_replace('-', ' ', $campo)), $valor];
}

$agora = new DateTime('now', new DateTimeZone('America/Sao_Paulo'));
$quando = $agora->format('d/m/Y') . ' às ' . $agora->format('H:i');
$ip = limparCabecalho((string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? ''));
$pagina = limparCabecalho((string) ($_POST['pagina'] ?? ''));

$html  = '<div style="font-family:Arial,Helvetica,sans-serif;color:#0E121A;max-width:640px">';
$html .= '<div style="background:#0E121A;color:#A5CBD9;padding:22px 26px;border-radius:12px 12px 0 0">';
$html .= '<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#F24E24">Código XR Capital</div>';
$html .= '<div style="font-size:20px;margin-top:6px">' . htmlspecialchars($qual, ENT_QUOTES, 'UTF-8') . '</div>';
$html .= '</div>';
$html .= '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e3e8ec;border-top:0">';

foreach ($linhas as $i => [$rotulo, $valor]) {
    $fundo = $i % 2 === 0 ? '#ffffff' : '#f5f8fa';
    $html .= '<tr style="background:' . $fundo . '">';
    $html .= '<td style="padding:12px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b7683;width:34%;vertical-align:top;border-bottom:1px solid #e3e8ec">'
           . htmlspecialchars($rotulo, ENT_QUOTES, 'UTF-8') . '</td>';
    $html .= '<td style="padding:12px 16px;font-size:15px;line-height:1.5;border-bottom:1px solid #e3e8ec">'
           . nl2br(htmlspecialchars($valor, ENT_QUOTES, 'UTF-8')) . '</td>';
    $html .= '</tr>';
}

$html .= '</table>';
$html .= '<p style="font-size:12px;color:#6b7683;margin:16px 0 0;line-height:1.6">';
$html .= 'Enviado em ' . $quando;
if ($pagina !== '') {
    $html .= ' pela página ' . htmlspecialchars($pagina, ENT_QUOTES, 'UTF-8');
}
if ($ip !== '') {
    $html .= '<br>IP de origem: ' . htmlspecialchars($ip, ENT_QUOTES, 'UTF-8');
}
$html .= '<br>Responda este e-mail para falar direto com quem preencheu.';
$html .= '</p></div>';

$texto = $qual . "\n\n";
foreach ($linhas as [$rotulo, $valor]) {
    $texto .= $rotulo . ': ' . $valor . "\n";
}
$texto .= "\nEnviado em " . $quando;

/* ------------------------------------------------------------------ */
/* Anexos                                                              */
/* ------------------------------------------------------------------ */

$anexos = [];
$somaTotal = 0;
$recusados = [];

if (!empty($_FILES['documentos']['name'])) {
    $arq = $_FILES['documentos'];
    $nomes = is_array($arq['name']) ? $arq['name'] : [$arq['name']];
    $tmps  = is_array($arq['tmp_name']) ? $arq['tmp_name'] : [$arq['tmp_name']];
    $erros = is_array($arq['error']) ? $arq['error'] : [$arq['error']];
    $tams  = is_array($arq['size']) ? $arq['size'] : [$arq['size']];

    foreach ($nomes as $i => $nomeArq) {
        if ($nomeArq === '' || ($erros[$i] ?? 1) !== UPLOAD_ERR_OK) {
            continue;
        }
        $ext = strtolower(pathinfo($nomeArq, PATHINFO_EXTENSION));
        if (!in_array($ext, EXTENSOES_OK, true)) {
            $recusados[] = $nomeArq . ' (formato não aceito)';
            continue;
        }
        if ($tams[$i] > LIMITE_ARQUIVO) {
            $recusados[] = $nomeArq . ' (acima de 8 MB)';
            continue;
        }
        if ($somaTotal + $tams[$i] > LIMITE_TOTAL) {
            $recusados[] = $nomeArq . ' (estourou o limite total de 20 MB)';
            continue;
        }
        if (!is_uploaded_file($tmps[$i])) {
            continue;
        }
        $conteudo = file_get_contents($tmps[$i]);
        if ($conteudo === false) {
            continue;
        }
        $anexos[] = [
            'nome' => preg_replace('/[^\w\.\- ]/u', '_', basename($nomeArq)),
            'tipo' => $ext === 'pdf' ? 'application/pdf' : 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext),
            'dados' => $conteudo,
        ];
        $somaTotal += $tams[$i];
    }
}

if ($recusados) {
    $aviso = '<p style="font-size:13px;color:#F24E24;margin-top:6px">Arquivos não anexados: '
           . htmlspecialchars(implode('; ', $recusados), ENT_QUOTES, 'UTF-8') . '</p>';
    // fecha a div externa depois do aviso, em vez de trocar todos os </div>
    $html = substr($html, 0, -6) . $aviso . '</div>';
    $texto .= "
Arquivos não anexados: " . implode('; ', $recusados);
}

/* ------------------------------------------------------------------ */
/* Monta e envia a mensagem                                            */
/* ------------------------------------------------------------------ */

$limiteMisto = 'xr_misto_' . bin2hex(random_bytes(12));
$limiteAlt   = 'xr_alt_'   . bin2hex(random_bytes(12));

$cabecalhos = [
    'From: =?UTF-8?B?' . base64_encode('Site Código XR') . '?= <' . REMETENTE . '>',
    'Reply-To: ' . limparCabecalho($nome) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
];

if ($anexos) {
    $cabecalhos[] = 'Content-Type: multipart/mixed; boundary="' . $limiteMisto . '"';
    $corpo  = "--" . $limiteMisto . "\r\n";
    $corpo .= 'Content-Type: multipart/alternative; boundary="' . $limiteAlt . "\"\r\n\r\n";
} else {
    $cabecalhos[] = 'Content-Type: multipart/alternative; boundary="' . $limiteAlt . '"';
    $corpo = '';
}

$corpo .= "--" . $limiteAlt . "\r\n";
$corpo .= "Content-Type: text/plain; charset=UTF-8\r\n";
$corpo .= "Content-Transfer-Encoding: base64\r\n\r\n";
$corpo .= chunk_split(base64_encode($texto)) . "\r\n";

$corpo .= "--" . $limiteAlt . "\r\n";
$corpo .= "Content-Type: text/html; charset=UTF-8\r\n";
$corpo .= "Content-Transfer-Encoding: base64\r\n\r\n";
$corpo .= chunk_split(base64_encode($html)) . "\r\n";

$corpo .= "--" . $limiteAlt . "--\r\n";

if ($anexos) {
    foreach ($anexos as $a) {
        $corpo .= "\r\n--" . $limiteMisto . "\r\n";
        $corpo .= 'Content-Type: ' . $a['tipo'] . '; name="' . $a['nome'] . "\"\r\n";
        $corpo .= "Content-Transfer-Encoding: base64\r\n";
        $corpo .= 'Content-Disposition: attachment; filename="' . $a['nome'] . "\"\r\n\r\n";
        $corpo .= chunk_split(base64_encode($a['dados'])) . "\r\n";
    }
    $corpo .= "--" . $limiteMisto . "--\r\n";
}

$para = implode(', ', DESTINATARIOS);
$enviado = @mail(
    $para,
    assuntoMime(ASSUNTO),
    $corpo,
    implode("\r\n", $cabecalhos),
    '-f' . REMETENTE
);

if (!$enviado) {
    error_log('[codigo-xr] falha ao enviar formulário de ' . $email);
    responder(500, false, 'Não conseguimos enviar agora. Escreva para rodrigopedreira@codigoxrcapital.com.br que respondemos rápido.');
}

responder(200, true, 'Recebemos suas informações.');
