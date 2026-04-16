/* Pickaxe.js - Логика инструмента и взаимодействия */

export class Pickaxe {
    constructor(game) {
        this.game = game;
        
        // Характеристики кирки
        this.power = 1;     // Урон за удар
        this.canMine = true; // Есть ли кирка в руках (флаг для будущего)

        // Слушаем клик мыши по всему экрану
        window.addEventListener('mousedown', () => this.use());
    }

    use() {
        // 1. Проверка: Есть ли кирка?
        if (!this.canMine) {
            console.log("У вас нет кирки!");
            return;
        }

        // 2. Получаем данные от Курсора (куда смотрим?)
        const cursor = this.game.systems.cursor;
        if (!cursor) return;

        const tx = cursor.gridX;
        const ty = cursor.gridY;

        // 3. Проверяем, есть ли там Минерал
        const mineralsSys = this.game.systems.minerals;
        const mineral = mineralsSys.getMineralAt(tx, ty);

        if (mineral) {
            this.mine(mineral, mineralsSys);
        } else {
            console.log("Здесь пусто.");
        }
    }

    mine(mineral, system) {
        // Наносим урон
        mineral.currentHp -= this.power;
        console.log(`Удар по ${mineral.name}! HP: ${mineral.currentHp}/${mineral.maxHp}`);

        // Эффект "тряски" или удара (можно добавить визуализацию позже)

        // Если HP кончилось
        if (mineral.currentHp <= 0) {
            console.log(`Минерал ${mineral.name} добыт!`);
            
            // Удаляем из мира
            system.removeMineral(mineral.x, mineral.y);
            
            // Отправляем событие (чтобы HUB засчитал ресурсы)
            this.game.emit('mineral_mined', { type: mineral.type, amount: 1 });
        }
    }
}