import React, { useMemo, useState, useEffect } from 'react'
import { render } from 'react-dom'
import { CompactPicker, ColorChangeHandler, ColorResult } from 'react-color'
import Select, { OptionsType, ValueType } from 'react-select'
import { useHex, convertHex } from '@react-vertex/color-hooks'
import { ValueSlider } from './Slider'

const theme = {
  text: '#333',
  background: '#fff',
  border: '1px solid #eee',
}

const controlsId = 'react-vertex-controls-root'
const controlsClass = 'react-vertex-control'

const textStyles = {
  color: '#333',
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
    button.style.webkitTapHighlightColor = 'transparent'
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

export function useValueSlider(
  label: string,
  value: number,
  min: number = 1,
  max: number = 100,
  step: number = 1,
) {
  const [float, setFloat] = useState(value)
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const controlContainer = document.createElement('div')
    controlContainer.classList.add(controlsClass)
    container.appendChild(controlContainer)

    function ValueSliderApp() {
      return (
        <ValueSlider
          defaultValues={[value]}
          step={step}
          label={label}
          domain={[min, max]}
          onUpdate={d => setFloat(d[0])}
        />
      )
    }

    render(<ValueSliderApp />, controlContainer)

    return () => {
      container.removeChild(controlContainer)

      const sliders = container.getElementsByClassName(controlsClass)

      if (sliders.length === 0) {
        const root = document.getElementById(controlsId)
        root && document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label, value, min, max, step])

  return Array.isArray(float) ? float[0] : float
}

type ColorObject = {
  hex: string
  webgl: number[]
}

export function useColorPicker(label: string, hex: string, noAlpha = false) {
  const inputColor = useHex(hex, noAlpha)

  const [color, setColor] = useState<ColorObject>({ webgl: inputColor, hex })
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const controlContainer = document.createElement('div')
    controlContainer.classList.add(controlsClass)
    container.appendChild(controlContainer)

    function ColorPickerApp({ activeColor }: { activeColor: string }) {
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
          <CompactPicker
            color={activeColor}
            onChange={updateColor}
            onChangeComplete={updateColor}
          />
        </div>
      )
    }

    function updateColor(c: ColorResult) {
      setColor({
        hex: c.hex,
        webgl: convertHex(c.hex, noAlpha),
      })
      render(<ColorPickerApp activeColor={c.hex} />, controlContainer)
    }

    render(<ColorPickerApp activeColor={color.hex} />, controlContainer)

    return () => {
      container.removeChild(controlContainer)

      const controls = container.getElementsByClassName(controlsClass)

      if (controls.length === 0) {
        const root = document.getElementById(controlsId)
        root && document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label, hex, noAlpha])

  return color.webgl
}

export function useSelectControl<T>(label: string, options: OptionsType<T>) {
  const [option, setOption] = useState<ValueType<T, false>>(options[0])
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return
    }

    const container = controlsRoot.getElementsByClassName('container')
    const selectContainer = document.createElement('div')
    selectContainer.classList.add(controlsClass)
    container[0].appendChild(selectContainer)

    function updateOption(value: ValueType<T, false>) {
      setOption(value)
    }

    function SelectControlApp() {
      const customStyles: any = {
        control: (provided: React.CSSProperties) => {
          return {
            ...provided,
            boxShadow: 'none',
            borderColor: '#ccc',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#ccc',
            },
            '&:focus': {
              outline: 'none',
            },
            outline: 'none',
          }
        },
        menu: (provided: React.CSSProperties) => {
          return { ...provided, marginTop: 2, zIndex: 50010 }
        },
        option: () => {
          return {
            cursor: 'pointer',
            label: 'option',
            backgroundColor: 'transparent',
            color: '#333',
            display: 'block',
            fontSize: 'inherit',
            padding: '8px 12px',
            width: 225,
            userSelect: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
              color: '#fff',
            },
          }
        },
        container: (provided: React.CSSProperties) => {
          return {
            ...provided,
            ...textStyles,
          }
        },
      }

      return (
        <div style={{ padding: '10px 2px 2px' }}>
          <div
            style={{
              paddingLeft: 15,
              ...textStyles,
            }}
          >
            {label}
          </div>
          <Select
            isSearchable={false}
            styles={customStyles}
            defaultValue={option}
            onChange={updateOption}
            options={options}
          />
        </div>
      )
    }

    render(<SelectControlApp />, selectContainer)

    return () => {
      container[0].removeChild(selectContainer)

      const controls = container[0].getElementsByClassName(controlsClass)

      if (controls.length === 0) {
        const root = document.getElementById(controlsId)
        root && document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label])

  return option as T
}
