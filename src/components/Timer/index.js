import React, { Component } from 'react';
import './style.css';
import next from '../../utils/next.js';
import { SemiCircle } from 'react-progressbar.js/dist/react-progressbar.js';
import { Icon } from "../Icon/index";
import { formatSeconds } from "../../utils/time";
import SoundSetting from "../SoundSetting/index";
import {
  deleteFromLocalStorage,
  getDefaultValue,
  getInitialValue,
  getStorageKey,
  INTERVAL_KEYS, playSound,
  PROGRESSBAR_SETTINGS,
} from "./helper";
import PictureUpload from "../PictureUpload/index";
import { ResetControl } from "../ResetControl/index";

export default class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      intervalsById: Timer.getDefaultIntervals(),
      currentIntervalId: INTERVAL_KEYS.SESSION,
      secondsRemaining: getInitialValue('duration', INTERVAL_KEYS.SESSION),
      isRunning: false,
      page: 'home',
      customBackground: getInitialValue('customBackground'),
    };
  }

  static getDefaultIntervals() {
    return {
      [INTERVAL_KEYS.SESSION]: {
        id: INTERVAL_KEYS.SESSION,
        name: 'Работа',
        duration: getInitialValue('duration', INTERVAL_KEYS.SESSION),
        endSound: getInitialValue('endSound', INTERVAL_KEYS.SESSION),
      },
      [INTERVAL_KEYS.BREAK]: {
        id: INTERVAL_KEYS.BREAK,
        name: 'Отдых',
        duration: getInitialValue('duration', INTERVAL_KEYS.BREAK),
        endSound: getInitialValue('endSound', INTERVAL_KEYS.BREAK),
      }
    }
  }

  /** Seconds to increase/decrease the interval at once */
  INCREMENT = 5;

  /** Minimum duration of interval in seconds */
  MINIMUM_DURATION = 5;

  /** Container for setInterval */
  counter = {};

  pause() {
    clearInterval(this.counter);
    this.setState({
      isRunning: false
    })
  }

  stop() {
    const { currentIntervalId, intervalsById } = this.state;
    clearInterval(this.counter);
    this.setState({
      secondsRemaining: intervalsById[currentIntervalId].duration,
      isRunning: false
    })
  }

  /** Starts or continues timer */
  start() {
    const { isRunning } = this.state;
    if (isRunning) return;

    this.setState({
      isRunning: true
    });
    this.counter = setInterval(this.tick, 1000);
  }

  /**  Processes 1 tick of timer. Reduces remainingSeconds until 0 and then switches to next interval. */
  tick = () => {
    let { secondsRemaining, intervalsById, currentIntervalId } = this.state;

    if (secondsRemaining === 0) {
      const soundSrc = intervalsById[currentIntervalId].endSound;

      playSound(soundSrc);
      this.handleIntervalFinishOnDevice();
      return;
    }

    secondsRemaining--;

    this.setState({
      secondsRemaining
    })
  }

  handleIntervalFinishOnDevice = () => {
    this.pause();
    navigator.vibrate(3000);
    const intervalName = this.state.intervalsById[this.state.currentIntervalId].name;
    const message = `Интервал "${intervalName}" закончен. Смените деятельность.`;
    navigator.notification.alert(message, this.handleConfirmIntervalEnd, 'Смена интервала');
  };

  handleConfirmIntervalEnd = () => {
    this.setNextInterval();
    this.start();
  };

  setNextInterval = () => {
    let { intervalsById, currentIntervalId } = this.state;
    currentIntervalId = next(intervalsById, currentIntervalId.toString()).id;

    const secondsRemaining = intervalsById[currentIntervalId].duration;
    this.setState({
      currentIntervalId,
      secondsRemaining,
    });
  };

  onStartClick = () => this.start();
  onPauseClick = () => this.pause();
  onStopClick = () => this.stop();
  onSkipNextClick = () => this.setNextInterval();

  onIncreaseSessionTouchStart = () => this.increaseInterval(INTERVAL_KEYS.SESSION);
  onIncreaseBreakClick = () => this.increaseInterval(INTERVAL_KEYS.BREAK);

  onDecreaseSessionTouchStart = () => this.decreaseInterval(INTERVAL_KEYS.SESSION);
  onDecreaseBreakClick = () => this.decreaseInterval(INTERVAL_KEYS.BREAK);

  render() {
    const content = this.state.page === 'settings'
      ? this.renderSettings()
      : this.renderMain();

    const footerData = this.state.page === 'settings'
      ? { onTouchStart: this.goToHome, title: 'Назад'}
      : { onTouchStart: this.goToSettings, title: 'Настройки'};

    return (
      <div className="timer" style={{ backgroundImage: `url(${this.state.customBackground})` }}>
        {content}
        <div className="timer__section timer__section_nav" onTouchStart={footerData.onTouchStart}>
          {footerData.title}
        </div>
      </div>
    )
  }

  renderMain() {
    const { intervalsById, currentIntervalId, secondsRemaining, isRunning } = this.state;

    const currentInterval = intervalsById[currentIntervalId];
    const displayTimer = formatSeconds(secondsRemaining);
    const percentFinished = (1 - secondsRemaining / currentInterval.duration);

    const pauseOrPlayIcon = isRunning
      ? <Icon name="pause" onTouchStart={this.onPauseClick}/>
      : <Icon name="play" onTouchStart={this.onStartClick}/>;

    return ([
        <div className="timer__section timer__section_controls" key={1}>
          <Icon name="stop" onTouchStart={this.onStopClick}/>
          {pauseOrPlayIcon}
          <Icon name="skip-next" onTouchStart={this.onSkipNextClick}/>
        </div>,
        <div className="timer__section" key={2}>
          <div className="timer__interval-name">{currentInterval.name}</div>
          <SemiCircle
            progress={percentFinished}
            text={displayTimer}
            options={PROGRESSBAR_SETTINGS.options}
            initialAnimate={true}
            containerStyle={PROGRESSBAR_SETTINGS.containerStyle}/>
        </div>,
    ])
  }

  renderSettings() {
    const { intervalsById } = this.state;
    const displaySessionLength = formatSeconds(intervalsById[INTERVAL_KEYS.SESSION].duration);
    const displayBreakLength = formatSeconds(intervalsById[INTERVAL_KEYS.BREAK].duration);
    return (
      <div className="timer__section">
        <div className="settings">
          <div className="settings__label">Длительность работы:</div>
          <div className="settings__content">
            <div className="timer__info-digits">{displaySessionLength}</div>
            <Icon name="minus" onTouchStart={this.onDecreaseSessionTouchStart}/>
            <Icon name="plus" onTouchStart={this.onIncreaseSessionTouchStart}/>
            <ResetControl
              onResetConfirm={this.handleSessionDurationReset}
              defaultValue={getDefaultValue('duration', INTERVAL_KEYS.SESSION)}
              currentValue={intervalsById[INTERVAL_KEYS.SESSION].duration}
            />
          </div>
        </div>
        <div className="settings">
          <div className="settings__label">Длительность отдыха: </div>
          <div className="settings__content">
            <div className="timer__info-digits">{displayBreakLength}</div>
            <Icon name="minus" onTouchStart={this.onDecreaseBreakClick}/>
            <Icon name="plus" onTouchStart={this.onIncreaseBreakClick}/>
            <ResetControl
              onResetConfirm={this.handleBreakDurationReset}
              defaultValue={getDefaultValue('duration', INTERVAL_KEYS.BREAK)}
              currentValue={intervalsById[INTERVAL_KEYS.BREAK].duration}
            />
          </div>
        </div>
        <div className="settings">
          <div className="settings__label">Звук окончания отдыха:</div>
          <SoundSetting
            soundSrc={this.state.intervalsById[INTERVAL_KEYS.BREAK].endSound}
            defaultSoundSrc={getDefaultValue('endSound', INTERVAL_KEYS.BREAK)}
            name={INTERVAL_KEYS.BREAK}
            onSoundChange={this.handleBreakSoundChange}
            onResetConfirm={this.handleBreakSoundReset}
          />
        </div>
        <div className="settings">
          <div className="settings__label">Звук окончания работы:</div>
          <SoundSetting
            soundSrc={this.state.intervalsById[INTERVAL_KEYS.SESSION].endSound}
            defaultSoundSrc={getDefaultValue('endSound', INTERVAL_KEYS.SESSION)}
            name={INTERVAL_KEYS.SESSION}
            onSoundChange={this.handleSessionSoundChange}
            onResetConfirm={this.handleSessionSoundReset}
          />
        </div>
        <div className="settings settings_inline" style={{ marginTop: 20 }}>
          <div className="settings__label" style={{ marginRight: 20 }}>Фон: </div>
          <PictureUpload
            currentValue={this.state.customBackground}
            defaultValue={getDefaultValue('customBackground')}
            onUpload={this.handlePictureUpload}
            onResetConfirm={this.handleCustomBackgroundReset}
          />
        </div>
      </div>
    )
  }

  handleCustomBackgroundReset = () => {
    window.localStorage.removeItem('customBackground');
    this.setState({ customBackground: null });
  };

  handlePictureUpload = (imagePath) => {
    window.localStorage.setItem('customBackground', imagePath);
    this.setState({
      customBackground: imagePath
    })
  };

  goToHome = () => {
    this.stop();
    this.setState({ page: 'home' })
  };

  goToSettings = () => {
    this.setState({ page: 'settings' })
  };

  increaseInterval(intervalId) {
    const { intervalsById } = this.state;
    const currentDuration = intervalsById[intervalId].duration;
    const duration = currentDuration + this.INCREMENT;

    this.setIntervalDuration(duration, intervalId);
  }

  decreaseInterval(intervalId) {
    const { intervalsById } = this.state;
    const currentDuration = intervalsById[intervalId].duration;

    if (currentDuration > this.MINIMUM_DURATION) {
      const duration = currentDuration - this.INCREMENT;

      this.setIntervalDuration(duration, intervalId);
    }
  }

  setIntervalDuration = (duration, intervalId) => {
    const { isRunning } = this.state;
    window.localStorage.setItem(
      getStorageKey('duration', intervalId),
      duration,
    );

    this.setStateForInterval(intervalId, { duration });
    if (!isRunning) this.stop();
  };

  _createResetSettingHandler = (key, intervalId) => () => {
    this.stop();
    deleteFromLocalStorage(key, intervalId);
    const defaultValue = getDefaultValue(key, intervalId);
    this.setStateForInterval(intervalId, { [key]: defaultValue });
  };

  _createSoundChangeHandler = (intervalId) => (soundSrc) => {
    const storageKey = getStorageKey('endSound', intervalId);
    window.localStorage.setItem(storageKey, soundSrc);
    this.setStateForInterval(intervalId, { endSound: soundSrc });
  };

  setStateForInterval(intervalId, patch) {
    this.setState({
      intervalsById: {
        ...this.state.intervalsById,
        [intervalId]: {
          ...this.state.intervalsById[intervalId],
          ...patch,
        }
      }
    })
  }

  handleBreakSoundChange = this._createSoundChangeHandler(INTERVAL_KEYS.BREAK);
  handleSessionSoundChange = this._createSoundChangeHandler(INTERVAL_KEYS.SESSION);

  handleBreakSoundReset = this._createResetSettingHandler('endSound', INTERVAL_KEYS.BREAK);
  handleSessionSoundReset = this._createResetSettingHandler('endSound', INTERVAL_KEYS.SESSION);

  handleBreakDurationReset = this._createResetSettingHandler('duration', INTERVAL_KEYS.BREAK);
  handleSessionDurationReset = this._createResetSettingHandler('duration', INTERVAL_KEYS.SESSION);
}