## Pattern Plot Demos

### Getting Started
```
npm install
```

### Running local server

```
npm run serve
```
This will start the webpack web server locally and the app will run at http://localhost:3001 (as specified in webpack.dev.config.js). The hot-reload has been enabled, so the app will automatically re-run in a web browser when a relevant file change as been detected by the web server. Please note that the hot reload does not actually save an actual bundled and minified library. To bundle the library for production, see the next section.

### Building lattice-lib.min.js

```
npm run build
```