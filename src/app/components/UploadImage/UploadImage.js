import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './UploadImage.scss';
import IconImage from '@assets/icons/UploadImage.svg';
import CustomImage from '@components/CustomImage/CustomImage';
import { CONSTANTS } from '@constants';

UploadImage.propTypes = {
  disabled: PropTypes.bool,
  data: PropTypes.array,
  type: PropTypes.string,
};
UploadImage.defaultProps = {
  disabled: false,
  data: [],
  type: "",
};
function UploadImage({ data, onChange, onRemove, remove, disabled, type }) {
  const fileInputRef = useRef(null);
  const onAdd = (dataChange) => {
    onChange([...data, dataChange]);
  };
  const ImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        onAdd({
          fileName: selectedFile.name,
          url: selectedFile,
          type,
          newUp: true,
        });
      }
      else if(selectedFile.type.startsWith("video/")) {
          onAdd({
            fileName: selectedFile.name,
            url: selectedFile,
            type: CONSTANTS.VIDEO,
            newUp: true,
          });
        }
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
    <div className="upload-image-container">
      <div className="image-show">
        {data.map((res, index) => {
          return <CustomImage data={res} key={index} disabled={disabled} onRemove={onRemoveImage} idIndex={index} />;
        })}
      </div>
      {!disabled && (
        <div className="item-disabled">
          <img src={IconImage} onClick={handleButtonClick}></img>
        </div>
      )}
      <input type="file" accept="image/*,video/*" onChange={ImageChange} style={{ display: "none" }} ref={fileInputRef} />
    </div>
  );
}

export default UploadImage;

