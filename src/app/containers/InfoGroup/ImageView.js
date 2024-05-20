import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { API } from "@api";
import "./ImageView.scss";
import { Divider, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadFile } from "@app/services/FileControl";
import { CONSTANTS } from "@constants";
ImageView.propTypes = {};

function ImageView({ data }) {
  const newImageData = useMemo(() => {
    return data.filter((res) => res?.fileType === "image");
  }, [data]);
  const newFileData = useMemo(() => {
    return data.filter((res) => res?.fileType === "file");
  }, [data]);
  const handleDownload = async (id, fileName) => {
    const fileData = await downloadFile(id);
    if (fileData) {
      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    }
  };
  const typeUrl = (image) => {
    if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string") {
      return API.PREVIEW_IMAGE.format(image);
    }
  };
  return (
    <>
      <div className="image-container">
        <div className={`image-left-container ${newImageData && newImageData?.length == 1 && "image-one"}`}>
          {newImageData && newImageData[0] && newImageData[0]?.type === CONSTANTS.VIDEO ? (
            <video controls>
              <source src={typeUrl(newImageData[0]?.url || newImageData[0]?.fileName)} type="video/mp4" />
            </video>
          ) : (
            <img src={API.PREVIEW_ID.format(newImageData[0]?.fileName)} />
          )}
        </div>
        {newImageData.length > 1 && (
          <div className="image-right-container">
            {newImageData.map((res, index) => {
              if (index >= 1) {
                console.log(res);
                if (res?.type === CONSTANTS.VIDEO) {
                  return (
                    <video controls>
                      <source src={typeUrl(res?.url || res?.fileName)} style={{width: "100%", height: "100%"}} type="video/mp4" />
                    </video>
                  );
                }
                return <img key={index} src={API.PREVIEW_ID.format(res?.fileName)} />;
              }
            })}
          </div>
        )}
      </div>
      {newFileData && !!newFileData.length && (
        <>
          <Divider />
          <h4>Tệp tin đính kèm:</h4>
          <div className="file-attactment-image-view">
            {newFileData.map((res, index) => (
              <Tooltip title="Tải file xuống" key={index}>
                <div className="file-item-image-view" onClick={() => handleDownload(res?._id, res?.originalFilename)}>
                  <DownloadOutlined /> {res?.originalFilename}
                </div>
              </Tooltip>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default ImageView;
