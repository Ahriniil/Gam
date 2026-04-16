/* main.js - Полный код с подключенными World и Plates */

import { World } from './World.js';
import { Plates } from './Plates.js';
import { Minerals } from './Minerals.js';
import { Cursor } from './Cursor.js';
import { Pickaxe } from './Pickaxe.js';
import { HUB } from './HUB.js';
import { Inventions } from './Inventions.js';

class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        
        // Хранилище событий
        this.events = {};

        // Хранилище систем
        this.systems = {
            world: null,
            plates: null,
            minerals: null,
            hub: null,
            pickaxe: null,
            music: null,
            textures: null,
            materials: null,
            inventions: null
        };

        this.lastTime = 0;
        
        // Запуск
        this.init();
    }

    // --- СИСТЕМА СОБЫТИЙ ---
    on(name, listener) {
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push(listener);
    }

    off(name, listenerToRemove) {
        if (!this.events[name]) return;
        this.events[name] = this.events[name].filter(l => l !== listenerToRemove);
    }

    emit(name, data) {
        if (!this.events[name]) return;
        this.events[name].forEach(listener => listener(data));
    }

    // --- ИНИЦИАЛИЗАЦИЯ ---
    async init() {
        console.log("Core: Инициализация...");

        // 1. Создаем Мир (Canvas)
        this.systems.world = new World(this);
        this.systems.plates = new Plates(this);
        this.systems.minerals = new Minerals(this); 
        this.systems.cursor = new Cursor(this);     
        this.systems.pickaxe = new Pickaxe(this);
        this.systems.hub = new HUB(this);
        this.systems.inventions = new Inventions(this);

        console.log("Core: Готов к работе.");
        this.start();
    }

    start() {
        this.emit('game_start', { timestamp: Date.now() });
        requestAnimationFrame((time) => this.loop(time));
    }

    // --- ИГРОВОЙ ЦИКЛ ---
    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (this.systems.world) this.systems.world.draw();
        
        if (this.systems.plates) this.systems.plates.draw();

        if (this.systems.minerals) this.systems.minerals.draw();
        
        if (this.systems.cursor) this.systems.cursor.draw();

        requestAnimationFrame((t) => this.loop(t));
    }
}

const game = new Game();