import * as Components from "./components"

void function main() {
  Object.values(Components).forEach(component => component.Init())
}()