import React from 'react';

import { Icon } from "../Icon/index";

export class ResetControl extends React.Component {

  actionSheetOptions = {
    'buttonLabels': ['Сбросить'],
    'androidEnableCancelButton' : true,
    'addCancelButtonWithLabel': 'Отмена'
  };

  resetBtnIdx = 1;

  render() {
    const { defaultValue, currentValue } = this.props;

    if (
      defaultValue !== undefined
      && currentValue !== undefined
      && defaultValue === currentValue
    ) {
      return null;
    }

    return (
      <Icon name="reload" onTouchStart={this.handleClick}/>
    )
  }

  handleClick = () => {
    window.plugins.actionsheet.show(this.actionSheetOptions, this.actionSheetCallback);
  };

  actionSheetCallback = (buttonIndex) => {
    if (buttonIndex === this.resetBtnIdx) {
      this.props.onResetConfirm();
    }
  }
}
