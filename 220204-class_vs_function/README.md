# Comparing React Class Components and Function Components

## Before You Begin
1. Clone this repository to your local computer
2. `cd` into the directory where your local repository is stored
3. As always, the GitHub repository does not include the `node_modules` directory of commonly-used open-source modules. Information about which modules are required is stored in `package.json`. Run `npm install` to create a new `node_modules` directory and to download all the necessary modules to it. When this process is complete, you can...
4. Run `npm start`. If you look at the `"scripts"` section of `package.json`, you will see that this will run `react-scripts start`.
   
   If you are interested, you can find this script at `node_modules/react-scripts/scripts/start.js`. A quick look at the code will show you that it uses Babel and Webpack to convert your React JSX code into plain vanilla JavaScript that can be run in your browser. It then launches the WebpackDevServer on the localHost using the port defined by DEFAULT_PORT, which is generally 3000.

   It will also inject a `<script>` link into the `index.html` file, so that all the scripts in your `src/` folder will be available in the browser. See [here](https://stackoverflow.com/a/42440000) for details.

**NOTE that I have removed several files that are installed by default by `create-react-app`, but which are not needed for this demo. These include test files, logo files and style sheets.**

## Note About <React.StrictMode>

By default, an app created using `npx create-react-app your-app-name-here` will use the following code in `index.js`:

```jsx
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

This means that, in development, React will invoke every method twice: the first time internally, to check for potential problems, and the second time to render the DOM. You can find more details about this [here](https://reactjs.org/docs/strict-mode.html)

For this demonstration, I have removed StrictMode. This demo counts how many times a given component is rendered and how many times a given class is instantiated. If StrictMode were active, the count would be doubled, which might be confusing.

You can open `index.js` and choose whether or not to use StrictMode, by commenting/uncommenting the appropriate lines of code.

## Things to Look For in the JavaScript Files

1. The code for the Function Component is simpler
2. The Class Component needs to bind its methods to `this` in order to work
3. The Class Component maintains its values for `state` in an internal property
4. The Function Component requires that React keeps track of its `state` externally
5. The NestedComponents use `props` to receive a `parent` property

## Things To Look For In The Browser

1. The `index.js` file renders the App component
2. The App component is created by a function
3. Each time the function is called (to render the App component again) a`renderCount` variable is incremented, and its new value is shown.
4. This `renderCount` value for the App component is remains at 1
5. The App component loads two sub components, one created from a class, the other created from a function.
6. Each component is rendered inside its own `<div>` with a black border around it
7. Each of these parent components contains a nested component
8. Each component provides feedback on how many times it has been rendered
9. Clicking on the buttons in one component may cause it to re-render, but will not cause the other component to re-render.
10. If a parent component is re-rendered, its nested child component will also be re-rendered.
11. Only one *instance* of the Class Component is ever required, but its `render` method may be called many times.