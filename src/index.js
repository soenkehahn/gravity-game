// @flow

import React from "react";
import ReactDOM from "react-dom";

import { SceneComponent } from "./ui/scene";

const root = document.getElementById("root");
if (root) {
  ReactDOM.render(<SceneComponent startLevel={1} />, root);
} else {
  throw new Error("root not found");
}
