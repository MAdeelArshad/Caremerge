function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTitlesPage(results) {
  const safeResults = Array.isArray(results) ? results : [];
  const listItems = safeResults
    .map((item) => {
      const address = escapeHtml(item.address || "");
      const title = escapeHtml(item.title || "NO RESPONSE");
      return `    <li>${address} - "${title}"</li>`;
    })
    .join("\n");

  return [
    "<html>",
    "  <head></head>",
    "  <body>",
    "    <h1>Following are the titles of given websites:</h1>",
    "    <ul>",
    listItems || "      <li>No addresses were provided.</li>",
    "    </ul>",
    "  </body>",
    "</html>",
  ].join("\n");
}

module.exports = {
  renderTitlesPage,
};
