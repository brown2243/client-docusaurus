/**
 * Docusaurus Background Music (BGM) Injector
 * Web Audio API based background audio player with autoplay-policy handling,
 * smooth gain control, idempotency, and Docusaurus router lifecycle support.
 */

const isClientSide = () =>
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  "AudioContext" in window ||
  (typeof window !== "undefined" && "webkitAudioContext" in window);

class BgmPlayer {
  constructor(url = "/bgm.mp3") {
    this.url = url;
    this.audioContext = null;
    this.gainNode = null;
    this.source = null;
    this.audioBuffer = null;
    this.isLoading = false;
    this.isPlaying = false;
  }

  /**
   * Lazily initialize AudioContext and Master GainNode.
   */
  initAudioContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);
    }
    return this.audioContext;
  }

  /**
   * Fetch audio file and decode into AudioBuffer.
   */
  async loadAndDecode() {
    if (this.audioBuffer) return this.audioBuffer;
    if (this.isLoading) return null;

    try {
      this.isLoading = true;
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      const ctx = this.initAudioContext();
      if (!ctx) return null;

      this.audioBuffer = await new Promise((resolve, reject) => {
        ctx.decodeAudioData(arrayBuffer, resolve, reject);
      });
      return this.audioBuffer;
    } catch (err) {
      console.warn("[BGM] Failed to load/decode audio:", err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Start playback handling suspended AudioContext states.
   */
  async startPlay() {
    try {
      const ctx = this.initAudioContext();
      if (!ctx) return false;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (!this.audioBuffer) {
        await this.loadAndDecode();
      }

      if (!this.audioBuffer) return false;

      this.pause(); // Stop existing buffer source before creating a new one

      this.source = ctx.createBufferSource();
      this.source.buffer = this.audioBuffer;
      this.source.loop = true;
      this.source.connect(this.gainNode);
      this.source.start(0);
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn("[BGM] Playback error:", err);
      this.isPlaying = false;
      return false;
    }
  }

  /**
   * Stop current buffer source node.
   */
  pause() {
    if (this.source) {
      try {
        this.source.stop();
        this.source.disconnect();
      } catch (_) {
        // Ignore already stopped node errors
      }
      this.source = null;
    }
    this.isPlaying = false;
  }
}

// Singleton player instance
let playerInstance = null;

const getPlayer = () => {
  if (!playerInstance) {
    playerInstance = new BgmPlayer("/bgm.mp3");
  }
  return playerInstance;
};

/**
 * Creates accessible BGM control button.
 */
const createBgmButton = (player) => {
  const existing = document.getElementById("bgm-btn");
  if (existing) return existing;

  const btn = document.createElement("button");
  btn.id = "bgm-btn";
  btn.className = "bgm-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "배경음악 재생");
  btn.setAttribute("title", "배경음악 재생/정지");
  btn.setAttribute("data-playing", player.isPlaying ? "playing" : "paused");

  const iconWrapper = document.createElement("div");
  iconWrapper.className = "icon";

  const icon = document.createElement("div");
  icon.className = player.isPlaying ? "stop-icon" : "play-icon";

  iconWrapper.appendChild(icon);
  btn.appendChild(iconWrapper);

  btn.addEventListener("click", async () => {
    if (player.isLoading) return;

    if (player.isPlaying) {
      player.pause();
      btn.setAttribute("data-playing", "paused");
      btn.setAttribute("aria-label", "배경음악 재생");
      icon.className = "play-icon";
    } else {
      btn.setAttribute("data-playing", "loading");
      const success = await player.startPlay();
      if (success) {
        btn.setAttribute("data-playing", "playing");
        btn.setAttribute("aria-label", "배경음악 일시정지");
        icon.className = "stop-icon";
      } else {
        btn.setAttribute("data-playing", "paused");
        btn.setAttribute("aria-label", "배경음악 재생");
        icon.className = "play-icon";
      }
    }
  });

  return btn;
};

/**
 * Attaches BGM button to DOM and schedules idle preloading.
 */
const mountBgm = () => {
  if (!isClientSide()) return;
  if (document.getElementById("bgm-btn")) return;

  const player = getPlayer();
  const target = document.querySelector("#__docusaurus") || document.body;

  if (target) {
    const btn = createBgmButton(player);
    target.appendChild(btn);

    // Preload audio data during idle time
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => player.loadAndDecode());
    } else {
      setTimeout(() => player.loadAndDecode(), 1000);
    }
  }
};

// Initial execution
if (isClientSide()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountBgm, { once: true });
  } else {
    mountBgm();
  }
}

// Docusaurus client module lifecycle export
export default {
  onRouteDidUpdate() {
    if (isClientSide() && !document.getElementById("bgm-btn")) {
      mountBgm();
    }
  },
};
