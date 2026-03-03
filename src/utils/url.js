const DEFAULT_PROTOCOL = "http://";

function toAddressList(addressQueryParam) {
  if (typeof addressQueryParam === "undefined") {
    return [];
  }

  if (Array.isArray(addressQueryParam)) {
    return addressQueryParam
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
  }

  const singleValue = String(addressQueryParam).trim();
  return singleValue.length > 0 ? [singleValue] : [];
}

function normalizeAddress(address) {
  const trimmedAddress = String(address || "").trim();
  if (!trimmedAddress) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmedAddress)) {
    return trimmedAddress;
  }

  return `${DEFAULT_PROTOCOL}${trimmedAddress}`;
}

module.exports = {
  normalizeAddress,
  toAddressList,
};
