import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

// *******************************************************
// RAIL COMPONENT
// *******************************************************
const railStyle = {
  outer: {
    position: 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 42,
    borderRadius: 21,
    cursor: 'pointer',
  },
  inner: {
    position: 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 4,
    borderRadius: 2,
    pointerEvents: 'none',
    backgroundColor: 'rgb(155,155,155)',
  },
}

function RailComponent({ getRailProps }) {
  return (
    <Fragment>
      <div style={railStyle.outer} {...getRailProps()} />
      <div style={railStyle.inner} />
    </Fragment>
  )
}

RailComponent.propTypes = {
  getRailProps: PropTypes.func.isRequired,
}

export const SliderRail = RailComponent

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
const handleStyle = {
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
    backgroundColor: '#009a9a',
    position: 'absolute',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  },
}

function HandleComponent({
  activeHandleID,
  handle: { id, percent },
  getHandleProps,
}) {
  let boxShadow = 'none'

  if (activeHandleID === id) {
    boxShadow = '0px 0px 0px 16px rgba(0, 205, 205, 0.2)'
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
  )
}

HandleComponent.propTypes = {
  activeHandleID: PropTypes.string,
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
}

export const Handle = HandleComponent

// *******************************************************
// TRACK COMPONENT
// *******************************************************
const trackStyle = {
  position: 'absolute',
  transform: 'translate(0%, -50%)',
  height: 4,
  zIndex: 1,
  borderRadius: 2,
  cursor: 'pointer',
  backgroundColor: '#009a9a',
}

function TrackComponent({ source, target, getTrackProps }) {
  return (
    <div
      style={{
        ...trackStyle,
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  )
}

TrackComponent.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
}

export const Track = TrackComponent

// *******************************************************
// TICK COMPONENT
// *******************************************************
const tickStyle = {
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
}

export function TickComponent({ tick, count, format }) {
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
  )
}

TickComponent.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired,
}

TickComponent.defaultProps = {
  format: d => d,
}

export const Tick = TickComponent
