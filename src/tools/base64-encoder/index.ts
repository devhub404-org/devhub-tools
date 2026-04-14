import type { Tool } from "../../types/tools"
import Base64Tool from "./component"

const tool: Tool = {
  id: "base64-encoder",
  name: "Base64 Encoder",
  description: "Codifique e decodifique texto em Base64 instantaneamente.",
  category: "encoders",
  component: Base64Tool,
}

export default tool