/**
 * Using this.state and this.setState in a Class Component
 */

// We must import the Component parent class
import { Component } from 'react'

// The custom NestedComponent component is just for demonstration
// purposes
import NestedComponent from './NestedComponent'

// FOR INFO ONLY: Custom variables to let us keep track of how many
// times the ClassComponent class is instantiated, and how many times
// its render() method is called.
let instanceCount = 0
let renderCount = 0

/* 
  Here is what the setState method of the Component object might
  look like:

  Component = { 
    setState: function(newStateObject) {
      Object.assign(this.state, newStateObject)

      // Wait until all setState calls have been treated for this
      // iteration of JavaScript's event loop, then update the DOM
      setTimeout(
        () => this.render(),
        0
      )
    }
  }
*/

class ClassComponent extends Component {
  constructor(props) {
    super(props)

    // Create a this.state object with values that will be 
    // updated by this.setState
    this.state = {
      clickCount: 0,
      incrementName: "I count your clicks",
      singleUseName: "I change my name only once"
    }

    // Methods need to be bound to `this`, otherwise they will
    // have no access to `this` or the Component parent members
    // when they are called from inside an event listener function.
    this.incrementOnClick = this.incrementOnClick.bind(this);
    this.singleUseClick = this.singleUseClick.bind(this);

    // FOR INFO ONLY: count how often this class is instantiated
    instanceCount++
  }

  // Use one method to create two different types of button
  // 1. If `willCount` is true, the name of the button will change
  //    on every click
  // 2. If `willCount` is falsy, the name of the button will change
  //    only once. 
  // In both cases, however, this.setState() will be called, and this 
  // will trigger a new call to render()
  getButton(willCount) {
    const clickEventListener = willCount
                              ? this.incrementOnClick
                              : this.singleUseClick
    const name = willCount
                ? this.state.incrementName
                : this.state.singleUseName

    // The button format is identical. Just the name and the click
    // event listener are different.
    return (
        <button
          onClick={clickEventListener}
        >
          {name}
        </button>
    )
  }


  // Update this.state.clickCount when the counting button is clicked
  // Change the button's name accordingly.
  incrementOnClick () {
    const clickCount = this.state.clickCount + 1
    this.setState({ clickCount })
    
    const times = (clickCount === 1)
                ? "1 time"
                : `${clickCount} times`

    this.setState({ incrementName: `You clicked me ${times}` })
  }

  // Set the name of the non-counting button to exactly the same value
  // each time. This will nonetheless cause a re-render
  singleUseClick () {
    this.setState({ singleUseName: "I won't change my name again, but clicking on me still forces this class component to re-render" })
  }
 
  // Add one button of each type plus feedback fields and the
  // NestedComponent
  render() {
    return (
      <div>
        <h1>Class Component</h1>
        {this.getButton(true)}
        <br />
        {this.getButton(false)}

        <p>Instance count: {instanceCount}</p>
        <p>Class component renders: {++renderCount}</p>

        <NestedComponent
          parent="class"
        />
      </div>
    )
  }
}

export default ClassComponent