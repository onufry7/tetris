export class SoundManager
{
    muted = true;
    #sounds = {};

    constructor(configSound)
    {
        this.indicator = configSound.element;
        this.#updateIndicator();
        this.#loadSounds(configSound.sounds);
    }

    #loadSounds(soundsConfig)
    {
        for (const [name, path] of Object.entries(soundsConfig)) {
            const audio = new Audio(path);
            audio.load();
            this.#sounds[name] = audio;
        }
    }

    #updateIndicator()
    {
        if (!this.indicator) return;
        this.indicator.innerHTML = this.muted
            ? '<span class="material-symbols-outlined">music_off</span>'
            : '<span class="material-symbols-outlined">music_note</span>';
    }

    // To use in future
    setVolume(volume) // 0.0 - 1.0
    {
        Object.values(this.#sounds).forEach(sound => sound.volume = volume);
    }

    play(action)
    {
        const sound = this.#sounds[action];
        if (this.muted || !sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => { });
    }

    toggleMute()
    {
        this.muted = !this.muted;
        this.#updateIndicator();

        for (const [action, audio] of Object.entries(this.#sounds)) {
            if (action !== 'sound') {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }
}
