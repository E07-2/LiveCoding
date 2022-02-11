/**
 * Demonstration of dragging and dropping both on a desktop computer and
 * on a smartphone.
 */


// Define the board container element,
const game = document.getElementById("game")



// PLACING THE PIECES // PLACING THE PIECES // PLACING THE PIECES //

/** Place the pieces for the start of the game.
 *  In the HTML file, every piece has a class with the following
 *  elements...
 *
 *    "piece <colour>-<type>"
 *
 *  ... where <colour> may be "black" or "white", and <typ> may be
 *  "king", "queen", "bishop", "knight", "rook" or "pawn".
 *
 * Example: "piece black-pawn"
 *
 * The placePieces function adds two more classes, one for the column
 * ("c-X") and one for the row ("r-Y"), where X is a letter from a - h
 * and Y is a number from 1 - 8.
 *
 * This is an Immediately Invoked Function Expression (IIFE):
 * https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
;(function placePieces(){
  const pieces = Array.from(document.querySelectorAll(".piece"))
  // pieces are arranged in order in the HTML file, so their
  // index % 8 will define which column they should appear in.

  pieces.forEach(( piece, index ) => {
    const className = piece.className
    const isWhite = className.includes("white-")
    const hyphenOffset = className.indexOf("-")
    const isPawn = className.slice(hyphenOffset + 1) === "pawn"

    // Rows can be hard-coded by colour
    let row = ( isPawn )
            ? ( isWhite ? "r-2" : "r-7" )
            : ( isWhite ? "r-1" : "r-8" )

    // Column needs to be calculated from index
    let column = getClass("column", index)

    piece.classList.add(column, row)
  })
})() 


/** Called by placePieces and placePiece
 *
 * @param {String}  type is one of:
 *                  "king", "queen", "bishop", "knight", "rook". "pawn"
 * @param {integer} index has a value between 0 and 7
 *
 * @returns         a string with the format "c-X" or "r-Y", where X is
 *                  a letter from a - h and Y is a number from 1 - 8.
 */
function getClass(type, index) {
  if (type === "row") {
    return "r-" + (8 - index)
  } else {
    return "c-" + ("abcdefgh"[index % 8])
  }
}



/** Called by placePiece when a piece is moved from one square to
 *  another, to identify which classes define columns and rows.
 *
 *  Returns true for strings with the format "c-X" or "r-Y", where
 *  X is a letter from a - h and Y is i number from 1 - 8
 */
const findSquareClasses = (className) => (
  /^(r-\d|c-[abcdefgh])$/.test(className)
)



// DRAGGING AND DROPPING // DRAG AND DROP//DRAGGING AND DROPPING //

/**  Use event delegation to handle mouse events on the chess pieces
* https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation
*
* Add a single event listener to the game div itself. The startDrag
* callback function will receive an event with a <target> property,
* indicating exactly which piece (or the board itself) was clicked.
*/
game.addEventListener("mousedown", startDrag)
game.addEventListener("touchstart",startDrag)



function startDrag(event) {
  const piece = event.target

  if (!piece.classList.contains("piece")) {
    // Ignore clicks on the board itself, or on the game container div
    return
  }

  // Stop the browser from dragging a ghost image
  event.preventDefault()

  // Add a temporary class to change the piece's z-index
  piece.classList.add("dragging");

  // Get the position and dimensions of the game board just in time
  // (because the player may have resized the window).
  const boardSize = game.getBoundingClientRect()

  // Calculate an offset which will be used to determine which column
  // and row to drop a dragged piece into, taking into account the 
  // position and dimensions of the board
  //
  // Find where the user clicked on the page...
  const { x, y } = getPageXY(event)
  // ... and the element's top and left...
  const { left, top } = piece.getBoundingClientRect()
  // ... and take into account the top left of the parent div#game
  offset = {
    x: x - left - boardSize.left,
    y: y - top - boardSize.top
  }

  // Create a callback for when the drag operation ends
  const drop = (event) => placePiece(piece, boardSize, offset)
 
  startTracking({ event, drop })
}



/** Called when the drag action ends
 * 
 * @param {DOMElement} piece: the piece that was dragged
 * @param {DOMRect}    boardSize = game.getBoundingClientRect()
 *                     { ..., width: Number, ...}
 * @param {Object}     offset adjustment from top left of piece to
 *                     last known mouse/touch point
 *                     { x: Number, y: Number }
 */
function placePiece(piece, boardSize, offset) {
  // Remove the temporary "dragging" class that sets the z-index...
  piece.classList.remove("dragging")
  // ... and the two classes that defined the piece's previous column
  // and row
  const classList = Array.from(piece.classList)
  removeFrom(classList, findSquareClasses, true)

  // Find which column and row the mouse/touch is currently in.
  // On touchEnd, no location is provided, so this must be calculated
  // from the position to which the piece was just dragged to.
  let { x, y } = piece.getBoundingClientRect()
  x += offset.x
  y += offset.y

  // Constrain piece to board
  let { width } = boardSize // identical to boardSize.height
  const square = width / 8
  width *= 0.9999999 // ensure x and y are not exactly on the far edge
  x = Math.max(0, Math.min(x, width))
  y = Math.max(0, Math.min(y, width))

  // Convert this position to a column and a row, manifested as classes
  const column = getClass("column", Math.floor(x / square))
  const row    = getClass("row", Math.floor(y / square))
  classList.push(column, row)

  // Apply the new classes
  piece.className = classList.join(" ")

  // Remove the inline style that was used while dragging.
  piece.setAttribute('style', '')
}