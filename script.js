const nodes = document.querySelectorAll(".node")

nodes.forEach(node => {

const id = node.dataset.id

if(localStorage.getItem(id)){
node.classList.add("completed")
}

node.addEventListener("click",()=>{

node.classList.toggle("completed")

if(node.classList.contains("completed")){
localStorage.setItem(id,"done")
}else{
localStorage.removeItem(id)
}

})

})
