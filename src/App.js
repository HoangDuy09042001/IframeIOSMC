import React, { useRef, useState, useEffect } from 'react';

import './App.css';

function App() {
  const [showMcVideo, setShowMcVideo] = useState(false);
  const audioRef = useRef(null);
  const [pause, setPause] = useState(false);
  const [scale, setScale] = useState(1)
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [videoId, setVideoId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const mcVideoRef = useRef(null);
  const [introGif, setIntroGif] = useState(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('videoId');
    const idWidth = urlParams.get('width');

    console.log(idFromUrl)
    if (idFromUrl) {
      setVideoId(idFromUrl);
    }
    if (idWidth) {
      setWidth(parseFloat(idWidth))
    }
    audioRef.current.volume = 0.1
  }, []);
  useEffect(() => {
    const handleIntro = ()=>{
      audioRef.current.play();
      audioRef.current.volume = 0.1
    }
    const handleClickOutsideVideo = (event) => {
      // Check if the clicked element is not within mcVideoRef.current
      if (mcVideoRef.current && !mcVideoRef.current.contains(event.target)) {
        handleIntro();
      }
    };
    const handleUserInteraction = () => {

      if (showMcVideo) {

        if (!pause) {
          mcVideoRef.current.pause();
          audioRef.current.pause();
          audioRef.current.volume = 0.1
        } else if (pause) {
          mcVideoRef.current.play();
          audioRef.current.play();
          audioRef.current.volume = 0.1
        }
        setPause(!pause)
      }
    };
    const mcVideoRefButton = mcVideoRef.current
    mcVideoRefButton.addEventListener('click', handleUserInteraction);
    document.addEventListener('click', handleClickOutsideVideo);


    return () => {
      mcVideoRefButton.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('click', handleClickOutsideVideo);
    };
  }, [pause, showMcVideo]);

  useEffect(() => {
    setScale(width / 1920)
    setHeight(width / 1920 * 1080)
  }, [width]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentTime === 7 && !showMcVideo) {
      setShowMcVideo(true);

    }
    if (currentTime === 21) setIntroGif(false)

  }, [currentTime, showMcVideo])

  return (
    <div className="App" style={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>

      <audio ref={audioRef} src="background_music.mp3" />
      <div className="container" >
        {/* <div>{currentTime} {introGif?'INTRO':'OUTTRO'}</div> */}
        {introGif && <div className="getaway-car intro" style={{ width: width + 'px', height: height + 'px', backgroundImage: "url('background.gif')" }}></div>}
        <div className="getaway-car next-intro" style={{ width: width + 'px', height: height + 'px', backgroundImage: "url('outro.gif')", visibility: introGif ? 'hidden' : 'visible' }} ></div>
        <video
          className="mc"
          autoPlay
          width={600 * scale}
          style={{ top: scale * (560 - 600 / 2) + 'px', left: scale * (1350 - 600 / 2) + 'px', visibility: !showMcVideo ? 'hidden' : 'visible' }}
          ref={mcVideoRef}
          src={videoId ? `https://work247.vn/dowload/video_new/new_${videoId}/video_${videoId}.mp4` : 'mc.mp4'}
        ></video>


      </div>


    </div>
  );
}

export default App;


