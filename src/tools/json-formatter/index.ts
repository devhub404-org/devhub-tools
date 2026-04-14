import type { Tool } from "../../types/tools"
import JsonFormatterTool from "./component"

const tool: Tool = {
  id: "json-formatter",
  name: "JSON Formatter",
  description: "Formate, minifique e valide JSON instantaneamente.",
  category: "formatadores",
  component: JsonFormatterTool,
}

export default tool