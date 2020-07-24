import UUID from "../uuid"
import { BUSMessage, IBUSMessageDetail } from "./message"

export class BUS extends EventTarget {
  private static readonly _instance = new BUS()

  static RECONNECT_TIMEOUT = 1000
  static Send(message: BUSMessage) { return this._instance.Send(message) }
  static get ID() { return this._instance.id }

  private readonly _url = `${window.location.origin.replace(/^http/,"ws")}`
  private _ws!: WebSocket

  private constructor(readonly id: string = UUID()) {
    super()
  }

  private _connect = () => {
    console.log(`${this._url} connecting...`)

    this._ws = new WebSocket(this._url)

    this._ws.addEventListener("open", () => {
      console.log(`WSS on ${this._url} connected`)
    }, { once: true })

    this._ws.addEventListener("close", () => {
      console.log(`WSS on ${this._url} connection is closed`)
      setTimeout(this._connect, BUS.RECONNECT_TIMEOUT)
    }, { once: true })

    this._ws.addEventListener("error", err => {
      console.error(`WSS on ${this._url} connection encountered error: ${err}`)
      this._ws.close()
    }, { once: true })

    this._ws.addEventListener("message", this._onMessage)
  }

  private _onMessage = ({data}:{data: string}) => {
    for (const body of data.split("\n")) {
      let detail: IBUSMessageDetail
      try {
        detail = JSON.parse(body)
      } catch (err) {
        console.error(`WSS on ${this._url} incorrect message: ${body}`)
        continue
      }

      console.log(`WSS on ${this._url} new message: ${detail}`)
      const busMessage = new BUSMessage(detail)

      if (busMessage.to && busMessage.to !== this.id) {
        return
      }

      this.dispatchEvent(busMessage)
    }
  }

  Send(message: BUSMessage, {
    waitResponse = false,
    responseTimeout = 5000,
  }:{
    waitResponse?: boolean
    responseTimeout?: number
  } = {}): Promise<BUSMessage> {
    return new Promise((resolve, reject) => {
      try {
        this._ws.send(JSON.stringify(message))
      } catch (err) {
        return reject(err)
      }

      if (!message.to || !waitResponse) {
        return resolve(message)
      }

      const timeout = setTimeout(() => reject(new Error(`WSS on ${this._url} message response timeout: ${message}`)), responseTimeout)

      const onMessage = (responce: Event | BUSMessage) => {
        if (!(responce instanceof BUSMessage)) {
          return
        }

        if (message.uuid !== responce.uuid) {
          return
        }

        clearTimeout(timeout)
        this.removeEventListener("message", onMessage, { capture: true })
        resolve(responce)
      }

      this.addEventListener("message", onMessage, { capture: true, passive: true })
    })
  }
}
