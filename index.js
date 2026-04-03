const board = document.querySelector('.board');

 const blockSize = 30;

const cols = Math.floor(board.clientWidth / blockSize);

const rows = Math.floor(board.clientHeight / blockSize);

for(let i= 0 ; i< rows*cols; i++){

    const block = document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
}