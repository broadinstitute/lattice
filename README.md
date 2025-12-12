# lattice.js

Lattice.js is a JavaScript library for creating coordinated multivariate visualizations for sciences. At its core, Lattice champions a 2D grid-based design approach, which offers an intuitive yet powerful visual solution for rendering multivariate data.

## Demos

To see demos of our sample use cases and basic plot types, visit https://lattice.broadinstitute.org.

## Installing and using lattice.js

Use `npm` to install the package in your project.

```
npm install lattice-viz
```

`import` the library to use lattice. There are 3 different imports you can use that will depend on your specific use case.

```
import { LatticeLib, Plot, Lattice } from "lattice-viz";
```

1. `LatticeLib` - This exposes basic usage of Lattice.js as a charting library, allowing someone to call `LatticeLib.plot(...)` or `LatticeLib.lattice(...)` to generate a lattice or a plot.
2. `Plot` - This allows someone to build their own visualization tool and instantiate a `Plot` object within it.
3. `Lattice` - Similarly to 2, this allows someone to build their own visualization tool and instantiate a `Lattice` object within it.

Data visualization developers who may want to layer additional interactive pieces on top of the base visualization are able to do so using options 2 and 3 in conjuction with [D3.js](https://www.npmjs.com/package/d3).

## Styling

Out-of-the-box CSS styling has been provided for easy usage of the lattice.js library and can be imported into your app at its entrypoint.

```
import "lattice-viz/src/css/LatticeLib.css";
```

You will need to install [style-loader](https://github.com/webpack-contrib/style-loader) and [css-loader](https://github.com/webpack-contrib/css-loader) and add a basic rule for css to your webpack config.

```
...
module: {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]
}
...
```

---

## Developing the lattice.js library

### Getting started

After cloning the respository from GitHub, run `npm install` at the root of the repository.

### To generate jsdocs

```
npm run docs
```
