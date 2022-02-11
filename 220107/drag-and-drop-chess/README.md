# Drag and Drop Demo

This repository demonstrates how drag and drop can be implemented in both a desktop browser and on a touch screen.

It allows you to move virtual chess pieces on a virtual board but **it does play chess**. It will not limit pieces to legal chess moves. You can move pieces to any square, including squares that currently contain a piece of the same colour.

[Check out the demo](https://dciforks.github.io/drag-and-drop/).

## Things to note

1. In the drag.js file you can find powerful generic functions for working with drag and drop:

  * startTracking() allows you to start a drag and drop operation and follow it through to completion. In this demo, the default drag action is used. A custom drop action is provided to snap the dragged chess piece into place when the mouse or touch action ends.

  * detectMovement allows you to trigger one action if the user clicks on a DOM element, and another if the user starts to drag it.

    (Not used in this demo.)

2. The `startTracking` function is triggered by mouse events on a desktop computer, and by touch events on a touch screen. It then sets up the appropriate event listeners, for mouse or for touch. There is one listener for movement events (`mousemove` or `touchmove`) and one for "drop" events (`mouseup` or `touchend`).

    The `startTracking` function adds these event listeners to the entire `document.body`, so that the piece can be dragged and dropped anywhere.

3. The chess pieces are `position`ed `absolute`ly with respect to the `div#game` element. The `defaultDragAction` function called by the `startTracking` function creates a closure in which an offset is calculated which converts the current mouse position to the position of the top-left corner of the dragged piece, relative to its parent. This is done automatically, so you don't need to think about it.

    The `drag` function returned by `defaultDragAction` can then use this precalculated offset each time it is called for a `mousemove` or `touchmove` event.

4. The app uses [_event delegation_](https://www.geeksforgeeks.org/event-delegation-in-javascript/). There are only two `addEventListener` calls, one for `mousedown` (for desktops and laptops) and one for `touchstart` (for touch screens). Both are applied to a single element — `div#game` — which is the parent of all the draggable pieces, and both trigger the `startDrag` listener function.

    When you press a piece, the mouse or touch event is captured by the `div#game` element; the `target` of the event is the particular piece that you tapped. All chess piece elements have a `"piece"` class, so the code at the start of the `startDrag` function can easily detect if the element that you tapped is a chess piece, and if so, it will proceed to drag it.

    ```javascript
    function startDrag(event) {
      const piece = event.target
      if (!piece.classList.contains("piece")) {
        // Ignore clicks on the board itself, or on the game container div
        return
      }

      // ... code to drag `piece` goes here
    }```

5. When not being dragged, pieces are position using classes: one class to fix the column and one class to fix the row. These classes are defined in a CSS file. During dragging, the position of a piece is set by inline CSS, which takes priority over rules stored in an external file.

6. When a piece is dropped, it needs to snap to the square that the mouse or touch is currently pointing at. A `mouseup` event contains properties that indicate the position of the mouse, but a `touchend` event has no such information, as the contact with the screen has ended at this point.

    For this reason, the `placePiece` function that is called for the drop event calculates backwards from the current position of the dragged piece to the point which must have been under the mouse/touch at that moment.

    It then converts that location into column and row indices, and uses these to decide which column class and which row class to apply to the piece, so that it adopts its new position.

7. The removeFrom.js script contains an array utility function which makes it easy to remove specific entries from an array. Here, it is used to remove the classes that set the old column and row for a piece that has just been moved to a new column and row.

8. Because this demo does not pretend to be an actual chess game, the legality and even the practicality of the new position is ignored.
