import  { useState } from 'react'


let totalRenders = 0
const rendersByComponent = {}
// will become { "class": <integer>, "function": <integer> }



function NestedComponent(props) {
  const { parent } = props
  const [ toggled, setToggled ] = useState(false)
  const renderName = `Nested ${parent} component renders:`

  const renders = ++ rendersByComponent[parent]       // 1 + NaN: falsy
                  || (rendersByComponent[parent] = 1)
                  


  function toggleState () {
    setToggled(!toggled)
  }


  return (
    <div className="nested">
      <h2>Nested Component</h2>
        <button
          onClick={toggleState}
          className={toggled?"toggled":""}
        >
          Toggle Me
        </button>

        <p>{renderName} {renders}</p>
        <p>Total nested renders: {++totalRenders}</p>
    </div>
  );
}


export default NestedComponent ;
