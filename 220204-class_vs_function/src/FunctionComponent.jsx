/**
 * Using useState in a Function component
 */

// We must import the useState hook
import  { useState } from 'react'

// The custom NestedComponent component is just for demonstration
// purposes
import NestedComponent from './NestedComponent'


// FOR INFO ONLY: renderCount is a custom variables to let us keep
// track of how many times the FunctionComponent function is called.
let renderCount = 0


// FunctionComponent() will be called each time the elements within it
// need to be re-rendered. useState() will be called each time with the
// same initializing value, but React will return the last value set
// for each const variable.
function FunctionComponent() {
  const [ incrementName, setIncrementName ] = useState("I count your clicks")
  const [ singleUseName, setSingleUseName ] = useState("I change my name only once")

  // NOTE: renderCount is not treated using useState, so that it is
  // clear that any changes in its value are caused directly by a
  // new render.

  // Use one function to create two different types of button
  // 1. If `willCount` is true, the name of the button will change
  //    on every click
  // 2. If `willCount` is falsy, the name of the button will change
  //    only once. 
  // In both cases, however, the appropriate setter function will be 
  // called but this will only trigger a new call to FunctionComponent()
  // if the value changes.
  function getButton(willCount) {
    const clickEventListener = willCount
                             ? incrementOnClick
                             : singleUseClick
    const name = willCount
               ? incrementName
               : singleUseName

    return (
        <button
          onClick={clickEventListener}
        >
          {name}
        </button>
    )
  }

  // Update incrementName based on how many times this function has
  // already been called. The renderCount variable itself is incremented
  // in the return statement below. It will be set to 1 on the first
  // render. The button cannot be clicked until after it has been 
  // rendered, so the first time the button is cliced, incrementName
  // will be set to `You clicked me 1 time`, and this will cause this
  // function to be called again, rendering the button with its new
  // name.
  function incrementOnClick () {
    const times = (renderCount === 1)
                ? "1 time"
                : `${renderCount} times`
    setIncrementName(`You clicked me ${times}`)
  }


  // Update singleUseName to the same value every time. If the value
  // doesn't change, no re-render will be required.
  function singleUseClick () {
    setSingleUseName("I won't change my name again")
  }


  // Add one button of each type plus feedback fields and the
  // NestedComponent
  return (
    <div>
      <h1>Function Component</h1>
      {getButton(true)}
      <br />
      {getButton(false)}

      <p>Function component renders: {++renderCount}</p>

      <NestedComponent
        parent="function"
      />
    </div>
  );
}


export default FunctionComponent ;
