import { memo } from 'react'
import useSimulation from './simulation'

function Scene() {
  useSimulation()

  return null
}

Scene.propTypes = {}

export default memo(Scene)
