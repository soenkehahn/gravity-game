// @flow

const React = require('react')
global.React = React

import type {Control, Level, SceneObject} from '../scene'
import {Scene, castToControl, Player, Planet, EndPlanet} from '../scene'

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
      if (scene.state === 'success') {
        this._nextLevel()
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

  render() {
    const attractorsActive = this.state.pressed.has('Space')
    return <div>
      <Render scene={this.state.scene} attractorsActive={attractorsActive} />
      <br/>
      Controls: Arrow keys to move, Space to restart the level
      <br/>
      {`Level: ${this.state.level}`}
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
    } else if (o instanceof Planet) {
      return <g key={i}>
        <circle key="planet"
          cx={o.position.x} cy={o.position.y}
          r={o.radius}
          fill="yellow" />
        <circle key="influence"
          cx={o.position.x} cy={o.position.y}
          r={o.influenceSize}
          fill="yellow"
          fillOpacity={0.5} />
      </g>
    }
    throw new Error('unknown SceneObject class: ' + o.constructor.name)
  }

  render() {
    const objects = this.props.scene.toObjects()
    return <svg
      viewBox="-20 -20 40 40"
      width="500" height="500"
      xmlns="http://www.w3.org/2000/svg">

      <filter id="activeBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.1" />
      </filter>

      <rect x={-20} y={-20} width={40} height={40} fill="black" />
      {objects.map((o, i) => this._renderUIObject(o, i))}
    </svg>
  }

}
