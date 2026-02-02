// game.js - 最简单的文字游戏框架
class SimpleTextGame {
    constructor() {
        // 游戏状态
        this.state = {
            health: 100,
            money: 50,
            day: 1,
            currentScene: 'start'
        };
        
        // 游戏场景数据
        this.scenes = {
            start: {
                text: "你醒来发现自己变成了一个青椒。你躺在菜市场的摊位上，周围都是蔬菜同伴。",
                choices: [
                    { text: "试着滚动身体", next: "roll", effect: { health: -5 } },
                    { text: "观察周围环境", next: "observe" },
                    { text: "和其他蔬菜说话", next: "talk" }
                ]
            },
            roll: {
                text: "你努力滚动，但作为一个青椒，这很困难。你消耗了一些体力。",
                choices: [
                    { text: "继续尝试", next: "roll_again" },
                    { text: "放弃并休息", next: "rest" }
                ]
            },
            observe: {
                text: "你看到周围有胡萝卜、西红柿、黄瓜。远处有个摊主正在整理货物。",
                choices: [
                    { text: "向胡萝卜打招呼", next: "carrot" },
                    { text: "观察摊主", next: "vendor" },
                    { text: "回到最初状态", next: "start" }
                ]
            },
            rest: {
                text: "你决定休息一下。体力恢复了。",
                choices: [
                    { text: "醒来继续", next: "start", effect: { health: 10 } }
                ]
            },
            carrot: {
                text: "胡萝卜对你眨了眨眼（如果它有眼睛的话）:'嘿，新来的？'",
                choices: [
                    { text: "'是的，怎么回事？'", next: "carrot_talk" },
                    { text: "假装没听到", next: "start" }
                ]
            }
            // 可以继续添加更多场景...
        };
        
        // 初始化游戏
        this.init();
    }
    
    // 初始化游戏
    init() {
        console.log("游戏初始化...");
        this.loadScene(this.state.currentScene);
        this.updateStatsDisplay();
        
        // 从本地存储加载保存的游戏
        const saved = localStorage.getItem('textGameSave');
        if (saved) {
            const confirmLoad = confirm("检测到保存的游戏，是否加载？");
            if (confirmLoad) {
                this.load();
            }
        }
    }
    
    // 加载场景
    loadScene(sceneId) {
        const scene = this.scenes[sceneId];
        if (!scene) {
            console.error("场景不存在:", sceneId);
            return;
        }
        
        // 更新当前场景
        this.state.currentScene = sceneId;
        
        // 显示场景文本
        document.getElementById('scene-text').textContent = scene.text;
        
        // 生成选择按钮
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = ''; // 清空之前的选项
        
        scene.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = `${index + 1}. ${choice.text}`;
            button.onclick = () => {
                this.makeChoice(choice);
            };
            choicesContainer.appendChild(button);
        });
        
        // 如果没有选择，添加默认继续按钮
        if (scene.choices.length === 0) {
            const continueBtn = document.createElement('button');
            continueBtn.textContent = "继续";
            continueBtn.onclick = () => this.loadScene('start');
            choicesContainer.appendChild(continueBtn);
        }
    }
    
    // 玩家做出选择
    makeChoice(choice) {
        console.log("玩家选择了:", choice.text);
        
        // 应用选择效果
        if (choice.effect) {
            this.applyEffect(choice.effect);
        }
        
        // 天数增加
        this.state.day++;
        
        // 随机事件（示例）
        this.randomEvent();
        
        // 加载下一个场景
        this.loadScene(choice.next);
        
        // 更新UI
        this.updateStatsDisplay();
        
        // 自动保存
        this.save();
    }
    
    // 应用效果
    applyEffect(effect) {
        if (effect.health) {
            this.state.health = Math.max(0, this.state.health + effect.health);
        }
        if (effect.money) {
            this.state.money += effect.money;
        }
    }
    
    // 随机事件
    randomEvent() {
        const events = [
            { chance: 0.2, text: "你感觉水分在流失...", effect: { health: -10 } },
            { chance: 0.1, text: "有人给了你一些水！", effect: { health: 20 } },
            { chance: 0.15, text: "你被放到了更显眼的位置", effect: { money: 5 } }
        ];
        
        events.forEach(event => {
            if (Math.random() < event.chance) {
                alert(event.text);
                this.applyEffect(event.effect);
            }
        });
    }
    
    // 更新状态显示
    updateStatsDisplay() {
        document.getElementById('health').textContent = this.state.health;
        document.getElementById('money').textContent = this.state.money;
        document.getElementById('day').textContent = this.state.day;
        
        // 检查游戏结束
        if (this.state.health <= 0) {
            alert("游戏结束！你失去了所有水分...");
            this.reset();
        }
    }
    
    // 保存游戏
    save() {
        const saveData = {
            state: this.state,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('textGameSave', JSON.stringify(saveData));
        console.log("游戏已保存");
    }
    
    // 加载游戏
    load() {
        const saved = localStorage.getItem('textGameSave');
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                this.state = saveData.state;
                this.loadScene(this.state.currentScene);
                this.updateStatsDisplay();
                alert("游戏已加载");
            } catch (e) {
                console.error("加载失败:", e);
            }
        }
    }
    
    // 重置游戏
    reset() {
        if (confirm("确定要重新开始吗？当前进度将丢失。")) {
            this.state = {
                health: 100,
                money: 50,
                day: 1,
                currentScene: 'start'
            };
            this.loadScene('start');
            this.updateStatsDisplay();
            localStorage.removeItem('textGameSave');
        }
    }
}

// 创建游戏实例
let game;
window.onload = function() {
    game = new SimpleTextGame();
    
    // 将方法暴露给全局，以便HTML按钮调用
    window.game = {
        save: () => game.save(),
        load: () => game.load(),
        reset: () => game.reset()
    };
};