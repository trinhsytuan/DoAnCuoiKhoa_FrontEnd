import React, { useEffect, useRef, useState } from "react";
import "./ChuyenMuc.scss";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import { connect } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getFile } from "@app/services/FileControl";
import NoData from "@components/NoData/NoData";
import ICON_FILE from "@assets/images/icon/icon-file.svg";
import { convertFileName, formatTimeDate, toast } from "@app/common/functionCommons";
import FileAction from "@components/FileAction/FileAction";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API } from "@api";
import axios from "axios";
import { CONSTANTS } from "@constants";

function ChuyenMuc({ isLoading, myInfo }) {
  const [filter, setFilter] = useState({
    share: null,
    category: null,
  });
  
  const [dataFile, setDataFile] = useState([]);
  const [fileNameSearch, setFilenameSearch] = useState(null);
  useEffect(() => {
    if (myInfo) {
      getAPI();
    }
  }, [window.location, myInfo]);
  const getAPI = async () => {
    const url = window.location.href;
    const urlPath = url.split("/");
    let id = urlPath[urlPath.length - 1];
    let share = null;
    if (id === "share-with-me") share = myInfo?._id;
    id = id.length == 24 ? id : null;
    setFilter({
      share,
      category: id,
    });
    const response = await getFile(id, fileNameSearch, share);
    if (response) {
      setDataFile(response);
    }
  };
  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    try {
      const formData = new FormData();
      const fileNameOrgin = convertFileName(file?.name);
      formData.append("file", file);
      formData.append("category", filter?.category);
      formData.append("fileName", fileNameOrgin);
      const response = await axios.post(API.UPLOAD_FILE, formData, {
        onUploadProgress: (progressEvent) => {
          const uploadPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress({ percent: uploadPercent });
        },
      });
      onSuccess();
      toast(CONSTANTS.SUCCESS, "File đã được tải lên thành công");
      setDataFile([response.data, ...dataFile])
    } catch (error) {
      toast(CONSTANTS.ERROR, "File tải lên có lỗi");
      onError(error);
    }
  };
  return (
    <div className="chuyen-muc-container">
      {!filter?.share && (
        <div className="btn-upload-file-chuyen-muc">
          <Upload customRequest={customRequest} defaultFileList={[]} showUploadList={{ showProgress: true }}>
            <Button icon={<UploadOutlined />} type="primary">
              Tải file lên
            </Button>
          </Upload>
        </div>
      )}
      <Loading active={isLoading}>
        {!dataFile ||
          (!dataFile.length && (
            <BaseContent className={"no-data"}>
              <NoData text={"Chưa có file nào trong mục này, hãy tải file của bạn lên"} />
            </BaseContent>
          ))}
        {!!dataFile.length && (
          <div className="file-item-map grid grid-4">
            {dataFile.map((res, index) => {
              return (
                <div className="file-item" key={index}>
                  <div className="file-item__left">
                    <img src={ICON_FILE} />
                  </div>
                  <div className="file-item__right">
                    <span className="file-item__fileName">{res?.originalFilename}</span>
                    <span className="file-item__time">{formatTimeDate(res?.createdAt)}</span>
                  </div>
                  <div className="file-item__actions">
                    <FileAction className={"menu-file-share-actions"} idFile={res?._id} userOwn={res?.userOwn} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Loading>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}
export default connect(mapStateToProps)(ChuyenMuc);
