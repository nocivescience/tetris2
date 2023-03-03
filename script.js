const game_clock= 1000;
const block_side_length = 30;
const rows = 20;
const columns = 30;
const score_worth = 10;
const shapes = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],[
        [2,0,0],
        [2,2,2],
        [0,0,0]
    ],[
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ],[
        [4,4],
        [4,4]
    ],[
        [0,5,5],
        [5,5,0],
        [0,0,0]
    ],[
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],[
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]
];
const colors = [
    'white',
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];
class Piece {
    constructor(shape, ctx){
        this.shape = shape;
        this.ctx = ctx;
        this.x = Math.floor(columns/2);
        this.y = 0;
    }
    renderPiece(){
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value > 0){
                    this.ctx.fillStyle = colors[value];
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
}
class GameModel{
    constructor(ctx){
        this.ctx = ctx;
        this.fallingPiece = null;
        this.grid = this.makeStartingGrid();
    }
    makeStartingGrid(){
        let grid = [];
        for (var i = 0; i < rows; i++) {
            grid.push([]);
            for (var j = 0; j < columns; j++) {
                grid[i].push(0);
            }
        }
        return grid;
    }
    collision(candidate=null){
        const shape= candidate || this.fallingPiece.shape;
        const n= shape.length;
        for(let j=0; j<n; j++){
            for(let i=0; i<n; i++){
                if(shape[j][i] > 0){
                    let p=x+j;
                    let q=y+i;
                    if(p>=0&&p<rows&&q<columns){
                        if(this.grid[p][q] > 0){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        }
        return false;
    }
    renderGameState(){
        for(let i=0; i<rows; i++){
            for(let j=0; j<columns; j++){
                this.ctx.fillStyle = colors[this.grid[i][j]];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
        if(this.fallingPiece!==null){
            this.fallingPiece.renderPiece();
        }
    }
    moveDown(){
        if(this.fallingPiece!==null){
            this.renderGameState();
            return
        }else if(this.collision(this.fallingPiece.x, this.fallingPiece.y+1)){
            const shape=this.fallingPiece.shape;
            const x=this.fallingPiece.x;
            const y=this.fallingPiece.y;
            shape.map((row, i) => {
                row.map((cell,j)=>{
                    let p=x+j;
                    let q=y+i;
                    if(p>=0&&p<cols&&q<rows&&cell>0){
                        this.grid[q][p]=shape[i][j];
                    }
                })
            });
            if(this.fallingPiece===0){
                alert("Game Over");
                this.grid=this.makeStartingGrid();
            }
        }else{
            this.fallingPiece.y++;
        }
        this.renderGameState();
    }
    move(right){
        if(this.fallingPiece===null){
            return;
        }
        let x=this.fallingPiece.x;
        let y=this.fallingPiece.y;
        if(right){
            if(!this.collision(x+1,y)){
                this.fallingPiece.x++;
            }
        }else{
            if(!this.collision(x-1,y)){
                this.fallingPiece.x--;
            }
        }
        this.renderGameState();
    }
    rotate(){
        if(this.fallingPiece===null){
            let shape=[...this.fallingPiece.shape.map(row=>[...row])];
            for(let y=0; y<shape.length; ++y){
                for(let x=0; x<y; x++){
                    [shape[y][x], shape[x][y]] = [shape[x][y], shape[y][x]];
                }
            }
            shape.forEach(row=>row.reverse());
            if(!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)){
                this.fallingPiece.shape=shape;
            }
        }
        this.renderGameState();
    }
}
let canvas=document.getElementById("game-canvas");
let scoreboard=document.getElementById("scoreboard");
let ctx=canvas.getContext("2d");
ctx.scale(block_side_length, block_side_length);
let model=new GameModel(ctx);
let score=0;
setInterval(()=>{
    newGameState();
}, game_clock);
let newGameState=()=>{
    fullSend();
    if(model.fallingPiece===null){
        const rand=Math.floor(Math.random()*shapes.length);
        model.fallingPiece=new Piece(shapes[rand], ctx);
        model.moveDown()
    }else{
        model.moveDown();
    }
};
const fullSend=()=>{
    const allFilled=(row)=>{
        for (let x of row) {
            if(x===0){
                return false;
            }
        }
        return true;
    }
    for(let i=0;i<model.grid.length;i++){
        if(allFilled(model.grid[i])){
            model.grid.splice(i,1);
            model.grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            score++;
            scoreboard.innerHTML=score;
        }
    }
    scoreboard.innerHTML=`Score: ${score}`;
}
document.addEventListener("keydown", event=>{
    event.preventDefault();
    switch(event.key){
        case 'w':
            model.rotate();
            break;
        case 'a':
            model.move(false);
            break;
        case 's':
            model.moveDown();
            break;
        case 'd':
            model.move(true);
            break;
    }
})
