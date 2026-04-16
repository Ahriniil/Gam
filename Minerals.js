/* Minerals.js - Система ресурсов в изометрии */

export class Minerals {
    constructor(game) {
        this.game = game;
        
        // Хранилище минералов: ключ = "x_y" (например "3_5"), значение = объект
        // Так быстрее искать, есть ли камень на клетке
        this.data = {}; 

        // Настройки типов (легко редактировать форму и цвет тут)
        this.types = {
            stone:  { color: '#B0BEC5', colorDark: '#78909C', hp: 3, name: 'Stone', height: 20 },
            coal:   { color: '#424242', colorDark: '#212121', hp: 5, name: 'Coal', height: 18 },
            copper: { color: '#FF9800', colorDark: '#E65100', hp: 8, name: 'Copper', height: 25 }
        };

        this.spawn();
    }

    spawn() {
        const plates = this.game.systems.plates;
        if (!plates) return;

        this.data = {}; // Очистка

        for (let y = 0; y < plates.rows; y++) {
            for (let x = 0; x < plates.cols; x++) {
                // Шанс 25% на появление ресурса
                if (Math.random() < 0.25) {
                    this.createMineral(x, y);
                }
            }
        }
    }

    createMineral(x, y) {
        const rand = Math.random();
        let type = 'stone';

        if (rand > 0.90) type = 'copper';
        else if (rand > 0.70) type = 'coal';

        // Создаем уникальный ключ для клетки
        const key = `${x}_${y}`;
        
        this.data[key] = {
            x: x,
            y: y,
            type: type,
            currentHp: this.types[type].hp,
            maxHp: this.types[type].hp,
            ...this.types[type]
        };
    }

    // Метод получения минерала по координатам
    getMineralAt(x, y) {
        return this.data[`${x}_${y}`];
    }

    // Метод удаления минерала (когда сломали)
    removeMineral(x, y) {
        delete this.data[`${x}_${y}`];
    }

    draw() {
        const plates = this.game.systems.plates;
        if (!plates) return;

        const ctx = this.game.systems.world.ctx;
        const world = this.game.systems.world;

        // Центрирование (должно совпадать с Plates.js)
        const centerX = world.canvas.width / 2;
        const centerY = world.canvas.height / 4;

        // Рисуем все минералы
        for (let key in this.data) {
            const m = this.data[key];

            // 1. Считаем экранные координаты центра тайла
            const screenX = centerX + (m.x - m.y) * (plates.blockWidth / 2);
            const screenY = centerY + (m.x + m.y) * (plates.blockHeight / 2);

            // Смещаем чуть выше, чтобы стоял на поверхности, а не внутри
            const drawY = screenY + (plates.blockHeight / 2);

            // 2. Вызываем отрисовку формы
            this.drawShape(ctx, screenX, drawY, m);
        }
    }

    /**
     * Здесь рисуем форму. Сейчас это "Кристалл" (пирамидка).
     * В будущем можно менять этот метод для других форм.
     */
    drawShape(ctx, x, y, mineral) {
        const w = 20; // Ширина кристалла
        const h = mineral.height; // Высота зависит от типа

        ctx.beginPath();
        // Рисуем треугольник (пик)
        ctx.moveTo(x, y - h);           // Вершина
        ctx.lineTo(x + w/2, y);         // Правый угол
        ctx.lineTo(x, y + w/3);         // Низ (центр)
        ctx.lineTo(x - w/2, y);         // Левый угол
        ctx.closePath();

        ctx.fillStyle = mineral.color;
        ctx.fill();

        // Рисуем грань тени (для объема)
        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x, y + w/3);
        ctx.lineTo(x + w/2, y);
        ctx.closePath();
        ctx.fillStyle = mineral.colorDark; // Более темный цвет грани
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}