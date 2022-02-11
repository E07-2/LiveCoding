// MOUSE/TOUCH EVENT FUNCTIONS ///
// https://gist.github.com/blackslate/6f77d3acd2edc2a286cff6d607cf3ce8

/**
 * DETECT MOVEMENT
 * ---------------
 * Sometimes you want a simple click to perform one action and a drag
 * on the same element to perform a different action. You can create two
 * methods, (say) startDrag() and clickAction(), and use the following
 * function (plus the functions below) to determine which of the two
 * actions will be triggered.
 *
 * let dragMe = <your draggable element>
 *   , cancelDrag // set to a function that will cancel dragging
 *
 * const drop = () => {
 *   // Do whatever needs to be done when dragged element is dropped
 * }
 *
 * const startDrag = (event) => {
 *   const options = {
 *     event
 *   , drop
 *   }
 *
 *   startTracking(options)
 * }
 *
 * const checkForDrag = (event) => {
 *   event.preventDefault()
 *
 *   detectMovement(event, 10, 250)
 *   .then(() => startDrag(event) )
 *   .catch(clickAction)
 * }
 *
 * startDrag will be called if the mouse or touch point moves 10 pixels
 * or more within 250 milliseconds; clickAction will be called if there
 * is no movement within this time, or if the mouse/touch pressure is
 * released before this time.
 *
 * TRACKING
 * --------
 * When dragging an element, you generally want one function to be
 * called for any movement, and another to be triggered when the element
 * is dropped. You don't want to have to create separate code for
 * mouse events and touch events, even if these events generate
 * the current x and y positions in different ways.
 *
 * The startTracking() function allows you to provide a starting
 * event (mouseDown or touchStart) and two functions that should be
 * called: one for mousemove|touchmove and the other for mouseup|
 * touchend.
 *
 * X and Y COORDINATES
 * -------------------
 * You can use getPageXY() to get the current mouse position or the
 * position of the first touch point, without worrying about whether
 * the input is from a mouse or a touch screen.
 *
 * ===============================================================
 * NOTE FOR REACT USERS CREATING WEB APPS FOR TOUCH SCREEN DEVICES
 * ===============================================================
 * React refuses to add non-passive (cancellable) event listeners for
 * touchstart. With a passive event listener, the whole page is likely
 * to move at the same time as the dragged element, which is probably
 * not what you want.
 *
 * As a result, you should NOT use React to pass an onTouchStart
 * function the same way that you would pass an onMouseDown function to
 *  your draggable element.
 *
 * Instead, you need to apply your touchstart event listener directly
 * to the DOM element that you want to drag with useEffect, as shown
 * below.
 *
 * const dragRef = useRef()
 *
 * return (
 *   <main>
 *     <div
 *       onMouseDown={checkForDrag}
 *       ref={dragRef}
 *     />
 *   </main>
 * );
 *
 * useEffect(() => {
 *   dragMe = dragRef.current
 *   dragMe.addEventListener("touchstart", checkForDrag, false)
 * })
 */



 const getPageXY = (event) => {
  if (event.targetTouches && event.targetTouches.length) {
    event = event.targetTouches[0] || {}
  }

  return { x: event.pageX, y: event.pageY }
}



/**
 * Returns a promise which will be:
 * * resolved if the mouse or touch moves more than triggerDelta
 *   pixels in any direction
 * * rejected if the mouse is released or the touch gesture ends before
 *   moving that far, or if <timeOut> number of milliseconds elapses
 *   before any movement occurs.
 *
 * @param  {event}  event should be a mousedown or touchstart event
 * @param  {number} triggerDelta should be the number of pixels of
 *                          movement that will resolve the promise
 * @param  {number} timeOut may be a number of milliseconds. Defaults
 *                          to 250. Use 0 for no timeOut rejection.
 *
 * @return  {promise}
 */
const detectMovement = (event, triggerDelta, timeOut) => {
  const trigger2 = triggerDelta * triggerDelta
  timeOut = isNaN(timeOut) ? 250 : Math.abs(timeOut)

  function movementDetected(resolve, reject) {
    const { x: startX, y: startY } = getPageXY(event)
    const options = { event, drag, drop }
    const cancelDrag = startTracking(options)

    // Check if the mouse/touch has moved more than triggerDelta
    // pixels in any direction, and resolve promise if so.
    function drag(event) {
      const { x, y } = getPageXY(event)
      const deltaX = startX - x
      const deltaY = startY - y
      const delta2 = (deltaX * deltaX + deltaY * deltaY)

      if (delta2 > trigger2) {
        cancelDrag()
        resolve()
      }
    }

    // Reject promise if the mouse is released before the mouse/touch
    // moved triggerDelta pixels in any direction.
    function drop() {
      cancelDrag()
      reject("release")
    }

    if (timeOut) {
      setTimeout(() => reject("timeOut"), timeOut)
    }
  }

  return new Promise(movementDetected)
}



/**
 * Called by defaultDragAction
 * 
 * @param {DOMElement} element
 * @returns  element's closest parent which has a position other than
 *           static
 */
const getNonStaticParent = (element) => {
  let parent
  while (element.tagName !== "BODY" && (parent = element.parentNode)) {
    const style = getComputedStyle(parent)
    if (style.getPropertyValue("position") !== "static") {
      break
    }

    element = parent
  }

  return parent
}



/** 
 * If no drag function is supplied, move the target (or its parent)
 * with the mouse or touch. Called by startTracking.
 *
 * @param {MouseEvent | TouchEvent} event
 * @param {String?} selector
 *                  If selector is a string, it will be used to find
 *                  the closest matching parent (or the target itself)
 *                  as the element to drag
 * @param {Objec?}  offset
 *                  If offset is an object with the format
 *                  { x: <Number>, y: <Number> }, then it will be used
 *                  for defining the offset from the drag point to the
 *                  top left of the dragged element.
 * @returns         a function in a closure, which knows which target
 *                  and offset to use
 */
const defaultDragAction = (event, selector, offset) => {
  const target = (typeof selector === "string")
               ? event.target.closest(selector) // select an ancestor
               : event.target

  const offsetGiven = typeof offset === "object"
                   && !isNaN(offset.x)
                   && !isNaN(offset.y)

  if (!offsetGiven) {
    // Move target relative to its closest non-static parent
    const fix = getNonStaticParent(target)
    const { left: fixLeft, top: fixTop } = fix.getBoundingClientRect()
    const { x, y } = getPageXY(event)
    const { left, top } = target.getBoundingClientRect()
    offset = { x: left - fixLeft - x , y: top - fixTop - y }
  }

  const drag = (event) => {
    const { x, y } = getPageXY(event)
    target.style.left = (offset.x + x )+ "px"
    target.style.top =  (offset.y + y )+ "px"
  }

  return drag
}



// The prevent default function needs to be outside startTracking
// so that the exact same listener function (rather than a duplicate)
// can be  removed later.
const noDefault = (event) => event.preventDefault()



/**
 * Starts listening for a drag and drop operation, and follows it 
 * through to the end. The operation can be cancelled at any time
 * by calling the function returned by startTracking.
 *
 * @param {Object}
 *          event: may be either a MouseDown event or a TouchStart event
 *           drag: may be a custom function to call for dragging. If
 *                 not, a generic function will be used. It may also be
 *                 a CSS selector to define which parent of the clicked
 *                 target should be dragged.
 *           drop: a callback function that will be called when the
 *                 dragging stops
 *         offset: may be an object of the form { x: Number, y: Number}
 *                 to be used by the defaultDragAction function.
 *
 * @returns        a function that can be called to cancelDrag
 *                 (before it starts). However, this function will be
 *                 called automatically when the drag process ends.
 */
function startTracking({ event, drag, drop, offset }) {
  const body = document.body
  const dragOption = { passive: false } // capture is false by default

  let move
    , end

  if (event.type === "touchstart") {
    move  = "touchmove"
    end   = "touchend"
  } else {
    move  = "mousemove"
    end   = "mouseup"
  }

  switch (typeof drag) {
    case "function":
      // Use the custom function
    break
    default: // case "string":
      // Use the default function. `drag` may be a parent selector.
      drag = defaultDragAction(event, drag, offset)
    break
  }

  // cancelDrag may be called from outside, before any drag or
  // drop events have occurred, in which case `event` may be
  // undefined. If the call was triggeerd by an `end` event, then
  // the drop function will be called.
  const cancelDrag = (event) => {
    body.removeEventListener(move, drag, false)
    body.removeEventListener(end, cancelDrag, false)
    // Restore page scrolling on touch devices now that drag is over
    document.removeEventListener("touchstart", noDefault)

    if (event && typeof drop === "function") {
      drop(event)
    }
  }

  body.addEventListener(move, drag, false)
  body.addEventListener(end, cancelDrag, false)
  // Prevent the page scrolling during drag, on touch devices
  document.addEventListener("touchstart", noDefault, dragOption)

  return cancelDrag
}