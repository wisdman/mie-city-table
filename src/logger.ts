import { inspect } from "util"

export type ILoggerMessageType = "FATAL" | "ERROR" | "WARNING" | "INFO" | "DEBUG"

export interface ILoggerMessage {
  type: ILoggerMessageType,
  timestamp: Date,
  pipe?: string,
  message: string,
}

export class Logger {
  static SIZE: number = 100

  private static DATA: Array<ILoggerMessage> = new Array<ILoggerMessage>()
  private static Message(msg: ILoggerMessage) {
    this.DATA = [msg, ...this.DATA.slice(0, this.SIZE)]
  }

  static toJSON(): Array<ILoggerMessage> {
    return this.DATA.map(message => ({...message}))
  }

  constructor(readonly pipe?: string){}

  private _message(type: ILoggerMessageType, obj: unknown) {
    Logger.Message({
      type,
      timestamp: new Date(),
      pipe: this.pipe,
      message: typeof obj === "string" ? obj : inspect(obj, { depth: Infinity, maxArrayLength : Infinity })
    })
  }

  DEBUG(obj: unknown) { this._message("DEBUG", obj) }
  ERROR(obj: unknown) { this._message("ERROR", obj) }
  FATAL(obj: unknown) { this._message("FATAL", obj) }
  LOG(obj: unknown) { this._message("INFO", obj) }
  INFO(obj: unknown) { this._message("INFO", obj) }
  WARN(obj: unknown) { this._message("WARNING", obj) }
  WARNING(obj: unknown) { this._message("WARNING", obj) }

  byLevel(level: number, obj: unknown) {
    switch (level) {
      case -1:
        this.DEBUG(obj)
        return
      case 0:
        this.INFO(obj)
        return
      case 1:
        this.WARN(obj)
        return
      case 2:
        this.ERROR(obj)
        return
    }
    this.WARN(obj)
  }

  toJSON() {
    return Logger.toJSON()
  }
}
