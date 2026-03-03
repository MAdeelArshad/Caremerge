# Careaxiom Title Fetcher

Node.js implementation of the Careaxiom coding test using four asynchronous control-flow strategies:

- Callbacks
- Async flow library (`async`)
- Promises
- Streams (`RxJS`) - bonus

The app supports one route only:

- `GET /I/want/title?address=google.com`
- `GET /I/want/title?address=google.com&address=www.dawn.com/events/`

All other routes return `404`.

## Project Structure

```text
careaxiom-title-fetcher/
├── async-server.js
├── callbacks-server.js
├── promises-server.js
├── streams-server.js
├── package.json
├── package-lock.json
├── README.md
└── src/
    └── utils/
        ├── fetch.js
        ├── html.js
        ├── title.js
        └── url.js
```

## Install

```bash
npm install
```

## Run

Each implementation has its own script and default port:

- callbacks: `3001` -> `npm run start:callbacks`
- async library: `3002` -> `npm run start:async`
- promises: `3003` -> `npm run start:promises`
- streams (bonus): `3004` -> `npm run start:streams`

To override a port:

```bash
PORT=4000 npm run start:promises
```

## Validation

Example request:

```bash
curl "http://localhost:3003/I/want/title?address=google.com&address=www.dawn.com/events/&address=asdasdasd"
```

Expected response format:

- HTML document
- Heading: `Following are the titles of given websites:`
- List item format: `address - "Title"` or `address - "NO RESPONSE"`


