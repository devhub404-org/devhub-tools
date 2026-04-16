import type { Tool } from "../types/tools"
import JsonFormatter      from "../tools/json-formatter"
import Base64Encoder      from "../tools/base64-encoder"
import UUIDGenerator      from "../tools/uuid-generator"
import PasswordGenerator  from "../tools/password-generator"

const tools: Tool[] = [
  JsonFormatter,
  Base64Encoder,
  UUIDGenerator,
  PasswordGenerator,
]

export function getTools(): Tool[] {
  return tools
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id)
}