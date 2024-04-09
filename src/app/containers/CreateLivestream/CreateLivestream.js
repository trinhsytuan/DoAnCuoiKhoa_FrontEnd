import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CreateLivestream.scss";
import BaseContent from "@components/BaseContent";
import { Button } from "antd";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { servicesCreateLivestream } from "@app/services/liveStream";

CreateLivestream.propTypes = {};

function CreateLivestream(props) {
  const {id} = useParams();
  const history = useHistory();
  const isProd = process.env.NODE_ENV === "production";
  let isUrl = null;
  if (!isProd) isUrl = "rtmp://localhost:8080";
  else isUrl = "rtmp://tshare.sytuan.net:3000";
  const [isCreate, setIsCreate] = useState(false);
  const isCreateLivestream = async() => {
    const response = await servicesCreateLivestream(id);
    if(response) {
      setIsCreate(response);
    }
  };
  return (
    <div className="create-livestream">
      <BaseContent>
        {!isCreate && (
          <div className="is-confim">
            <h2>Bạn có muốn tạo livestream không ?</h2>
            <div className="btn-actions-livestream">
              <Button type="primary" onClick={isCreateLivestream}>
                Có
              </Button>
              <Button className="btn-xoa" onClick={() => history.goBack()}>
                Không
              </Button>
            </div>
          </div>
        )}
        {isCreate && (
          <div className="info-key-livestream">
            <p>Thông tin livestream</p>
            <p>Tên miền: {isUrl}</p>
            <p>Khoá: {isCreate?.livestreamKey}</p>
            <p>Vui lòng sử dụng các phần mềm LiveStream như OBS và sử dụng thông tin trên để phát lên hệ thống</p>
            <Button type="primary" onClick={() => history.goBack()}>Quay lại trang trước</Button>
          </div>
        )}
      </BaseContent>
    </div>
  );
}

export default CreateLivestream;
