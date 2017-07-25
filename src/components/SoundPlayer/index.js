import React, { Component } from 'react';
import { Icon } from "../Icon/index";

export default class SoundPlayer extends Component {

  state = {
    isPlaying: false,
  };

  constructor(props) {
    super(props);
    this.sound = new Media(props.soundSrc);
  }

  componentWillUnmount() {
    this.sound.release();
  }

  componentWillReceiveProps(nextProps) {
    this.sound = new Media(nextProps.soundSrc);
  }

  render() {
    return this.state.isPlaying
      ? <Icon name="stop" onTouchStart={this.onStopClick}/>
      : <Icon name="play" onTouchStart={this.onPlayClick}/>;
  }

  onPlayClick = () => {
    this.setState({ isPlaying: true });
    this.sound.play();
  };

  onStopClick = () => {
    this.setState({ isPlaying: false });
    this.sound.stop();
    this.sound.release();
  };
}
