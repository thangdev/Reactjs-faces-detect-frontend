import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, status }) => {
  return (
    <div>
      <p className="f5">
        {
          "Let put an Image Url containing some people faces and this app will detect faces border in your image. Give it a try!"
        }
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="tex"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            {status}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
