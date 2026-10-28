# Verificador de autenticidade INDUFAR

Site estático (HTML, CSS e JavaScript), sem banco de dados. Inclui leitura por câmera, leitura de imagem e campo manual.

## Antes de publicar

1. Abra `config.js`.
2. Substitua `COLE_AQUI_O_CONTEUDO_EXATO_DO_QR_CODE_ORIGINAL` pelo conteúdo exato que aparece ao ler o QR Code original.
3. Se o QR Code tiver uma URL, use a URL completa. Se tiver um texto, use o texto completo.
4. Salve o arquivo e teste com o QR Code original e com o código que deve ser rejeitado.
5. Publique os arquivos em uma hospedagem HTTPS. A câmera do navegador normalmente exige HTTPS (ou `localhost`).

## Publicação simples

### Netlify
- Acesse https://app.netlify.com/drop
- Arraste a pasta do site (ou os arquivos dela) para a área de publicação.
- Use o endereço HTTPS gerado para testar.

### GitHub Pages
- Envie os arquivos para um repositório.
- Em Settings → Pages, habilite a publicação a partir da branch desejada.
- Aguarde a URL HTTPS ficar disponível.

## Como funciona

Qualquer conteúdo idêntico a uma entrada de `validCodes` é tratado como código válido. Todos os outros conteúdos recebem “Autenticidade não confirmada”. Não é necessário cadastrar um QR Code falso.

## Limitações importantes

Este método é uma comparação local e não oferece prova forte de autenticidade: o código válido fica visível no JavaScript e pode ser copiado. Também não distingue uma embalagem legítima de uma falsificação que tenha copiado o QR Code original. Para reduzir esse risco, considere QR Codes únicos por unidade e validação com servidor ou outro mecanismo seguro. O resultado “código reconhecido” significa apenas que o código foi encontrado na lista local configurada.
