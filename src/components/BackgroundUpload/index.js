import React, { Component } from 'react';
import { Icon } from "../Icon/index";
import { playSound } from "../Timer/helper";
import { ResetControl } from "../ResetControl/index";

export const BACKGROUND_FILENAME = 'bg.jpg';

export default class BackgroundUpload extends Component {
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
        removeBackgroundFile()
          .then(() => {
            fileEntry.moveTo(dirEntry, BACKGROUND_FILENAME, entry => {
              this.props.onUpload(entry.nativeURL);
            });
          })
          .catch(() => {
            console.log('error removeBackgroundFile')
          })
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

export function removeBackgroundFile() {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, dirEntry => {
      dirEntry.getFile(BACKGROUND_FILENAME, {create:false}, fileEntry => {
        fileEntry.remove(resolve, reject);
      }, (err) => {
        if (err.code === FileError.NOT_FOUND_ERR) {
          resolve()
        } else {
          reject(err);
        }
      });
    });
  })
}