import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import HLS from "hls.js";
import ReactHlsPlayer from "react-hls-player";
import "./style.scss";
const Stream = ({ match }) => {
  const { id } = match.params;
  const [state, setState] = useState(null);
  const video = useRef(null);
  useEffect(() => {
    axios.get("/api/content/" + id).then((response) => {
      if (response.data.status) setState(response.data.data);
    });
  }, [id]);
  useEffect(() => {
    if (video && state) {
      if (HLS.isSupported()) {
        var hls = new HLS();
        hls.loadSource(`/content/stream/${id}/${state.stream}.m3u8`);
        hls.attachMedia(video.current);
      }
    }
  });
  return (
    <div id="stream">
      <div className="video-wrapper">
        <div className="video-container">
          <video ref={video} controls></video>
        </div>
      </div>
    </div>
  );
};
export default Stream;
