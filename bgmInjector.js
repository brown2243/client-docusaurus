const isClientSide = () =>
  "document" in globalThis && "window" in globalThis && "history" in globalThis;
class BgmPlayer {
  constructor() {
    this.audioContext = null;
    this.source = null;
    this.arrayBuffer = null;
    this.audioBuffer = null;
    this.url = null;
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
  }

  async decode() {
    if (!this.audioContext || this.audioBuffer) {
      return;
    }
    if (!this.arrayBuffer && this.url) {
      try {
        await this.loadAudioFile(this.url);
      } catch (error) {
        throw new Error("failed to fetch ");
      }
    }

    this.audioBuffer = await this.audioContext.decodeAudioData(
      this.arrayBuffer
    );
  }

  pause() {
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
  }

  async startPlay() {
    this.initAudioContext();
    await this.decode();
    this.pause();
    //
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.audioContext.destination);
    this.source.loop = true;
    this.source.start();
  }

  async loadAudioFile(url) {
    this.url = url;
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        this.arrayBuffer = arrayBuffer;
      });
  }
}

const initBgm = async () => {
  if (!isClientSide()) {
    return;
  }
  const bgmUrl = "bgm.mp3";
  const bgmPlayer = new BgmPlayer();
  bgmPlayer.loadAudioFile(bgmUrl);

  const dataPlaying = "data-playing";
  const playing = "playing";
  const paused = "paused";

  const playIconClass = "play-icon";
  const stopIconClass = "stop-icon";

  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("icon");

  const icon = document.createElement("div");
  icon.classList.add(playIconClass);

  const btn = document.createElement("button");
  btn.classList.add("bgm-btn");
  btn.setAttribute(dataPlaying, paused);

  iconWrapper.appendChild(icon);
  btn.appendChild(iconWrapper);

  btn.addEventListener("click", () => {
    const state = btn.getAttribute(dataPlaying);
    if (state === playing) {
      bgmPlayer.pause();
      btn.setAttribute(dataPlaying, paused);
    } else {
      bgmPlayer.startPlay();
      btn.setAttribute(dataPlaying, playing);
    }
    icon.classList.toggle(stopIconClass);
    icon.classList.toggle(playIconClass);
  });

  let cnt = 0;
  const timer = setInterval(() => {
    if (cnt > 10) {
      clearInterval(timer);
    }
    cnt++;

    const docu = document.querySelector("#__docusaurus");
    if (docu) {
      docu.appendChild(btn);
      clearInterval(timer);
    }
  }, 1000);
};
initBgm();
