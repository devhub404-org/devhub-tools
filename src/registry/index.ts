import type { Tool } from "../types/tools"
import JsonFormatter from "../tools/json-formatter"

const tools: Tool[] = [
  JsonFormatter,
]

export function getTools(): Tool[] {
  return tools
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id)
}