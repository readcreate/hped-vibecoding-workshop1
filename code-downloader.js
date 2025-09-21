// ===== Inject Minimal Styles (scoped) =====
(function injectStyles(){
  if (document.getElementById("code-downloader-styles")) return;
  const style = document.createElement("style");
  style.id = "code-downloader-styles";
  style.textContent = `
    .code-downloader label {
      display: block;
      margin-top: 10px;
      margin-bottom: 6px;
    }
    .code-downloader textarea {
      width: 100%;
      height: 4em; /* ~3-4 lines tall */
      resize: vertical;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      font-family: monospace;
      background: #0b1030;
      color: #f7f7ff;
      overflow-y: auto;
    }
    .code-downloader .button-row {
      display: flex;
      gap: 10px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
  `;
  document.head.appendChild(style);
})();

// ===== Initialization Function =====
function setupCodeDownloader(container) {
  // Inject skeleton markup
  container.innerHTML = `
    <h3>Code Downloader</h3>
    <label for="codeInput">Paste the code that the chatbot gave you and then download the file:</label>
    <textarea class="codeInput" placeholder="Paste code here..."></textarea>
    <div class="button-row">
      <button class="downloadBtn btn success">⬇️ Download file</button>
      <button class="clearBtn btn ghost">🧹 Clear box</button>
    </div>
  `;

  const textarea = container.querySelector(".codeInput");
  const downloadBtn = container.querySelector(".downloadBtn");
  const clearBtn = container.querySelector(".clearBtn");

  // Download button
  downloadBtn.addEventListener("click", () => {
    const code = textarea.value.trim();
    if (!code) {
      alert("Please paste some code first.");
      return;
    }
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Clear button
  clearBtn.addEventListener("click", () => {
    textarea.value = "";
  });
}

// ===== Auto-setup for all instances =====
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".code-downloader").forEach(cd => setupCodeDownloader(cd));
});
