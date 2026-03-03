const asyncLib = require("async");
const express = require("express");
const { fetchHtmlByUrl } = require("./src/utils/fetch");
const { renderTitlesPage } = require("./src/utils/html");
const { extractTitleFromHtml } = require("./src/utils/title");
const { normalizeAddress, toAddressList } = require("./src/utils/url");

const PORT = Number(process.env.PORT) || 3000;
const CONCURRENCY_LIMIT = 5;

const app = express();

function fetchTitle(address, callback) {
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedAddress) {
    callback(null, { address, title: "NO RESPONSE" });
    return;
  }

  fetchHtmlByUrl(normalizedAddress, (error, html) => {
    if (error) {
      callback(null, { address, title: "NO RESPONSE" });
      return;
    }

    const title = extractTitleFromHtml(html) || "NO RESPONSE";
    callback(null, { address, title });
  });
}

app.get("/I/want/title", (req, res) => {
  const addresses = toAddressList(req.query.address);

  if (addresses.length === 0) {
    res.status(200).type("html").send(renderTitlesPage([]));
    return;
  }

  asyncLib.mapLimit(addresses, CONCURRENCY_LIMIT, fetchTitle, (_error, results) => {
    res.status(200).type("html").send(renderTitlesPage(results));
  });
});

app.use((_req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Async library server listening on port ${PORT}`);
});
