import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { message } from "antd";
import HLS from "hls.js";
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
        var hls = new HLS({ debug: true, maxBufferSize: "2MB" });
        hls.loadSource(`/content/stream/${id}/master.m3u8`);
        hls.attachMedia(video.current);
      } else if (video.current.canPlayType("application/vnd.apple.mpegurl")) {
        message.info("Loading...");
        video.current.src = `/content/stream/${id}/master.m3u8`;
      } else {
        message.error("HLS not supported");
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
