import React, { Fragment } from 'react';
import {
  GetRailProps,
  GetHandleProps,
  GetTrackProps,
  SliderItem,
} from 'react-compound-slider';

// *******************************************************
// RAIL COMPONENT
// *******************************************************
const railStyle: {
  outer: React.CSSProperties;
  inner: React.CSSProperties;
} = {
  outer: {
    position: 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 42,
    borderRadius: 21,
    cursor: 'pointer',
  },
  inner: {
    position: 'absolute' as 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 4,
    borderRadius: 2,
    pointerEvents: 'none' as 'none',
    backgroundColor: 'rgb(155,155,155)',
  },
};

export function SliderRail({ getRailProps }: { getRailProps: GetRailProps }) {
  return (
    <Fragment>
      <div style={railStyle.outer} {...getRailProps()} />
      <div style={railStyle.inner} />
    </Fragment>
  );
}

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
const handleStyle: {
  outer: React.CSSProperties;
  inner: React.CSSProperties;
} = {
  outer: {
    zIndex: 5,
    width: 20,
    height: 40,
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    backgroundColor: 'none',
    position: 'absolute',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  },
  inner: {
    zIndex: 2,
    width: 12,
    height: 12,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    position: 'absolute',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  },
};

interface HandleComponentProps {
  activeHandleID: string;
  domain: number[];
  handle: {
    id: string;
    value: number;
    percent: number;
  };
  getHandleProps: GetHandleProps;
}

export function Handle({
  activeHandleID,
  handle: { id, percent },
  getHandleProps,
}: HandleComponentProps) {
  let boxShadow = 'none';

  if (activeHandleID === id) {
    boxShadow = '0px 0px 0px 16px rgba(205, 205, 205, 0.3)';
  }

  return (
    <Fragment>
      <div
        style={{ ...handleStyle.outer, left: `${percent}%` }}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        style={{ ...handleStyle.inner, left: `${percent}%`, boxShadow }}
      />
    </Fragment>
  );
}

// *******************************************************
// TRACK COMPONENT
// *******************************************************
const trackStyle: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(0%, -50%)',
  height: 4,
  zIndex: 1,
  borderRadius: 2,
  cursor: 'pointer',
  backgroundColor: '#009a9a',
};

interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
}

export function Track({ source, target, getTrackProps }: TrackProps) {
  return (
    <div
      style={{
        ...trackStyle,
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
}

// *******************************************************
// TICK COMPONENT
// *******************************************************
const tickStyle: {
  tick: React.CSSProperties;
  label: React.CSSProperties;
} = {
  tick: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: -1,
    width: 2,
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  label: {
    position: 'absolute',
    marginTop: 16,
    textAlign: 'center',
  },
};

interface TickProps {
  tick: SliderItem;
  count: number;
  format: (d: number) => string;
}

export function Tick({ tick, count, format }: TickProps) {
  return (
    <div>
      <div style={{ ...tickStyle.tick, left: `${tick.percent}%` }} />
      <div
        style={{
          ...tickStyle.label,
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
          fontSize: '10px',
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  );
}
