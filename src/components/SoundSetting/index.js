import React, { Component } from 'react';
import { Icon } from "../Icon/index";
import { COLORS } from "../../utils/common";
import { IconButton } from "../IconButton/index";
import { PlatformSpecific } from "../../utils/platformSpecific";
import SoundPlayer from "../SoundPlayer/index";
import { ResetControl } from "../ResetControl/index";

export default class SoundSetting extends Component {

  state = {
    screen: 'view',
    isRecording: false,
    recordSuccess: false,
  };

  constructor(props) {
    super(props);
    this.recordedSound = null;
    const ext = PlatformSpecific.getRecordExtension();
    const prefix = PlatformSpecific.getFileSavePrefix();

    this.src =
      `${prefix}soundSetting_${this.props.name}.${ext}`;
  }

  render() {
    return this.state.screen === 'edit'
      ? this.renderEditScreen()
      : this.renderViewScreen();
  }

  renderViewScreen() {
    const { soundSrc, defaultSoundSrc, onResetConfirm } = this.props;
    return (
      <div>
        <SoundPlayer soundSrc={soundSrc}/>
        <Icon name="pencil" onTouchStart={this.handleEditClick}/>
        <ResetControl
          onResetConfirm={onResetConfirm}
          defaultValue={defaultSoundSrc}
          currentValue={soundSrc}
        />
      </div>
    )
  }

  renderEditScreen() {
    const iconButtonProps = this.state.isRecording
      ? { iconFill: COLORS.Dark, text: 'Пишем..' }
      : { iconFill: COLORS.Main, text: 'Записать' };

    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <IconButton
            onTouchStart={this.handleToggleRecord}
            iconStyle={{ fill: iconButtonProps.iconFill }}
            text={iconButtonProps.text}
            iconName="microphone"
          />
          <Icon
            name="cancel"
            onTouchStart={this.handleCancelRecordClick}
            style={{ marginLeft: 10 }}
          />
        </div>
        {this.state.recordSuccess &&
        <div>
          <SoundPlayer soundSrc={this.src}/>
          <Icon name="content-save" onTouchStart={this.handleSaveRecordClick}/>
        </div>
        }
      </div>
    )
  }

  handleEditClick = () => {
    this.setState({ screen: 'edit' })
  };

  handleToggleRecord = () => {
    if (!this.state.isRecording) {
      this.startRecord();
      this.setState({
        isRecording: true,
        recordSuccess: false,
      });
    } else {
      this.recordedSound.stopRecord();
      this.recordedSound.release();
      this.setState({
        isRecording: false,
        recordSuccess: true,
      })
    }
  };

  startRecord = () => {
    this.recordedSound = new Media(this.src);
    this.recordedSound.startRecord();
  };

  handleSaveRecordClick = () => {
    this.props.onSoundChange(this.src);
    this.reset();
  };

  handleCancelRecordClick = () => {
    this.reset();
  };

  reset = () => {
    this.recordedSound = null;
    this.setState({
      recordSuccess: false,
      screen: 'view',
      isRecording: false,
    });
  }
}
