function Minesweeper(ctx, cells, mines) {
    this.ctx = ctx;
    this.cells = cells;
    this.mines = mines;
    this.score = 0;
    this.grid = [];
    this.cellSize = ctx.canvas.width / this.cells;
    this.ctx.textBaseline = 'middle'; 
    this.ctx.textAlign = "center"
    this.ctx.font = this.cellSize / 1.5 + "px Arial";
    this.startHandler = () => {}
    this.stopHandler = () => {}

    this.click = (event) => {
        var rect = this.ctx.canvas.getBoundingClientRect();
        var x = Math.floor((event.clientX - rect.left) / this.cellSize);
        var y = Math.floor((event.clientY - rect.top) / this.cellSize);
        this.revealCell(x, y);
    }

    this.clear = () => {
        this.ctx.fillStyle = "#050a12";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    this.setNumberToCell = (x, y, i) => {
        this.grid[x][y] = i;

        if(i > 0) {
            this.ctx.fillStyle = "#000000"
            this.ctx.fillText(i, x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 2);
        }
    }

    this.setCell = (x, y, color, number = null) => {
        this.ctx.fillStyle = "#08141f";
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);

        if(number != null) {
            this.setNumberToCell(x, y, number);
        }
    }

    this.revealCell = (x, y) => {
        var mineCounter = 0;

        if(this.grid[x][y] == null) {
            this.score++;
        }

        if(this.grid[x][y] == -1) {
            this.setCell(x, y, "#ff0000");
            this.stopHandler("GAMEOVER");
            return;
        }

        if(this.score >= this.cells * this.cells - this.mines) {
            this.stopHandler("YOU WIN!");
        }

        for(var i = -1; i <= 1; i++) {
            for(var j = -1; j <= 1; j++) {
                var xi = x + i;
                var yj = y + j;
                if(xi >= 0 && xi < this.cells && yj >= 0 && yj < this.cells && this.grid[xi][yj] == -1) {
                    mineCounter++;
                }
            }
        }
        this.setCell(x, y, "#d29cff", mineCounter);

        if(mineCounter == 0) {
            for(var i = -1; i <= 1; i++) {
                for(var j = -1; j <= 1; j++) {
                    var xi = x + i;
                    var yj = y + j;
                    if(!(i == 0 && j == 0) && xi >= 0 && xi < this.cells && yj >= 0 && yj < this.cells && this.grid[xi][yj] == null) {
                        this.revealCell(xi, yj);
                    }
                }
            }
        }
    }

    this.generateMines = () => {
        var x = 0;
        var y = 0;

        for(var i = 0; i < this.mines; i++) {
            do {
                x = Math.floor(Math.random() * this.cells);
                y = Math.floor(Math.random() * this.cells);
            } while(this.grid[x][y] == -1);
            this.grid[x][y] = -1; 
        }
    }

    this.initCells = () => {
        this.clear();
        this.grid = Array(this.cells).fill().map(() => Array(this.cells).fill(null))
        this.score = 0;

        for(var x = 0; x < this.cells; x++) {
            for(var y = 0; y < this.cells; y++) {
                this.setCell(x, y, "#481474");       
            }
        }   
    }

    this.start = () => {
        this.initCells();
        this.generateMines();
        this.startHandler();
    }
}