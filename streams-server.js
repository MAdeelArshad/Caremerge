const express = require("express");
const { from, of } = require("rxjs");
const { catchError, map, mergeMap, toArray } = require("rxjs/operators");
const { fetchHtmlByUrlAsync } = require("./src/utils/fetch");
const { renderTitlesPage } = require("./src/utils/html");
const { extractTitleFromHtml } = require("./src/utils/title");
const { normalizeAddress, toAddressList } = require("./src/utils/url");

const PORT = Number(process.env.PORT) || 3003;
const CONCURRENCY_LIMIT = 5;

const app = express();

function fetchTitle(address) {
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedAddress) {
    return Promise.resolve({ address, title: "NO RESPONSE" });
  }

  return fetchHtmlByUrlAsync(normalizedAddress)
    .then((html) => ({
      address,
      title: extractTitleFromHtml(html) || "NO RESPONSE",
    }))
    .catch(() => ({
      address,
      title: "NO RESPONSE",
    }));
}

app.get("/I/want/title", (req, res) => {
  const addresses = toAddressList(req.query.address);

  if (addresses.length === 0) {
    res.status(200).type("html").send(renderTitlesPage([]));
    return;
  }

  from(addresses)
    .pipe(
      map((address, index) => ({ address, index })),
      mergeMap(
        ({ address, index }) =>
          from(fetchTitle(address)).pipe(
            map((result) => ({ ...result, index })),
            catchError(() => of({ address, title: "NO RESPONSE", index }))
          ),
        CONCURRENCY_LIMIT
      ),
      toArray(),
      map((results) => results.sort((a, b) => a.index - b.index))
    )
    .subscribe({
      next: (results) => {
        res.status(200).type("html").send(renderTitlesPage(results));
      },
      error: () => {
        res.status(200).type("html").send(renderTitlesPage([]));
      },
    });
});

app.use((_req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Streams server listening on port ${PORT}`);
});
