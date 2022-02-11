// ARRAY UTILITY FUNCTION // ARRAY UTILITY // ARRAY UTILITY FUNCTION //

/** Removes elements that are matched by <item> from an array. If there
 *  are no matching items, array will be left unchanged.
 *
 * @param {Array}   array
 * @param {Any}     item may be:
 *                  • a specific item to remove
 *                  • an array of items to remove
 *                  • function which will return true when called with
 *                    any item that is to be removed.
 * @param {Boolean} removeAll: if true, all entries matched by <item>
 *                  will be removed. If not, only the first such entry
 *                  will be removed.
 * @returns the integer number of removed items.
 */
 function removeFrom (array, item, removeAll) {
  let removed = 0

  // If `item` is an array of items or functions, treat recursively
  if (Array.isArray(item)) {
    removed = item.reduce((excess, entry) => {
      excess += removeFrom(array, entry, removeAll)
      return excess
    }, 0)

    return removed
  }

  // If we get here, item is an individual items or function
  let index
    , found

  do {
    if (typeof item === "function") {
      index = array.findIndex(item)
    } else {
      index = array.indexOf(item)
    }

    found = !(index < 0)
    if (found) {
      array.splice(index, 1)
      removed += 1
    }
  } while (removeAll && found)

  return removed
}