import React, { useRef, useState, useEffect } from 'react';

import './App.css';

function App() {
  const [showMcVideo, setShowMcVideo] = useState(false);
  const audioRef = useRef(null);
  const [pause, setPause] = useState(false);
  const [imgdefault, setImgDefault] = useState(true);
  const [scale, setScale] = useState(1)
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [videoId, setVideoId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const mcVideoRef = useRef(null);


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
  }, []);
  useEffect(() => {
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
    document.addEventListener('click', handleUserInteraction);


    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [pause,  showMcVideo]);

  useEffect(() => {
    setScale(width / 1920)
    setHeight(width / 1920 * 1080)
  }, [imgdefault, width]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Kiểm tra điều kiện để hiển thị video
  if (currentTime >= 6 && !showMcVideo) {
    setShowMcVideo(true);
  }

  return (
    <div className="App" style={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>
      
      {imgdefault ? <div onClick={() => {
        setImgDefault(false)
      }} className='image-default' style={{ width: width + 'px', height: height + 'px' }}></div> : <></>}
      <audio ref={audioRef} src="background_music.mp3" />
      <div className="container" style={{ display: imgdefault ? 'none' : 'block' }}>
        <div className="background getaway-car"></div>

        {showMcVideo && (
          <div style={{ borderRadius: '10', overflow: 'hidden', width: 600 * scale + 'px', height: 600 * scale + 'px' }}>
            <video
              className="mc"
              autoPlay
              width={600 * scale}
              style={{ top: scale * (560 - 600 / 2) + 'px', left: scale * (1350 - 600 / 2) + 'px' }}
              ref={mcVideoRef}
              src={videoId ? `https://work247.vn/dowload/video_new/new_${videoId}/video_${videoId}.mp4` : 'mc.mp4'}
            ></video>
          </div>
        )}
      </div>


    </div>
  );
}

export default App;



