import STYLES from "./point.css"
import TEMPLATE from "./point.html"

export class LitMapper extends HTMLElement {
  static TAG_NAME = 'lit-mapper'
  static Init() {
    customElements.define(this.TAG_NAME, this)
  }

  private _root = this.attachShadow({mode: "open"})

  constructor() {
    super()
    this._root.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`
  }
}
