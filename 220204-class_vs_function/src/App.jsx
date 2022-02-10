/**
 * Use a function component to render both a Class Component and a
 * Function Component. Both these components will also contain a 
 * nested function component.
 */

import './App.css'
import ClassComponent from './FunctionComponent'
import FunctionComponent from './ClassComponent'


// Count how many times the App component itself is rendered: exactly 1
let renderCount = 0


function App() {
  return (
    <>
      <ClassComponent />
      <FunctionComponent />
      <p>App renders: {++renderCount}</p>
    </>
  );
}


export default App ;
