import React, { Component } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { SliderRail, Handle, Track, Tick } from './components';

const theme = {
  text: '#333',
  color: '#222',
  background: '#fff',
  border: '1px solid #eee',
};

var getPrecsion = function(value: number) {
  if (Math.floor(value) !== value) {
    return value.toString().split('.')[1].length || 0;
  }

  return 0;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '4px 20px',
    border: theme.border,
    color: theme.color,
    backgroundColor: theme.background,
    fontSize: '0.6rem',
    fontFamily: 'Roboto, Arial, Sans-Serif',
  },
  textBox: {
    width: '100%',
    padding: '2px 0px',
    height: 20,
  },
  sliderBox: {
    width: '100%',
  },
  slider: {
    position: 'relative',
    height: 30,
    width: '100%',
  },
};

interface ValueSliderProps {
  step: number;
  label: string;
  domain: number[];
  onUpdate: (vals: readonly number[]) => void;
  defaultValues: number[];
}

interface ValueSliderState {
  update: readonly number[];
  format: (d: number) => string;
}

export class ValueSlider extends Component<ValueSliderProps, ValueSliderState> {
  constructor(props: ValueSliderProps) {
    super(props);

    const [min, max] = props.domain;
    const [value] = props.defaultValues;
    const step = props.step;

    const precision = Math.max(
      getPrecsion(min),
      getPrecsion(max),
      getPrecsion(step),
      getPrecsion(value)
    );

    this.state = {
      update: this.props.defaultValues,
      format: (d: number) => (+d).toFixed(precision),
    };
  }

  onUpdate = (update: readonly number[]) => {
    this.setState({ update }, () => this.props.onUpdate(update));
  };

  render() {
    const { update, format } = this.state;
    const { step, label, domain, defaultValues } = this.props;

    return (
      <div style={styles.container}>
        <div style={styles.textBox}>
          {label} {format(update[0])}
        </div>
        <div style={styles.sliderBox}>
          <Slider
            mode={2}
            step={step}
            domain={domain}
            rootStyle={styles.slider}
            onUpdate={this.onUpdate}
            values={defaultValues}
          >
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ activeHandleID, handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={domain}
                      activeHandleID={activeHandleID}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks left={false} right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
            <Ticks count={5}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      format={format}
                      count={ticks.length}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      </div>
    );
  }
}
