import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const HideableView = (props) => {
  const { children, hide, style } = props;
  if (hide) {
    return (<View></View>);
  }
  return (<View {...this.props} style={style}>{children}</View>);
};

HideableView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ])),
  ]).isRequired,
  hide: PropTypes.bool,
};

export default HideableView;