import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import axios from 'axios';
import { API } from '@api';

DialogPreview.propTypes = {
  
};

function DialogPreview({infoFile, visible, onCancel}) {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
        const response = await axios.get(API.PREVIEW_FILE.format(infoFile?._id), {
          responseType: 'arraybuffer',
        });
        const blob = new Blob([response.data], { type: 'video/mp4' });
        const videoUrlBlob = URL.createObjectURL(blob);
        setVideoUrl(videoUrlBlob);
    };

    fetchVideo();
  }, []);
  return (
    <Modal visible={visible} onCancel={onCancel} title="Xem video" footer={null} width={1000} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <iframe src={videoUrl} allowFullScreen={true} webkitallowfullscreen="true" width={900} height={500}>
      </iframe>
    </Modal>
  );
}

export default DialogPreview;
