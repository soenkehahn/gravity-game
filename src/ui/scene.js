// @flow

const React = require('react')
global.React = React

import {castToDirection, mkScene} from '../scene'
import type {Scene} from '../scene'

export class SceneComponent extends React.Component<void, {}, {| scene: Scene |}> {

  state = {scene: mkScene()}

  componentDidMount() {
    const handler: KeyboardEventListener = event => {
      const direction = castToDirection(event.key)
      if (direction) {
        const scene = this.state.scene
        scene.step(direction)
        this.setState({scene: scene})
      }
    }
    document.addEventListener('keydown', handler)
  }

  render() {
    return <div>
      <Render scene={this.state.scene} />
    </ div>
  }
}

class Render extends React.Component<void, {scene: Scene}, void> {
  render() {
    const objects = this.props.scene.toObjects()
    return <svg viewBox="-10 -10 20 20" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      {objects.map((object, i) => {
        const position = object.position
        return <circle key={i} r="1" cx={position.x} cy={position.y} fill="blue" />
      })}
    </svg>
  }
}
