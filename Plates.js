/* Plates.js - Изометрическая платформа с толщиной */

export class Plates {
    constructor(game) {
        this.game = game;

        // --- НАСТРОЙКИ РАЗМЕРОВ ---
        this.blockWidth = 64;   // Ширина ромба
        this.blockHeight = 32;  // Высота ромба
        this.thickness = 15;    // Толщина плиты (земли под травой)

        this.cols = 10;
        this.rows = 10;
        
        // --- НАСТРОЙКИ ЦВЕТОВ (Легко менять тут) ---
        this.colors = {
            topBase: '#4CAF50',  // Трава (основа)
            topDark: '#388E3C',  // Трава (темные пятна)
            sideRight: '#5D4037', // Земля (правая грань, тень)
            sideLeft: '#795548'   // Земля (левая грань, светлее)
        };

        this.grid = []; 
        this.generate();
    }

    generate() {
        this.grid = [];
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                // 20% шанс на темный квадрат
                row.push(Math.random() < 0.2 ? 1 : 0);
            }
            this.grid.push(row);
        }
    }

    draw() {
        if (!this.game.systems.world) return;

        const ctx = this.game.systems.world.ctx;
        const { width, height } = this.game.systems.world.canvas;

        // Центрирование карты
        const centerX = width / 2;
        const centerY = height / 4; 

        // Рисуем тайлы в правильном порядке (сверху вниз)
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                
                // Координаты центра верха текущего тайла
                const screenX = centerX + (x - y) * (this.blockWidth / 2);
                const screenY = centerY + (x + y) * (this.blockHeight / 2);

                const isDark = this.grid[y][x] === 1;

                // 1. Рисуем ТОЛЩИНУ (Стенки)
                // Рисуем их только если тайл находится на переднем краю, 
                // иначе стенки будут перекрыты другими тайлами.
                
                // Если это последний ряд -> рисуем Левую нижнюю грань
                if (y === this.rows - 1) {
                    this.drawSide(ctx, screenX, screenY, 'left');
                }

                // Если это последняя колонка -> рисуем Правую нижнюю грань
                if (x === this.cols - 1) {
                    this.drawSide(ctx, screenX, screenY, 'right');
                }

                // 2. Рисуем ВЕРХ (Траву)
                this.drawTop(ctx, screenX, screenY, isDark);
            }
        }
    }

    // Рисует верхний ромб
    drawTop(ctx, x, y, isDark) {
        ctx.beginPath();
        ctx.moveTo(x, y); // Верх
        ctx.lineTo(x + this.blockWidth / 2, y + this.blockHeight / 2); // Право
        ctx.lineTo(x, y + this.blockHeight); // Низ
        ctx.lineTo(x - this.blockWidth / 2, y + this.blockHeight / 2); // Лево
        ctx.closePath();

        ctx.fillStyle = isDark ? this.colors.topDark : this.colors.topBase;
        ctx.fill();
        
        // Легкая обводка для выделения тайлов (опционально)
        // ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        // ctx.stroke();
    }

    // Рисует боковые грани (землю)
    drawSide(ctx, x, y, side) {
        const hw = this.blockWidth / 2;  // Half Width
        const hh = this.blockHeight / 2; // Half Height
        const h = this.thickness;        // Высота стенки

        ctx.beginPath();
        
        if (side === 'right') {
            // Правая грань (от низа ромба вправо-вверх)
            // Точки: Низ ромба -> Право ромба -> Право+Глубина -> Низ+Глубина
            ctx.moveTo(x, y + this.blockHeight); 
            ctx.lineTo(x + hw, y + hh);
            ctx.lineTo(x + hw, y + hh + h);
            ctx.lineTo(x, y + this.blockHeight + h);
            
            ctx.fillStyle = this.colors.sideRight;
        } else {
            // Левая грань (от низа ромба влево-вверх)
            // Точки: Низ ромба -> Лево ромба -> Лево+Глубина -> Низ+Глубина
            ctx.moveTo(x, y + this.blockHeight);
            ctx.lineTo(x - hw, y + hh);
            ctx.lineTo(x - hw, y + hh + h);
            ctx.lineTo(x, y + this.blockHeight + h);
            
            ctx.fillStyle = this.colors.sideLeft;
        }

        ctx.closePath();
        ctx.fill();
    }
}