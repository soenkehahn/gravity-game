// @flow

const React = require('react')
global.React = React

import type {UIObject, UIObjectType} from '../objects'
import {Scene, castToControl} from '../scene'
import type {Control, Level} from '../scene'

type Props = {|
  level?: Level
|}

type State = {|
  scene: Scene,
  pressed: Array<Control>,
  lastTime: ?number,
|}

export class SceneComponent extends React.Component<void, Props, State> {

  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      scene: new Scene(props.level),
      pressed: [],
      lastTime: null,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.level !== nextProps.level) {
      this.setState({scene: new Scene(nextProps.level)})
    }
  }

  componentDidMount() {
    this.addKeyboardEventListener('keydown', event => {
      const control = castToControl(event.code)
      if (control) {
        const state = this.state
        state.pressed.push(control)
        this.setState(state)
      }
    })

    this.addKeyboardEventListener('keyup', event => {
      const state = this.state
      state.pressed = state.pressed.filter((d) => d !== event.code)
      this.setState(state)
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
      this.setState({scene: scene, lastTime: now})
    }
    requestAnimationFrame((now) => this.loop(now))
  }

  render() {
    const attractorsActive = this.state.pressed.includes('Space')
    return <div>
      <Render scene={this.state.scene} attractorsActive={attractorsActive} />
      <br/>
      {this.state.scene.state}
    </div>
  }
}

class Render extends React.Component<void, {scene: Scene, attractorsActive: boolean}, void> {

  _renderUIObject(o: UIObject, i: number): * {
    if (o.type === 'player') {
      return <circle key={i}
        cx={o.position.x} cy={o.position.y}
        r={o.radius}
        fill="blue" />
    } else if (o.type === 'end planet') {
      return <circle key={i}
        cx={o.position.x} cy={o.position.y}
        r={o.radius}
        fill="green" />
    } else if (o.type === 'planet') {
      return <g key={i}>
        <circle key="planet"
          cx={o.position.x} cy={o.position.y}
          r={o.radius}
          fill="yellow" />
        <circle key="influence"
          cx={o.position.x} cy={o.position.y}
          r={2}
          fill="yellow"
          fillOpacity={0.5} />
      </g>
    } else if (o.type === 'attractor') {
      let active = null
      if (this.props.attractorsActive) {
        active = <circle key="active"
          cx={o.position.x} cy={o.position.y}
          r={o.radius * 1.3}
          fill="red" filter="url(#activeBlur)"
          />
      }
      return <g key={i}>
        <circle key="()" cx={o.position.x} cy={o.position.y} r={o.radius} fill="red" />
        {active}
      </g>
    }
    throw new Error('unknown UIObjectType: ' + o.type)
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
