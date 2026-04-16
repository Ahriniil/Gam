/* World.js - Графическое ядро (Адаптированное) */

export class World {
    constructor(game) {
        this.game = game;
        
        // Создаем Canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.display = 'block';
        
        // Добавляем canvas в контейнер игры (правая часть экрана)
        if (this.game.container) {
            this.game.container.appendChild(this.canvas);
        } else {
            console.error("World: Контейнер игры не найден!");
        }

        // Первичная установка размера
        this.resize();

        // При изменении окна браузера пересчитываем размеры
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // ВАЖНО: Берем размеры не окна, а родительского блока (#game-container)
        // Это позволяет игре корректно работать рядом с ХАБом
        this.canvas.width = this.game.container.clientWidth;
        this.canvas.height = this.game.container.clientHeight;

        // Если у нас есть игра, сообщаем ей, что размер изменился (чтобы перецентрировать карту)
        // (Опционально, если в будущем понадобится)
    }

    draw() {
        // Очистка экрана (темно-серый фон игровой зоны)
        this.ctx.fillStyle = '#222222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}