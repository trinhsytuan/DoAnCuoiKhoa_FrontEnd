import React, { useEffect, useState } from "react";
import "./ChuyenMuc.scss";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import { connect } from "react-redux";
import { getFile } from "@app/services/FileControl";
import NoData from "@components/NoData/NoData";
import ICON_FILE from "@assets/images/icon/icon-file.svg";
import { convertFileName, formatTimeDate, toast } from "@app/common/functionCommons";
import FileAction from "@components/FileAction/FileAction";
import { Button, Input, Upload } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { API } from "@api";
import axios from "axios";
import { CONSTANTS } from "@constants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ChuyenMuc({ isLoading, myInfo }) {
  const history = useHistory();
  const [isCheckLoading, setLoading] = useState(false);
  const [fileNameSearch, setFilenameSearch] = useState(null);
  const [filter, setFilter] = useState({
    share: null,
    category: null,
  });

  const [dataFile, setDataFile] = useState([]);
  useEffect(() => {
    if (myInfo) {
      getAPI();
    }
  }, [window.location, myInfo, location.search]);
  const getAPI = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    const fileSearch = queryParams.get("filename");
    setFilenameSearch(fileSearch);
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
    const response = await getFile(id, fileSearch, share);
    if (response) {
      setDataFile(response);
    }
    setLoading(false);
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
      getAPI();
    } catch (error) {
      toast(CONSTANTS.ERROR, "File tải lên có lỗi");
      onError(error);
    }
  };
  const searchFile = (e) => {
    if (e.target.value) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("filename", e.target.value);
      history.push(`?${queryParams.toString()}`, { replace: true });
    } else {
      history.push();
    }
  };
  const onChangeSearch = (e) => {
    setFilenameSearch(e.target.value);
  };
  return (
    <div className="chuyen-muc-container">
      <div className={`btn-upload-file-chuyen-muc ${filter?.share && "input-flex-end"}`}>
        {!filter?.share && (
          <Upload customRequest={customRequest} defaultFileList={[]} showUploadList={{ showProgress: true }}>
            <Button icon={<UploadOutlined />} type="primary">
              Tải file lên
            </Button>
          </Upload>
        )}
        <Input
          className="input-search"
          allowClear
          value={fileNameSearch}
          onPressEnter={searchFile}
          height={32}
          placeholder="Tìm kiếm File của bạn"
          suffix={<SearchOutlined />}
          onChange={onChangeSearch}
        />
      </div>

      <Loading active={isCheckLoading}>
        {!dataFile ||
          (!dataFile.length && (
            <BaseContent className={"no-data"}>
              <NoData
                text={
                  !filter?.share
                    ? "Chưa có file nào trong mục này, hãy tải file của bạn lên"
                    : "Bạn chưa có file được chia sẻ"
                }
              />
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
                    <span className="file-item__access">{res?.userOwn != myInfo?._id && "Được chia sẻ với bạn"}</span>
                  </div>
                  <div className="file-item__actions">
                    <FileAction className={"menu-file-share-actions"} infoFile={res} getAPI={getAPI} />
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
