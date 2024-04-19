import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import flv from "flv.js";
import { getVideoLivestream } from "@app/services/liveStream";
import { API } from "@api";
import { Divider } from "antd";
import CommentView from "./CommentView";
LivestreamView.propTypes = {};

function LivestreamView({ data }) {
  const isProd = process.env.NODE_ENV === "production";
  let isUrl = null;
  const videoRef = useRef(null);
  let flvPlayer = null;
  if (!isProd) isUrl = "http://localhost:8000/live/{0}";
  else isUrl = "http://15.235.162.126:8000/live/{0}";

  useEffect(() => {
    getVideoFromAPI();
  }, []);
  const getVideoFromAPI = async () => {
    const apiResponse = await getVideoLivestream(data?._id);

    const idStreamKey = "{0}-{1}-{2}.flv".format(
      data?.livestreamObjOptions?.streamName,
      data?.livestreamObjOptions?.expirationTimestamp,
      apiResponse?.streamKey
    );
    if (
      data?.livestreamObjOptions?.streamName &&
      data?.livestreamObjOptions?.expirationTimestamp &&
      apiResponse?.streamKey
    ) {
      if (flv.isSupported()) {
        const videoElement = videoRef.current;
        flvPlayer = flv.createPlayer({
          type: "flv",
          url: isUrl.format(idStreamKey), // Thay đổi đường dẫn WebSocket tại đây
        });
        console.log(isUrl.format(idStreamKey));
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        return () => {
          flvPlayer.destroy();
        };
      }
    }
  };
  return (
    <div>
      <video ref={videoRef} controls style={{width: '100%', height: '100%', marginTop: '10px'}} />
      <Divider/>
      <CommentView data={data}/>
    </div>
  );
}

export default LivestreamView;
