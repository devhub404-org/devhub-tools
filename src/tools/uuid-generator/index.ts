import type { Tool } from "../../types/tools"
import UUIDGeneratorTool from "./component"

const tool: Tool = {
  id: "uuid-generator",
  name: "UUID Generator",
  description: "Gere UUIDs v4 únicos e aleatórios instantaneamente.",
  category: "geradores",
  component: UUIDGeneratorTool,
}

export default tool