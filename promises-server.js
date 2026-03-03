const express = require("express");
const { fetchHtmlByUrlAsync } = require("./src/utils/fetch");
const { renderTitlesPage } = require("./src/utils/html");
const { extractTitleFromHtml } = require("./src/utils/title");
const { normalizeAddress, toAddressList } = require("./src/utils/url");

const PORT = Number(process.env.PORT) || 3002;

const app = express();

async function fetchTitle(address) {
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedAddress) {
    return { address, title: "NO RESPONSE" };
  }

  try {
    const html = await fetchHtmlByUrlAsync(normalizedAddress);
    return {
      address,
      title: extractTitleFromHtml(html) || "NO RESPONSE",
    };
  } catch (_error) {
    return {
      address,
      title: "NO RESPONSE",
    };
  }
}

app.get("/I/want/title", async (req, res) => {
  const addresses = toAddressList(req.query.address);

  if (addresses.length === 0) {
    res.status(200).type("html").send(renderTitlesPage([]));
    return;
  }

  const results = await Promise.all(addresses.map((address) => fetchTitle(address)));
  res.status(200).type("html").send(renderTitlesPage(results));
});

app.use((_req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Promises server listening on port ${PORT}`);
});
