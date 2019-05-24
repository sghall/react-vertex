import React, { useMemo, useState, useEffect } from 'react'
import { render } from 'react-dom'
import { CompactPicker } from 'react-color'
import Select from 'react-select'
import { useHex, convertHex } from '@react-vertex/color-hooks'
import Slider from './Slider'

const theme = {
  text: '#333',
  background: '#fff',
  border: '1px solid #eee',
}

const controlsId = 'react-vertex-controls-root'
const controlsClass = 'react-vertex-control'

const textStyles = {
  fontSize: '0.7rem',
  fontFamily: 'Roboto, Arial, Helvetica, Sans-Serif',
}

function useControlsRoot() {
  const memoized = useMemo(() => {
    const existing = document.getElementById(controlsId)

    if (existing) {
      return existing
    }

    const controlsRoot = document.createElement('div')
    controlsRoot.setAttribute('id', controlsId)
    controlsRoot.style.width = '230px'
    controlsRoot.style.backgroundColor = theme.background
    controlsRoot.style.position = 'fixed'
    controlsRoot.style.top = '0'
    controlsRoot.style.right = '0'
    controlsRoot.style.zIndex = '10000'
    document.body.appendChild(controlsRoot)

    const button = document.createElement('button')
    button.style.backgroundColor = theme.background
    button.style.color = theme.text
    button.style.border = theme.border
    button.style.borderRadius = '4px'
    button.style.width = '100%'
    button.style.height = '35px'
    button.style.outline = 'none'
    button.style.cursor = 'pointer'
    button.style.userSelect = 'none'
    button.style.WebkitTapHighlightColor = 'transparent'
    button.style.zIndex = '10005'
    button.innerHTML = 'Show/Hide Dev Controls'
    controlsRoot.appendChild(button)

    const controlsContainer = document.createElement('div')
    controlsContainer.classList.add('container')
    controlsContainer.style.backgroundColor = theme.background
    controlsContainer.style.borderRadius = '4px'
    controlsContainer.style.width = '100%'
    controlsContainer.style.position = 'absolute'
    controlsRoot.appendChild(controlsContainer)

    button.addEventListener('click', () => {
      if (
        !controlsContainer.style.top ||
        controlsContainer.style.top === 'unset'
      ) {
        controlsContainer.style.top = '-5000px'
      } else {
        controlsContainer.style.top = 'unset'
      }
    })

    return controlsRoot
  }, [])

  return memoized
}

export function useValueSlider(label, value, min = 1, max = 100, step = 1) {
  const [float, setFloat] = useState(value)
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return null
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const controlContainer = document.createElement('div')
    controlContainer.classList.add(controlsClass)
    container.appendChild(controlContainer)

    function ValueSliderApp() {
      return (
        <Slider
          defaultValues={[value]}
          step={step}
          label={label}
          domain={[min, max]}
          onUpdate={setFloat}
        />
      )
    }

    render(<ValueSliderApp />, controlContainer)

    return () => {
      container.removeChild(controlContainer)

      const sliders = container.getElementsByClassName(controlsClass)

      if (sliders.length === 0) {
        const root = document.getElementById(controlsId)
        document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label, value, min, max, step])

  return Array.isArray(float) ? float[0] : float
}

export function useColorSlider(label, hex, noAlpha = false) {
  const inputColor = useHex(hex, noAlpha)

  const [color, setColor] = useState(inputColor)
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return null
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const controlContainer = document.createElement('div')
    controlContainer.classList.add(controlsClass)
    container.appendChild(controlContainer)

    function updateColor(color) {
      setColor(convertHex(color.hex, noAlpha))
    }

    function ColorSelectorApp() {
      return (
        <div style={{ padding: 5 }}>
          <div
            style={{
              paddingLeft: 15,
              ...textStyles,
            }}
          >
            {label}
          </div>
          <CompactPicker color={hex} onChangeComplete={updateColor} />
        </div>
      )
    }

    render(<ColorSelectorApp />, controlContainer)

    return () => {
      container.removeChild(controlContainer)

      const controls = container.getElementsByClassName(controlsClass)

      if (controls.length === 0) {
        const root = document.getElementById(controlsId)
        document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label, hex, noAlpha])

  return color
}

export function useSelectControl(label, options) {
  const [option, setOption] = useState(options[0])
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return null
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const selectContainer = document.createElement('div')
    selectContainer.classList.add(controlsClass)
    container.appendChild(selectContainer)

    function updateOption(value) {
      setOption(value)
    }

    function SelectControlApp() {
      const customStyles = {
        menu: provided => {
          return { ...provided, zIndex: 50010 }
        },
        container: provided => {
          return { ...provided, ...textStyles }
        },
      }

      return (
        <div style={{ padding: 5 }}>
          <Select
            styles={customStyles}
            defaultValue={option}
            onChange={updateOption}
            options={options}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: '#eee',
                primary: 'rgb(155,155,155)',
              },
            })}
          />
        </div>
      )
    }

    render(<SelectControlApp />, selectContainer)

    return () => {
      container.removeChild(selectContainer)

      const controls = container.getElementsByClassName(controlsClass)

      if (controls.length === 0) {
        const root = document.getElementById(controlsId)
        document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label])

  return option
}
