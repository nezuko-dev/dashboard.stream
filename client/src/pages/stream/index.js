import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { message, Button, Slider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import HLS from "hls.js";
import moment from "moment";

import "./style.scss";
const Stream = ({ match }) => {
  const { id } = match.params;
  const [state, setState] = useState(null);
  const [play, setPlay] = useState(false);
  const [timestamp, setTime] = useState({ current: 0, max: null });
  const video = useRef(null);
  useEffect(() => {
    axios.get("/api/content/" + id).then((response) => {
      if (response.data.status) setState(response.data.data);
    });
  }, [id]);
  useEffect(() => {
    if (video && state) {
      if (HLS.isSupported()) {
        var hls = new HLS({ maxBufferSize: 1 });
        hls.loadSource(`/content/stream/${id}/master.nez`);
        hls.attachMedia(video.current);
      } else if (video.current.canPlayType("application/vnd.apple.mpegurl")) {
        video.current.src = `/content/stream/${id}/mobile.m3u8`;
      } else {
        message.error("Not Supported Device");
      }
    }
  }, [video, state, id]);
  return (
    <div id="stream">
      <div className="video-wrapper">
        <div className="video-container">
          <video
            ref={video}
            onTimeUpdate={(e) => {
              setTime({ ...timestamp, current: e.target.currentTime });
            }}
            onLoadedMetadata={(e) =>
              setTime({ ...timestamp, max: Math.floor(e.target.duration) })
            }
          />
        </div>
        <div className="action-wrapper">
          <div className="action-top" />
          <div className="action-bottom" />
          <div className="actions">
            <div className="action-top-container">
              <Button type="link">
                <Link to="/contents">
                  <ArrowLeftOutlined />
                </Link>
              </Button>
              <div className="title">
                <p className="title-name">{state ? state.name : null}</p>
                <p className="subtitle">
                  {state
                    ? `${moment(state.created).fromNow() + " • " + state.size}`
                    : null}
                </p>
              </div>
            </div>
            <div className="action-middle-container">
              <div className="middle-background">
                {video ? (
                  <div
                    className="middle-cursor"
                    onClick={() => {
                      if (play) {
                        video.current.pause();
                        setPlay(false);
                      } else {
                        video.current.play();
                        setPlay(true);
                      }
                    }}
                  />
                ) : null}
              </div>
            </div>
            <div className="action-bottom">
              <div className="video-seeker">
                {video.current && timestamp.max ? (
                  <Slider
                    value={timestamp.current}
                    min={0}
                    max={timestamp.max}
                    onChange={(e) => setTime({ ...timestamp, current: e })}
                    onAfterChange={(after) => {
                      video.current.currentTime = after;
                      // video.current.play();
                      // setPlay(true);
                    }}
                    tipFormatter={(s) => {
                      var m = Math.floor(s / 60);
                      m = m >= 10 ? m : "0" + m;
                      s = Math.floor(s % 60);
                      s = s >= 10 ? s : "0" + s;
                      return m + ":" + s;
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Stream;
