import React, { useEffect, useRef, useState } from "react";
import "./ChuyenMuc.scss";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import { connect } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getFile } from "@app/services/FileControl";
import NoData from "@components/NoData/NoData";
import ICON_FILE from "@assets/images/icon/icon-file.svg";
import { formatTimeDate } from "@app/common/functionCommons";
import FileAction from "@components/FileAction/FileAction";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API } from "@api";
import axios from "axios";

function ChuyenMuc({ isLoading, myInfo }) {
  const fileRef = useRef(null);

  const [filter, setFilter] = useState({
    share: null,
    category: null,
  });

  const [dataFile, setDataFile] = useState([]);
  const [fileNameSearch, setFilenameSearch] = useState(null);
  const [precentageUpload, setPrecentageUpload] = useState([]);
  const handleChangeFileUpload = (idFile, precentage) => {
    const newData = precentageUpload.map((res, index) => {
      if (res?.id === idFile) return { ...res, precent: precentage };
      return { ...res };
    });
    setPrecentageUpload(newData);
  };
  const handleCreateFileUpload = (fileName, precen = 0) => {
    const idFile = new Date();
    const newData = { id: idFile, fileName, precen };
    if (precentageUpload.length === 0) setPrecentageUpload([{ id: idFile, fileName, precen }]);
    else setPrecentageUpload([...precentageUpload, ...newData]);
    return idFile;
  };

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

    const response = await getFile(id, fileNameSearch, share);
    if (response) {
      setDataFile(response);
    }
  };
  const handleUploadFile = async (file) => {
    const selectedFile = file.target.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("category", filter?.category);
    const idFile = await handleCreateFileUpload(selectedFile?.name);
    const response = await axios.post(API.UPLOAD_FILE, formData, {
      onUploadProgress: async(progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(percentCompleted);
        await handleChangeFileUpload(idFile, percentCompleted);
      },
    });
  };
  const handleClickUploadFile = () => {
    fileRef.current.click();
  };
  console.log(precentageUpload);
  return (
    <div className="chuyen-muc-container">
      <div className="btn-upload-file-chuyen-muc">
        <Button type="primary" icon={<UploadOutlined />} onClick={handleClickUploadFile}>
          Tải file mới
        </Button>
        <input type="file" style={{ display: "none" }} ref={fileRef} onChange={handleUploadFile} />
      </div>
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
                    <FileAction className={"menu-file-share-actions"} idFile={res?._id} />
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
