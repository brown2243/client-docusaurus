import React from "react";

function BgmPlayer() {
  return (
    <audio autoPlay={true} loop controls>
      <source src="bgm.mp3" type="audio/mp3" />
    </audio>
  );
}

export default BgmPlayer;
