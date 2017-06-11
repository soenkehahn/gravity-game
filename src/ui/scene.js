// @flow

const React = require('react')
global.React = React

import type {Control, Level, SceneObject} from '../scene'
import {Scene, castToControl, Player, GravityPlanet, ForbiddenPlanet, EndPlanet}
  from '../scene'

type Props = {|
  startLevel: Level
|}

type State = {|
  level: Level,
  scene: Scene,
  pressed: Set<Control>,
  lastTime: ?number,
|}

export class SceneComponent extends React.Component<void, Props, State> {

  state: State

  constructor(props: Props) {
    super(props)
    this.state = this._newScene(props.startLevel)
  }

  _newScene(level: Level): State {
    return {
      level: level,
      scene: new Scene(level),
      pressed: new Set(),
      lastTime: null,
    }
  }

  componentDidMount() {
    this.addKeyboardEventListener('keydown', event => {
      const control = castToControl(event.code)
      if (control && (! event.repeat)) {
        event.preventDefault()
        const state = this.state
        state.pressed.add(control)
        this.setState(state)
      }
    })

    this.addKeyboardEventListener('keyup', event => {
      const state = this.state
      const control = castToControl(event.code)
      if (control) {
        state.pressed.delete(control)
        this.setState(state)
      }
    })

    requestAnimationFrame((now) => this.loop(now))
  }

  addKeyboardEventListener(type: KeyboardEventTypes, callback: KeyboardEventListener) {
    document.addEventListener(type, callback)
  }

  loop(now: number) {
    if (!this.state.lastTime) {
      this.setState({lastTime: now})
    } else {
      const scene = this.state.scene
      scene.step(this.state.pressed, now - this.state.lastTime)
      if (scene.state === 'success' || this.state.pressed.has('F7')) {
        this._nextLevel()
      } else if (this.state.pressed.has('F6')) {
        this._previousLevel()
      } else if (this._shouldRestart()) {
        this.setState(this._newScene(this.state.level))
      } else {
        this.setState({scene: scene, lastTime: now})
      }
    }
    requestAnimationFrame((now) => this.loop(now))
  }

  _shouldRestart() {
    const pressed = this.state.pressed
    return pressed.has('Enter') || pressed.has('Space')
  }

  _nextLevel() {
    if (typeof(this.state.level) === 'number') {
      this.setState(this._newScene(this.state.level + 1))
    }
  }

  _previousLevel() {
    if (typeof(this.state.level) === 'number') {
      this.setState(this._newScene(this.state.level - 1))
    }
  }

  render() {
    const attractorsActive = this.state.pressed.has('Space')
    const textStyle = {
      position: "absolute",
      margin: "10px",
      color: "white",
      'fontFamily': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    }
    let levelName: string
    if (this.state.scene.name) {
      levelName = this.state.scene.name
    } else {
      levelName = `untitled (${this.state.level})`
    }
    return <div style={{cursor: "none"}}>
      <div style={textStyle}>
        Controls: Arrow keys to move, Space to reset the level
        <br/>
        <div>{`Level: ${levelName}`}</div>
      </div>
      <Render scene={this.state.scene} attractorsActive={attractorsActive} />
    </div>
  }
}

class Render extends React.Component<void, {scene: Scene, attractorsActive: boolean}, void> {

  _renderUIObject(o: SceneObject, i: number): * {
    if (o instanceof Player) {
      return <circle key={i}
        cx={o.position.x} cy={o.position.y}
        r={o.radius}
        fill="blue" />
    } else if (o instanceof EndPlanet) {
      return <circle key={i}
        cx={o.position.x} cy={o.position.y}
        r={o.radius}
        fill="green" />
    } else if (o instanceof GravityPlanet) {
      let color = "gray"
      if (o.isActive) {
        color = "yellow"
      }
      return <g key={i}>
        <circle key="planet"
          cx={o.position.x} cy={o.position.y}
          r={o.radius}
          fill={color} />
        <circle key="influence"
          cx={o.position.x} cy={o.position.y}
          r={o.influenceSize}
          fill={color}
          fillOpacity={0.7} />
      </g>
    } else if (o instanceof ForbiddenPlanet) {
      return <g key={i}>
        <circle key="planet"
          cx={o.position.x} cy={o.position.y}
          r={o.radius}
          fill="red" />
      </g>
    }
    throw new Error('unknown SceneObject class: ' + o.constructor.name)
  }

  render() {
    const objects = this.props.scene.toSceneObjects()
    const viewBox = getViewBox()
    return <svg
      xmlns="http://www.w3.org/2000/svg"

      viewBox={viewBox.viewBox}
      width={viewBox.width}
      height={viewBox.height}
      >

      <rect
        x={-100} y={-100}
        width={200} height={200}
        fill="black" />
      {objects.map((o, i) => this._renderUIObject(o, i))}
    </svg>
  }

}

export function getViewBox() {
  const ratio = window.innerWidth / window.innerHeight
  let height, width
  if (ratio > 1) {
    height = 40
    width = Math.floor(height * ratio)
  } else {
    width = 40
    height = Math.floor(width / ratio)
  }
  const minX = -width / 2
  const minY = -height / 2
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    viewBox: `${minX} ${minY} ${width.toString()} ${height.toString()}`,
  }
}
