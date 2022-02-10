// rest operator (parameters)
// spread operator (arguments)

// shim = a piece of hand-made code to replace something missing

function alert(...arg) { // this is a shim
  console.log(...arg)
}


const array = [1,2,3]

function test(array) {
  // alert(array)
  // console.log("array in spread:", array)
  alert("a", "b", "c")
}

test(array)

console.log("this:", this)