const axios = require("axios");

const REQUEST_TIMEOUT_MS = 5000;

async function fetchHtmlByUrlAsync(url) {
  const response = await axios.get(url, {
    timeout: REQUEST_TIMEOUT_MS,
    responseType: "text",
    maxRedirects: 3,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  return String(response.data || "");
}

function fetchHtmlByUrl(url, callback) {
  fetchHtmlByUrlAsync(url)
    .then((html) => callback(null, html))
    .catch((error) => callback(error));
}

module.exports = {
  fetchHtmlByUrl,
  fetchHtmlByUrlAsync,
  REQUEST_TIMEOUT_MS,
};
