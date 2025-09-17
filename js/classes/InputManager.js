export class InputManager
{
    #game;
    #repeatDelay = 100; // ms
    #repeatTimers = {};
    #keyToAction = {};
    #repeatActions = new Set(["left", "right", "down", "rotate"]);
    #virtualStopEvents = ["pointerup", "pointerleave", "pointercancel"];
    #actionKeys = {
        left: ["ArrowLeft", "left-button"],
        right: ["ArrowRight", "right-button"],
        down: ["ArrowDown", "down-button"],
        rotate: ["ArrowUp", "rotate-button"],
        start: ["Enter", "start-button"],
        pause: ["Space", "pause-button"],
        sound: ["KeyS", "sound-button"]
    };


    constructor(game)
    {
        this.#game = game;
        this.mapKeysToActions();
        this.initVirtualButtons();
        this.initPhysicalButtons();
    }

    mapKeysToActions()
    {
        for (const [action, keys] of Object.entries(this.#actionKeys)) {
            keys.forEach(key => this.#keyToAction[key] = action);
        }
    }

    #startRepeat(action)
    {
        this.#game.handleKey(action);
        if (!this.#repeatActions.has(action) || this.#repeatTimers[action]) return;

        this.#repeatTimers[action] = setInterval(() => this.#game.handleKey(action), this.#repeatDelay);
    }

    #stopRepeat(action)
    {
        if (!this.#repeatTimers[action]) return;
        clearInterval(this.#repeatTimers[action]);
        delete this.#repeatTimers[action];
    }

    initVirtualButtons()
    {
        Object.entries(this.#actionKeys).forEach(([action, keys]) =>
        {
            keys.filter(k => k.endsWith("-button")).forEach(buttonId =>
            {
                const btn = document.getElementById(buttonId);
                if (!btn) return;

                const stop = () => this.#stopRepeat(action);
                btn.addEventListener("pointerdown", () => this.#startRepeat(action));
                this.#virtualStopEvents.forEach(event => btn.addEventListener(event, stop));
            });
        });
    }

    initPhysicalButtons()
    {
        document.addEventListener("keydown", e =>
        {
            const action = this.#keyToAction[e.code];
            if (!action) return;
            e.preventDefault();
            this.#game.handleKey(action);
        });
    }
}
