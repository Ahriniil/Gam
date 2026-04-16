/* HUB.js - Динамический интерфейс склада */

export class HUB {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('hub-container');

        // Хранилище количества ресурсов
        this.resources = {
            stone: 0,
            coal: 0,
            copper: 0
        };

        // Красивые названия для отображения
        this.displayNames = {
            stone: 'Камень',
            coal: 'Уголь',
            copper: 'Медь'
        };

        // Ссылки на активные элементы интерфейса (чтобы удалять их)
        this.uiRows = {};      // Хранит целиком строку (div)
        this.uiCounters = {};  // Хранит только цифру (span)

        this.initUI();
        
        // Подписываемся на добычу
        this.game.on('mineral_mined', (data) => this.changeResource(data.type, data.amount));
    }

    initUI() {
        if (!this.container) return;
        
        // Очищаем контейнер (на случай перезапуска)
        this.container.innerHTML = '';

        // Добавляем только заголовок
        const title = document.createElement('div');
        title.className = 'hub-title';
        title.innerText = 'СКЛАД';
        this.container.appendChild(title);
        
        // Списки ресурсов не создаем — их пока нет
    }

    /**
     * Основной метод изменения ресурсов
     * @param {string} type - Тип ресурса ('stone')
     * @param {number} amount - Сколько добавить (или отнять, если минус)
     */
    changeResource(type, amount = 1) {
        // Если такого ресурса еще нет в базе, инициализируем 0
        if (this.resources[type] === undefined) {
            this.resources[type] = 0;
        }

        // Обновляем математику
        this.resources[type] += amount;

        // Защита от отрицательных чисел
        if (this.resources[type] < 0) this.resources[type] = 0;

        // Обновляем Визуал
        this.updateDisplay(type);
    }

    updateDisplay(type) {
        const count = this.resources[type];
        
        // СЦЕНАРИЙ 1: Ресурс есть (> 0)
        if (count > 0) {
            // Если строки еще нет в интерфейсе — создаем её
            if (!this.uiRows[type]) {
                this.createResourceRow(type);
            }
            
            // Обновляем цифру
            this.uiCounters[type].innerText = count;
            
            // Анимация (мигание зеленым)
            this.uiCounters[type].style.color = '#4CAF50';
            setTimeout(() => {
                if (this.uiCounters[type]) { // Проверка, вдруг уже удалили
                    this.uiCounters[type].style.color = '#fff';
                }
            }, 200);
        } 
        
        // СЦЕНАРИЙ 2: Ресурса нет (0)
        else {
            // Если строка есть в интерфейсе — удаляем её
            if (this.uiRows[type]) {
                this.uiRows[type].remove(); // Удаляем HTML элемент
                
                // Чистим ссылки в памяти
                delete this.uiRows[type];
                delete this.uiCounters[type];
            }
        }
    }

    createResourceRow(type) {
        const row = document.createElement('div');
        row.className = 'resource-row';
        
        // Эффект появления (fade-in)
        row.style.animation = 'fadeIn 0.3s ease-in-out';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'res-name';
        // Берем русское имя из словаря или используем английский ключ, если перевода нет
        nameSpan.innerText = this.displayNames[type] || type;

        const countSpan = document.createElement('span');
        countSpan.className = 'res-count';
        countSpan.innerText = '0';

        row.appendChild(nameSpan);
        row.appendChild(countSpan);
        
        // Добавляем в панель (после заголовка, в конец списка)
        this.container.appendChild(row);

        // Сохраняем ссылки
        this.uiRows[type] = row;
        this.uiCounters[type] = countSpan;
    }
}