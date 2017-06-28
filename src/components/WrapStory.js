import React from 'react';
import PropTypes from 'prop-types';

export default class WrapStory extends React.Component {
  constructor(props) {
    super(props);
    this.knobChanged = this.knobChanged.bind(this);
    this.resetKnobs = this.resetKnobs.bind(this);
    this.setPaneKnobs = this.setPaneKnobs.bind(this);
    this._knobsAreReset = false;
    this.state = { storyContent: this.props.initialContent };
  }

  componentDidMount() {
    // Watch for changes in knob editor.
    this.props.channel.on('addon:knobs:knobChange', this.knobChanged);
    // Watch for the reset event and reset knobs.
    this.props.channel.on('addon:knobs:reset', this.resetKnobs);
    // Watch for any change in the knobStore and set the panel again for those
    // changes.
    this.props.knobStore.subscribe(this.setPaneKnobs);
    // Set knobs in the panel for the first time.
    this.setPaneKnobs();
  }

  componentWillReceiveProps(props) {
    this.setState({ storyContent: props.initialContent });
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    this.props.channel.removeListener('addon:knobs:reset', this.resetKnobs);
    this.props.knobStore.unsubscribe(this.setPaneKnobs);
  }

  setPaneKnobs() {
    const { channel, knobStore } = this.props;
    channel.emit('addon:knobs:setKnobs', knobStore.getAll());
  }

  knobChanged(change) {
    const { name, value } = change;
    const { knobStore, storyFn, context } = this.props;
    // Update the related knob and it's value.
    const knobOptions = knobStore.get(name);
    knobOptions.value = value;
    knobStore.markAllUnused();
    this.setState({ storyContent: storyFn(context) });
  }

  resetKnobs() {
    const { knobStore, storyFn, context } = this.props;
    knobStore.reset();
    this.setState({ storyContent: storyFn(context) });
    this.setPaneKnobs();
  }

  render() {
    return this.state.storyContent;
  }
}

WrapStory.propTypes = {
  context: PropTypes.object,
  storyFn: PropTypes.func,
  channel: PropTypes.object,
  knobStore: PropTypes.object,
  initialContent: PropTypes.object,
};
