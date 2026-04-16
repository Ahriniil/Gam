/* Cursor.js - Система управления курсором и выделения объектов */

export class Cursor {
    constructor(game) {
        this.game = game;

        // Координаты мыши на экране (в пикселях)
        this.screenX = 0;
        this.screenY = 0;

        // Координаты в игровом мире (какая клетка сетки выбрана)
        this.gridX = -1;
        this.gridY = -1;

        // Объект, на который наведен курсор (для будущего: мобы, предметы)
        this.hoveredObject = null; 

        // Слушаем движение мыши
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(e) {
        // Получаем позицию мыши относительно Canvas
        const rect = this.game.systems.world.canvas.getBoundingClientRect();
        this.screenX = e.clientX - rect.left;
        this.screenY = e.clientY - rect.top;

        this.updateHover();
    }

    /**
     * Пересчитывает экранные координаты в игровые
     */
    updateHover() {
        const plates = this.game.systems.plates;
        const world = this.game.systems.world;
        
        if (!plates || !world) return;

        // Нам нужно знать те же параметры смещения, что и при отрисовке Плит
        // (Важно: эти формулы должны совпадать с Plates.js)
        const centerX = world.canvas.width / 2;
        const centerY = world.canvas.height / 4; 
        
        const halfW = plates.blockWidth / 2;
        const halfH = plates.blockHeight / 2;

        // --- ОБРАТНАЯ ИЗОМЕТРИЯ (Математика) ---
        // Смещаем координаты мыши относительно центра карты
        const dx = this.screenX - centerX;
        const dy = this.screenY - centerY; // Учитываем, что верхушка ромба смещена вниз на высоту тайла

        // Формула перевода пикселей в Grid X/Y
        // Это инверсия формулы из Plates.draw()
        const rawGridX = (dy / halfH + dx / halfW) / 2;
        const rawGridY = (dy / halfH - dx / halfW) / 2;

        // Округляем до целых чисел (индекс клетки)
        this.gridX = Math.floor(rawGridX);
        this.gridY = Math.floor(rawGridY);

        // --- БУДУЩАЯ ЛОГИКА ДЛЯ ОБЪЕКТОВ ---
        // Здесь мы позже добавим проверку: "Попала ли мышь в минерал или здание?"
        // this.checkObjectsInteraction();
    }

    /**
     * Отрисовка курсора (белая обводка)
     */
    draw() {
        const plates = this.game.systems.plates;
        if (!plates) return;

        // 1. Проверяем, находится ли курсор ВНУТРИ карты
        if (this.gridX >= 0 && this.gridX < plates.cols &&
            this.gridY >= 0 && this.gridY < plates.rows) {
            
            this.drawTileHighlight(plates);
        }

        // 2. Если в будущем будет выделен объект (не плитка), рисуем рамку вокруг него
        if (this.hoveredObject) {
            // this.drawObjectHighlight();
        }
    }

    drawTileHighlight(plates) {
        const ctx = this.game.systems.world.ctx;
        const world = this.game.systems.world;

        // Снова считаем экранные координаты для отрисовки рамки
        // (Копируем логику из Plates.draw, чтобы рамка легла идеально)
        const centerX = world.canvas.width / 2;
        const centerY = world.canvas.height / 4;

        const screenX = centerX + (this.gridX - this.gridY) * (plates.blockWidth / 2);
        const screenY = centerY + (this.gridX + this.gridY) * (plates.blockHeight / 2);

        // Рисуем контур ромба
        ctx.beginPath();
        ctx.moveTo(screenX, screenY); // Верх
        ctx.lineTo(screenX + plates.blockWidth / 2, screenY + plates.blockHeight / 2); // Право
        ctx.lineTo(screenX, screenY + plates.blockHeight); // Низ
        ctx.lineTo(screenX - plates.blockWidth / 2, screenY + plates.blockHeight / 2); // Лево
        ctx.closePath();

        // Стиль курсора
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; // Полупрозрачный белый
        ctx.stroke();
        
        // Легкая подсветка внутри
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
    }
}