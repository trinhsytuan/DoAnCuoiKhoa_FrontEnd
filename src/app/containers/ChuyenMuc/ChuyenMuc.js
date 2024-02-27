import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ChuyenMuc.scss";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import { connect } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getFile } from "@app/services/FileControl";
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
      console.log(response);
      setDataFile(response);
    }
  };
  return (
    <Loading active={isLoading}>
      <BaseContent>
        <div className="grid grid-4 chuyenmuc-container">
          <div className="file-item">fsđf</div>
          <div className="file-item">fsđf</div>
          <div className="file-item">fsđf</div>
          <div className="file-item">fsđf</div>
        </div>
      </BaseContent>
    </Loading>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}
export default connect(mapStateToProps)(ChuyenMuc);
