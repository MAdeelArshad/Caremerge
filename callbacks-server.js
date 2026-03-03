const express = require("express");
const { fetchHtmlByUrl } = require("./src/utils/fetch");
const { renderTitlesPage } = require("./src/utils/html");
const { extractTitleFromHtml } = require("./src/utils/title");
const { normalizeAddress, toAddressList } = require("./src/utils/url");

const PORT = Number(process.env.PORT) || 3001;

const app = express();

function fetchTitle(address, callback) {
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedAddress) {
    callback(null, {
      address,
      title: "NO RESPONSE",
    });
    return;
  }

  fetchHtmlByUrl(normalizedAddress, (error, html) => {
    if (error) {
      callback(null, {
        address,
        title: "NO RESPONSE",
      });
      return;
    }

    const title = extractTitleFromHtml(html) || "NO RESPONSE";
    callback(null, {
      address,
      title,
    });
  });
}

app.get("/I/want/title", (req, res) => {
  const addresses = toAddressList(req.query.address);

  if (addresses.length === 0) {
    res.status(200).type("html").send(renderTitlesPage([]));
    return;
  }

  const results = new Array(addresses.length);
  let completedCount = 0;

  addresses.forEach((address, index) => {
    fetchTitle(address, (_error, result) => {
      results[index] = result;
      completedCount += 1;

      if (completedCount === addresses.length) {
        res.status(200).type("html").send(renderTitlesPage(results));
      }
    });
  });
});

app.use((_req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Callbacks server listening on port ${PORT}`);
});
