import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

ChuyenMuc.propTypes = {};

function ChuyenMuc({ isLoading, myInfo }) {
  const url = window.location.href;
  const [dataFile, setDataFile] = useState([]);
  const [fileNameSearch, setFilenameSearch] = useState(null);
  const urlPath = url.split("/");
  let id = urlPath[urlPath.length - 1];
  let category = null;
  id === "share-with-me" ? (category = myInfo?._id) : null;
  id = id.length == 24 ? id : null;
  useEffect(() => {
    getAPI();
  }, [url]);
  const getAPI = async () => {
    const response = await getFile(id, fileNameSearch, category);
    if (response) {
      setDataFile(response);
    }
  };
  return (
    <div className="chuyen-muc-container">
      <Loading active={isLoading}>
        {!dataFile ||
          (!dataFile.length && (
            <BaseContent className={"no-data"}>
              <NoData text={"Chưa có file nào trong mục này, hãy tải file của bạn lên"} />
            </BaseContent>
          ))}
        {dataFile && dataFile.length && (
          <div className="file-item-map grid grid-4">
            {dataFile.map((res, index) => {
              console.log(res);
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
                    <FileAction className={"menu-file-share-actions"} idFile={res?._id}/>
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
