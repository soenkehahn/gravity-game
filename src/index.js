// @flow

import ReactDOM from "react-dom";

import { SceneComponent } from "./ui/scene";

const root = document.getElementById("root");
ReactDOM.render(<SceneComponent startLevel={1} />, root);
