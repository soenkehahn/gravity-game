// @flow

const React = require('react')
global.React = React

import type {UIObjectType} from '../objects'
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
    return <Render scene={this.state.scene} />
  }
}

class Render extends React.Component<void, {scene: Scene}, void> {

  typeColor(type: UIObjectType): string {
    if (type === 'player') {
      return 'blue'
    } else if (type === 'planet') {
      return 'yellow'
    }
    return 'white'
  }

  render() {
    const objects = this.props.scene.toObjects()
    return <svg
      viewBox="-10 -10 20 20"
      width="400" height="400"
      xmlns="http://www.w3.org/2000/svg">
      <rect x={-10} y={-10} width={20} height={20} fill="gray" />
      {objects.map((object, i) => {
        const position = object.position
        return <circle key={i}
          cx={position.x} cy={position.y}
          r={object.radius}
          fill={this.typeColor(object.type)} />
      })}
    </svg>
  }

}
