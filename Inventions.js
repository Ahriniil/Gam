/* Inventions.js - Система крафта и изобретений */

export class Inventions {
    constructor(game) {
        this.game = game;
        
        // Создаем интерфейс
        this.initUI();
    }

    initUI() {
        // Проверяем контейнер игры, куда будем добавлять панель
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        // 1. Создаем саму панель (Прямоугольник)
        this.panel = document.createElement('div');
        this.panel.id = 'craft-panel';

        // 2. Создаем квадрат внутри (Слот крафта)
        this.square = document.createElement('div');
        this.square.id = 'craft-square';
        
        // Добавляем иконку или символ внутрь квадрата
        const icon = document.createElement('div');
        icon.id = 'craft-icon';
        icon.innerText = '+'; // Плюс, намекающий на создание
        this.square.appendChild(icon);

        // Добавляем логику клика (пока просто вывод в консоль)
        this.square.addEventListener('click', () => this.tryCraft());

        // Собираем матрешку
        this.panel.appendChild(this.square);
        gameContainer.appendChild(this.panel);
    }

    tryCraft() {
        console.log("Inventions: Нажат слот крафта.");
        // В будущем здесь будет проверка ресурсов и создание предмета
    }
}