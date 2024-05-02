const initBgm = async () => {
  const audioContext = new AudioContext();
  let source = null;
  let audioBuffer = null;

  const pause = () => {
    if (source) {
      source.stop();
      source = null;
    }
  };

  const startPlay = () => {
    if (!audioBuffer) {
      return;
    }
    //
    pause();

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.loop = true;

    source.start();
  };

  fetch("bgm.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((buffer) => {
      audioBuffer = buffer;
    });

  const dataPlaying = "data-playing";
  const playing = "playing";
  const paused = "paused";

  const playIconClass = "play-icon";
  const stopIconClass = "stop-icon";

  const icon = document.createElement("div");
  icon.classList.add("icon");
  icon.classList.add(playIconClass);

  const btn = document.createElement("button");
  btn.appendChild(icon);
  btn.classList.add("bgm-btn");
  btn.setAttribute(dataPlaying, paused);

  btn.addEventListener("click", () => {
    const state = btn.getAttribute(dataPlaying);
    if (state === playing) {
      pause();
      btn.setAttribute(dataPlaying, paused);
    } else {
      startPlay();
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
    if (docu && audioBuffer) {
      docu.appendChild(btn);
      clearInterval(timer);
    }
  }, 1000);
};
initBgm();
