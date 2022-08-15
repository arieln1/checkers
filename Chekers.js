const body = document.querySelector('body')
const darkSquares = document.getElementsByClassName("darkwood-square") 
const allBlackMan = document.getElementsByClassName("black-man")
const allWhiteMan = document.getElementsByClassName("white-man")
const resignBtn = document.getElementById("resign-btn")
const drawBtn = document.getElementById("draw-btn")
const modal = document.getElementById("modal")
const h3Modal = document.getElementById("h3-modal")
const h3Draw = document.getElementById("h3-draw")
const okBtn = document.getElementById("ok-btn")
const drawModal = document.getElementById("draw-modal")
const noBtn = document.getElementById("no-btn")
const yesBtn = document.getElementById("yes-btn")
drawBtn.addEventListener("click", ()=>{
    drawModal.className = "modal"
    h3Draw.innerHTML = (turns%2 === 0?"black":"white") + " want to draw, do you agree"
})
resignBtn.addEventListener("click", ()=>{
    modal.className = "modal"
    h3Modal.innerHTML = (turns%2 === 0?"black":"white")+ " resign"
})
okBtn.addEventListener("click",()=>{
    modal.className="none"
    resetBoard()
})
noBtn.addEventListener("click",()=>{
    drawModal.className="none"
})
yesBtn.addEventListener("click",()=>{
    drawModal.className="none"
    modal.className = "modal"
    h3Modal.innerHTML = "Draw by agreement"
})

let turns = 0
function createBoard()
{
    const divBoard = document.createElement('div')
    divBoard.className = 'grid'
    body.appendChild(divBoard)  
    for(let i = 0;i<8;i++){
        for(let j = 0;j<8;j++){
            const newDivSquare = document.createElement('div')
            if(i%2 === 0){
                newDivSquare.className = j%2 ===0?'lightwood-square':'darkwood-square'
                newDivSquare.id = j%2 ===0?"":`${i+1}${j+1}`
            }
            else{
                newDivSquare.className =j%2 === 0?'darkwood-square':'lightwood-square'
                newDivSquare.id = j%2 ===0?`${i+1}${j+1}`:""
            }
            divBoard.appendChild(newDivSquare)
            }
    }
    for(let i = 0;i<darkSquares.length;i++){
        const newDivCircle = document.createElement('div')
        if(i<12){
            newDivCircle.className = "white-man"
            darkSquares[i].appendChild(newDivCircle)}
        else if(i > 19){
            newDivCircle.className = "black-man"
            darkSquares[i].appendChild(newDivCircle)}
            
       }
                
}
function resetBoard(){
    const divBoard = document.querySelector('.grid')
    divBoard.remove()
    createBoard()
    turns = 0
    choosePiece(allBlackMan)
}
createBoard()
function choosePiece(AllwhiteOrBlackMan){
    if(isAllCatured()){
        modal.className ="modal"
    }
    else if(isStalemate()){
        modal.className ="modal"
        h3Modal.innerHTML = "draw by stalmate"
    }
    for(let whiteOrBlackMan of AllwhiteOrBlackMan){
        whiteOrBlackMan.addEventListener("click",(event)=>
        {
        event.stopPropagation()
        const currentPieceParent = whiteOrBlackMan.parentElement
        if(isEmptySquare(currentPieceParent) || isSkipAvailable(currentPieceParent)){
            whiteOrBlackMan.classList.add('clicked')
            for(let whiteOrBlackMan of AllwhiteOrBlackMan){
                whiteOrBlackMan.replaceWith(whiteOrBlackMan.cloneNode(true));}
            MovingPiece(currentPieceParent)}
        else{
            for(let whiteOrBlackMan of AllwhiteOrBlackMan){
                whiteOrBlackMan.replaceWith(whiteOrBlackMan.cloneNode(true));}
            choosePiece(AllwhiteOrBlackMan)}
        })
    }
}

function MovingPiece(currentPieceParent)
{
    for(let darkSquare of darkSquares){
        darkSquare.addEventListener('click',()=>
        {
                let pieces = burntWaitingList(turns%2===0?allBlackMan:allWhiteMan)
                if(isMoveLegal(currentPieceParent,darkSquare)){
                    currentPieceParent.children[0].classList.remove('clicked')
                    darkSquare.appendChild(currentPieceParent.children[0])
                    if(!isPieceCaptured(currentPieceParent,darkSquare) && pieces.length > 0){
                        for(piece of pieces){
                            piece.remove()
                        }
                    }
                    coronation(darkSquare)
                    for(let darkSquare of darkSquares){
                        darkSquare.replaceWith(darkSquare.cloneNode(true));}
                    turn_change()
                }
        })
    }
}
choosePiece(allBlackMan)
function isMoveLegal(currentPieceParent,square){
    if (currentPieceParent !== null && square.children.length === 0){
        idDiffrence = currentPieceParent.id - square.id
        if((((turns % 2 === 0 && (idDiffrence === 9 || idDiffrence === 11)) || (turns % 2 !== 0 && (idDiffrence === -9 || idDiffrence === -11)))||((currentPieceParent.children[0].classList[1] === "king")&& (idDiffrence === 9 || idDiffrence === 11 || idDiffrence === -9 || idDiffrence === -11))) && isEmptySquare(currentPieceParent)){
            return true
        }
        else if ((((turns % 2 === 0 && (idDiffrence === 18 || idDiffrence === 22)) || (turns % 2 !== 0 && (idDiffrence === -18 || idDiffrence === -22)))||((currentPieceParent.children[0].classList[1] === "king")&& (idDiffrence === 18 || idDiffrence === 22 || idDiffrence === -18 || idDiffrence === -22))) && isSkipAvailable(currentPieceParent)){
            return true
        }
            
    }
    return false
}
function turn_change(){
    turns++
    if (turns%2==0)
        choosePiece(allBlackMan)
    else
        choosePiece(allWhiteMan)    
}
function isEmptySquare(currentPieceParent){
    
    if (currentPieceParent != null){
        const leftSquare = document.getElementById(turns%2 === 0?`${currentPieceParent.id - 11}`:`${(currentPieceParent.id*1) + 11}`)
        const rightSquare = document.getElementById(turns%2 === 0?`${currentPieceParent.id - 9}`:`${(currentPieceParent.id*1) + 9}`)
        if(currentPieceParent.children[0].classList[1] === "king"){
            const backLeftSquare = document.getElementById(turns%2 !== 0?`${currentPieceParent.id - 11}`:`${(currentPieceParent.id*1) + 11}`)
            const backRightSquare = document.getElementById(turns%2 !== 0?`${currentPieceParent.id - 9}`:`${(currentPieceParent.id*1) + 9}`)
            if((backLeftSquare != null && backLeftSquare.children.length == 0 )|| (backRightSquare != null && backRightSquare.children.length == 0))
            return true
        }
        if((leftSquare != null && leftSquare.children.length == 0 )|| (rightSquare != null && rightSquare.children.length == 0))
            return true
    }
    return false
}
function isSkipAvailable(currentPieceParent){
    
    if (currentPieceParent != null){
        const leftSquare = document.getElementById(turns%2 === 0?`${currentPieceParent.id - 11}`:`${(currentPieceParent.id*1) + 11}`)
        const rightSquare = document.getElementById(turns%2 === 0?`${currentPieceParent.id - 9}`:`${(currentPieceParent.id*1) + 9}`)
        const skipLeftSquare = document.getElementById(turns%2 === 0?`${currentPieceParent.id - 22}`:`${(currentPieceParent.id*1) + 22}`)
        const skipRightSquare = document.getElementById(turns%2 === 0?`${currentPieceParent.id - 18}`:`${(currentPieceParent.id*1) + 18}`)
        if(currentPieceParent.children[0].classList[1] === "king"){
            const backLeftSquare = document.getElementById(turns%2 !== 0?`${currentPieceParent.id - 11}`:`${(currentPieceParent.id*1) + 11}`)
            const backRightSquare = document.getElementById(turns%2 !== 0?`${currentPieceParent.id - 9}`:`${(currentPieceParent.id*1) + 9}`)
            const backSkipLeftSquare = document.getElementById(turns%2 !== 0?`${currentPieceParent.id - 22}`:`${(currentPieceParent.id*1) + 22}`)
            const backSkipRightSquare = document.getElementById(turns%2 !== 0?`${currentPieceParent.id - 18}`:`${(currentPieceParent.id*1) + 18}`)
            if(((backSkipLeftSquare != null && backSkipLeftSquare.children.length == 0 ) && (backLeftSquare.children.length !== 0 && backLeftSquare.children[0].classList[0] === (turns%2===0?"white-man":"black-man")))|| ((backSkipRightSquare != null && backSkipRightSquare.children.length == 0) && (backRightSquare.children.length !== 0 && backRightSquare.children[0].classList[0] === (turns%2===0?"white-man":"black-man")))){
                return true
            }
        }
        if(((skipLeftSquare != null && skipLeftSquare.children.length == 0 ) && (leftSquare.children.length !== 0 && leftSquare.children[0].classList[0] === (turns%2===0?"white-man":"black-man")))|| ((skipRightSquare != null && skipRightSquare.children.length == 0) && (rightSquare.children.length !== 0 && rightSquare.children[0].classList[0] === (turns%2===0?"white-man":"black-man")))){
            return true
        }
        
    }
    return false
}
function isPieceCaptured(currentPieceParent,darkSquare){
    let idDiffrence = currentPieceParent.id - darkSquare.id
    let currentPiece = darkSquare.children[0]
    if(idDiffrence === (turns%2===0?22:-22) || (currentPiece.classList[1] === "king" && (idDiffrence === 22 || idDiffrence === -22))){
        const leftSquare = document.getElementById(idDiffrence === 22?`${currentPieceParent.id - 11}`:`${(currentPieceParent.id*1) + 11}`)
        leftSquare.children[0].remove()
        return true;
    }
    else if(idDiffrence === (turns%2===0?18:-18) || (currentPiece.classList[1] === "king" && (idDiffrence === 18 || idDiffrence === -18))){
        const rightSquare = document.getElementById(idDiffrence === 18?`${currentPieceParent.id - 9}`:`${(currentPieceParent.id*1) + 9}`)
        rightSquare.children[0].remove()
        return true;
    }
    return false;
}
function isStalemate(){
    for(let blackMan of allBlackMan){
        if(isEmptySquare(blackMan.parentElement) || isSkipAvailable(blackMan.parentElement))
            return false
    }
    for(let whiteMan of allWhiteMan){
        if(isEmptySquare(whiteMan.parentElement) || isSkipAvailable(whiteMan.parentElement))
            return false
    }
    return true
}
function isAllCatured(){
    if(allBlackMan.length === 0){
        h3Modal.innerHTML = "white won"
        return true
    }
    else if (allWhiteMan.length === 0){
        h3Modal.innerHTML = "black won"
        return true;
    }
    return false;
}
function burntWaitingList(AllwhiteOrBlackMan){
    let pieces = []
    for(let whiteOrBlackMan of AllwhiteOrBlackMan){
        if(isSkipAvailable(whiteOrBlackMan.parentElement))
        {
            pieces.push(whiteOrBlackMan)
        }
    }
    return pieces
}
function coronation(currentPieceParent){
    if (currentPieceParent.id*1 <= 18 && currentPieceParent.children.length > 0 && currentPieceParent.children[0].className === "black-man"){
        currentPieceParent.children[0].classList.add("king")

    } 
    else if (currentPieceParent.id*1 >= 81 && currentPieceParent.children.length > 0 && currentPieceParent.children[0].className === "white-man"){
        currentPieceParent.children[0].classList.add("king")
    } 
}
