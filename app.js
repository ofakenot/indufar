(() => {
  "use strict";
  const config = window.INDUFAR_CONFIG || {};
  const validCodes = new Set((config.validCodes || []).map(normalize).filter(Boolean));
  const readerElement = document.getElementById("reader");
  const statusElement = document.getElementById("status");
  const resultElement = document.getElementById("result");
  const startButton = document.getElementById("start-camera");
  const fileInput = document.getElementById("qr-file");
  const manualForm = document.getElementById("manual-form");
  const manualCode = document.getElementById("manual-code");
  let scanner = null;
  let scanning = false;
  let lastScanned = "";

  document.getElementById("year").textContent = new Date().getFullYear();

  function normalize(value) {
    return String(value ?? "").trim();
  }

  function setStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.classList.toggle("error", isError);
    statusElement.hidden = false;
  }

  function renderResult(code) {
    const normalizedCode = normalize(code);
    const isValid = validCodes.has(normalizedCode);
    resultElement.hidden = false;
    resultElement.className = `result ${isValid ? "original" : "invalid"}`;

    if (isValid) {
      resultElement.innerHTML = `
        <div class="result-head">
          <div class="result-symbol" aria-hidden="true">✓</div>
          <div>
            <h3>QR Code reconhecido</h3>
            <p>Este código está cadastrado como válido no verificador INDUFAR.</p>
          </div>
        </div>
        <p class="result-detail"><strong>${escapeHtml(config.productName || "Produto INDUFAR")}</strong><br>
        ${escapeHtml(config.supportMessage || "Consulte os canais oficiais da marca em caso de dúvida.")}</p>`;
      setStatus("Verificação concluída.");
    } else {
      resultElement.innerHTML = `
        <div class="result-head">
          <div class="result-symbol" aria-hidden="true">!</div>
          <div>
            <h3>Autenticidade não confirmada</h3>
            <p>Este QR Code não foi reconhecido como um código válido cadastrado pela INDUFAR. Não é possível confirmar a autenticidade por esta consulta.</p>
          </div>
        </div>
        <p class="result-detail">Confira se o código foi lido corretamente. Se o aviso persistir, não confie apenas neste resultado e entre em contato com os canais oficiais da marca.</p>`;
      setStatus("O código lido não corresponde a um código válido cadastrado.", true);
    }
    resultElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  async function stopScanner() {
    if (scanner && scanning) {
      try { await scanner.stop(); } catch (_) {}
      scanning = false;
    }
  }

  startButton.addEventListener("click", async () => {
    if (!window.Html5Qrcode) {
      setStatus("Não foi possível carregar o leitor. Verifique a conexão com a internet e recarregue a página.", true);
      return;
    }
    if (!window.isSecureContext && location.hostname !== "localhost") {
      setStatus("A câmera exige uma conexão HTTPS. Publique o site em HTTPS e tente novamente.", true);
      return;
    }
    startButton.disabled = true;
    startButton.textContent = "Abrindo câmera…";
    resultElement.hidden = true;
    try {
      if (!scanner) scanner = new Html5Qrcode("reader");
      readerElement.style.minHeight = "240px";
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: (w, h) => ({ width: Math.min(w * 0.78, 260), height: Math.min(h * 0.78, 260) }), aspectRatio: 1.0 },
        async decodedText => {
          if (decodedText === lastScanned) return;
          lastScanned = decodedText;
          await stopScanner();
          renderResult(decodedText);
          startButton.disabled = false;
          startButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h2l1.2-1.5h6.6L16.5 6h2A1.5 1.5 0 0 1 20 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12.5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> Ler novamente';
        },
        () => {}
      );
      scanning = true;
      setStatus("Câmera ativa. Posicione o QR Code dentro da moldura.");
    } catch (error) {
      const message = error && error.message ? error.message : "Permita o acesso à câmera e tente novamente.";
      setStatus(`Não foi possível abrir a câmera. ${message}`, true);
      readerElement.style.minHeight = "0";
    } finally {
      startButton.disabled = false;
      if (!scanning) startButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h2l1.2-1.5h6.6L16.5 6h2A1.5 1.5 0 0 1 20 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12.5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> Abrir câmera';
    }
  });

  fileInput.addEventListener("change", async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!window.Html5Qrcode) {
      setStatus("Não foi possível carregar o leitor de QR Code. Verifique sua conexão.", true);
      return;
    }
    try {
      if (!scanner) scanner = new Html5Qrcode("reader");
      const decodedText = await scanner.scanFile(file, true);
      renderResult(decodedText);
    } catch (_) {
      setStatus("Não foi possível encontrar um QR Code legível nessa imagem. Tente uma foto mais nítida.", true);
    } finally {
      fileInput.value = "";
    }
  });

  manualForm.addEventListener("submit", event => {
    event.preventDefault();
    const value = normalize(manualCode.value);
    if (!value) {
      setStatus("Digite o conteúdo do QR Code.", true);
      return;
    }
    renderResult(value);
  });

  if (validCodes.size === 0 || validCodes.has("COLE_AQUI_O_CONTEUDO_EXATO_DO_QR_CODE_ORIGINAL")) {
    setStatus("Configuração pendente: adicione o conteúdo exato do QR Code original em config.js antes de publicar.", true);
  }
})();
