const header = document.getElementById("header")
const feedback = document.querySelector(".feedback")
header.style.color = "#F00"

const list = document.querySelector("ul")
list.addEventListener('click', treatClick)

function treatClick(event){
  console.log("event:", event.target.innervvText)
  if (event.target.tagName !== "LI") {
    return
  }

  const alreadySelected = list.querySelector(".selected")
  if (alreadySelected) {
    alreadySelected.classList.remove("selected")
  }
  const listItem = event.target

  listItem.classList.add("selected")

  feedback.innerText = `You clicked on ${listItem.innerText}.`
}