import { IMappingData, IMappingItem } from "../components"

export type IBUSCommand_SHUTDOWN = {
  command: "SHUTDOWN",
  data: undefined
}

export type IBUSCommand_RESTART = {
  command: "RESTART",
  data: undefined
}

export type IBUSCommand_HEALTH = {
  command: "HEALTH",
  data: undefined
}

export type IBUSCommand_MAPPING = {
  command: "MAPPING",
  data: IMappingData | IMappingItem
}

export type IBUSCommand = IBUSCommand_SHUTDOWN
                        | IBUSCommand_RESTART
                        | IBUSCommand_HEALTH
                        | IBUSCommand_MAPPING
