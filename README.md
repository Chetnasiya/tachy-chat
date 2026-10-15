# Tachy

A simple chat interface with local browser-based replies.

## Run locally

1. Install [Node.js](https://nodejs.org/) 18 or later if it is not already installed.
2. From the project directory, run:

   ```sh
   node app.js
   ```

3. Open <http://localhost:3000>.

You can also run `npm start` or `npm run dev`. Set the `PORT` environment variable to use a different port.

## Project structure

- `app.js` — Node.js HTTP server entry point
- `views/index.html` — chat page
- `public/css/styles.css` — page styles
- `public/js/chat.js` — browser chat behavior