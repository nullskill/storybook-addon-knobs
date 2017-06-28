import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
};


class NumberType extends React.Component {

  constructor(props) {
    super(props);
    this.renderNormal = this.renderNormal.bind(this);
    this.renderRange = this.renderRange.bind(this);
  }

  renderNormal() {
    const { knob, onChange } = this.props;

    return (<input
      id={knob.name}
      ref="input"
      style={styles}
      value={knob.value}
      type="number"
      onChange={() => onChange(parseFloat(this.refs.input.value))}
    />);
  }

  renderRange() {
    const { knob, onChange } = this.props;

    return (<input
      id={knob.name}
      ref="input"
      style={styles}
      value={knob.value}
      type="range"
      min={knob.min}
      max={knob.max}
      step={knob.step}
      onChange={() => onChange(parseFloat(this.refs.input.value))}
    />);
  }

  render() {
    const { knob } = this.props;

    return knob.range ? this.renderRange() : this.renderNormal();
  }
}

NumberType.propTypes = {
  knob: PropTypes.object,
  onChange: PropTypes.func,
};

NumberType.serialize = function (value) {
  return String(value);
};

NumberType.deserialize = function (value) {
  return parseFloat(value);
};

export default NumberType;
