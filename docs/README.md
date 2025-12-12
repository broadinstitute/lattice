## lattice.js homepage

URL: https://lattice.broadinstitute.org

### Running the homepage locally

Contents of the homepage are stored in the `docs` directory and are served from the `main` branch.
NPM and Vite have been setup so that while you are running it locally using a Vite server and edit the page, the page will hot reload.

Changes should automatically pull to production once it has been merged into `main`.
To run a local server:

```
cd docs
npm install
npm run serve # will serve it at port 8000 locally, according to vite.config.js
```
