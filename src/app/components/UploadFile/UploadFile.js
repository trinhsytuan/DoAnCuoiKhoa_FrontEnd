import React, { useRef } from "react";
import PropTypes from "prop-types";
import "./UploadFile.scss";
import CustomImage from "@components/CustomImage/CustomImage";
import { FileOutlined, DeleteOutlined } from "@ant-design/icons";
import {Button} from "antd";
UploadFile.propTypes = {
  disabled: PropTypes.bool,
  data: PropTypes.array,
  type: PropTypes.string,
};
UploadFile.defaultProps = {
  disabled: false,
  data: [],
  type: "",
};
function UploadFile({ data, onChange, onRemove, remove, disabled, type }) {
  const fileInputRef = useRef(null);
  const onAdd = (dataChange) => {
    onChange([...data, dataChange]);
  };
  const ImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      onAdd({
        fileName: selectedFile.name,
        url: selectedFile,
        type,
        newUp: true,
      });
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const onRemoveImage = (e) => {
    const newData = [...data];
    if (newData[e].newUp === true) {
      newData.splice(e, 1);
      onChange(newData);
    } else {
      onRemove([...remove, newData[e]]);
      newData.splice(e, 1);
      onChange(newData);
    }
  };
  return (
    <div className="upload-file-container">
      {!disabled && (
        <div className="item-disabled">
          <Button icon={<FileOutlined/>} type="primary" onClick={handleButtonClick}>Tải lên</Button>
        </div>
      )}
      <div className="file-show">
        {data.map((res, index) => {
          return <div className="file-name-outline" key={index}>
            <span>{res?.originalFilename || res?.fileName}</span>
            <Button icon={<DeleteOutlined/>} onClick={() => onRemoveImage(index)} />
          </div>
        })}
      </div>
      <input type="file" accept="*" onChange={ImageChange} style={{ display: "none" }} ref={fileInputRef} />
    </div>
  );
}

export default UploadFile;
