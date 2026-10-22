# Tachy

A simple chat interface with a clean layout and simulated bot replies.

Messages are saved in the current browser using `localStorage`; they are not
synced to a server or shared between devices. Use **Clear chat** to remove the
saved conversation from this browser.

## Tech stack

- Node.js built-in HTTP server
- HTML
- CSS
- Browser JavaScript

## Run locally

Requires Node.js 18 or later.

```bash
node app.js
```

Open <http://localhost:3000>. You can also run `npm start` or `npm run dev`.
Set the `PORT` environment variable to use a different port.

## Project structure

- `app.js` — Node.js HTTP server entry point
- `views/index.html` — chat page
- `public/css/styles.css` — page styles
- `public/js/chat.js` — browser chat behavior and local conversation history
