/*
 * CONFIGURAÇÃO DOS QR CODES — INDUFAR
 *
 * 1. Leia/escaneie o QR Code ORIGINAL e copie o conteúdo exato para VALID_CODES.
 * 2. Deixe todos os demais códigos como não reconhecidos.
 * 3. Não é necessário cadastrar um QR Code "falso": qualquer conteúdo que não
 *    esteja em VALID_CODES será tratado como "autenticidade não confirmada".
 *
 * IMPORTANTE: o conteúdo dos códigos válidos fica visível no código-fonte do
 * site. Isso não é seguro contra cópia intencional. Para maior proteção, use
 * códigos únicos e validação por servidor.
 */
window.INDUFAR_CONFIG = {
  brand: "INDUFAR",
  validCodes: [
    // Substitua este exemplo pelo conteúdo EXATO do QR Code original:
    "COLE_AQUI_O_CONTEUDO_EXATO_DO_QR_CODE_ORIGINAL"
  ],
  // Opcional: endereço ou texto que deve ser exibido no resultado original.
  productName: "Produto INDUFAR",
  supportMessage: "Se tiver dúvidas, entre em contato com os canais oficiais da INDUFAR."
};
