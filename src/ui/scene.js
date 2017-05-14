// @flow

const React = require('react')
global.React = React

import {Scene, castToDirection} from '../scene'
import type {Direction} from '../scene'

type State = {|
  scene: Scene,
  pressed: Array<Direction>,
  lastTime: ?number,
|}

export class SceneComponent extends React.Component<void, {}, State> {

  state = {
    scene: new Scene(),
    pressed: [],
    lastTime: null,
  }

  componentDidMount() {
    this.addKeyboardEventListener('keydown', event => {
      const direction = castToDirection(event.key)
      if (direction) {
        const state = this.state
        state.pressed.push(direction)
        this.setState(state)
      }
    })

    this.addKeyboardEventListener('keyup', event => {
      const state = this.state
      state.pressed = state.pressed.filter((d) => d !== event.key)
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
  render() {
    const objects = this.props.scene.toObjects()
    return <svg viewBox="-10 -10 20 20" width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      {objects.map((object, i) => {
        const position = object.position
        return <circle key={i} r="1" cx={position.x} cy={position.y} fill="blue" />
      })}
    </svg>
  }
}
