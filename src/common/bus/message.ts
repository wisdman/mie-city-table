import UUID from "../uuid"
import { BUS } from "./bus"

import { IBUSCommand } from "./command"

export type IBUSMessage = {
  uuid: string
  from: string
  to: string | null
}

export type IBUSMessageDetail = IBUSMessage & IBUSCommand

export class BUSMessage extends CustomEvent<IBUSMessageDetail> {
  get uuid(): string { return this.detail.uuid }
  get from(): string { return this.detail.from }
  get to(): string | null { return this.detail.to }
  get command(): string { return this.detail.command }
  get data(): unknown { return this.detail.data }

  constructor({
    uuid = UUID(),
    from = BUS.ID,
    to = null,
    ...detail
  }: Partial<IBUSMessage> & IBUSCommand){
    super("message", { detail: {...detail, uuid, from, to} })
  }

  toJSON = () => ({
    uuid: this.uuid,
    from: this.from,
    to: this.to,
    command: this.command,
    data: this.data,
  })

  toString = () => `Message ${this.uuid} from ${this.from} to ${this.to}: [${this.command}] ${this.data}`
}
