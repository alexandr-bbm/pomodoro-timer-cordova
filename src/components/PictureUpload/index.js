import React, { Component } from 'react';
import { Icon } from "../Icon/index";
import { playSound } from "../Timer/helper";
import { ResetControl } from "../ResetControl/index";

export default class PictureUpload extends Component {
  render() {
    const {
      onResetConfirm,
      defaultValue,
      currentValue,
    } = this.props;

    return <span>
      <Icon name="camera" onTouchStart={this.onCameraClick}/>
      <Icon name="upload" onTouchStart={this.onUploadClick}/>
      <ResetControl
        {...{
          onResetConfirm,
          defaultValue,
          currentValue,
        }}
      />
    </span>
  }

  onUploadSuccess = (imageUri) => {
    window.resolveLocalFileSystemURL(imageUri, fileEntry => {
      window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, dirEntry => {
        fileEntry.moveTo(dirEntry, 'bg.jpg', entry => {
          this.props.onUpload(entry.nativeURL);
        });
      });
    }, () => console.log('error resolveLocalFileSystemURL'));
  };

  onError = (error) => {
    console.debug("Unable to obtain picture: " + error, "app");
  };

  onUploadClick = () => {
    navigator.camera.getPicture(
      this.onUploadSuccess,
      this.onError,
      this.getOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM)
    );
  };

  onCameraClick = () => {
    navigator.camera.getPicture(
      this.onUploadSuccess,
      this.onError,
      this.getOptions(Camera.PictureSourceType.CAMERA)
    );
  };

  getOptions(srcType) {
    return {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
    }
  }
}