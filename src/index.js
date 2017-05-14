// @flow

import ReactDOM from 'react-dom'

import {SceneComponent} from './ui/scene'
import {mkScene} from './scene'

const root = document.getElementById('root')
const scene = mkScene()
ReactDOM.render(<SceneComponent scene={scene} />, root)
