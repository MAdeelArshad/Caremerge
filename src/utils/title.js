function extractTitleFromHtml(html) {
  if (typeof html !== "string" || html.length === 0) {
    return null;
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1]) {
    return null;
  }

  const normalizedTitle = titleMatch[1].replace(/\s+/g, " ").trim();
  return normalizedTitle.length > 0 ? normalizedTitle : null;
}

module.exports = {
  extractTitleFromHtml,
};
