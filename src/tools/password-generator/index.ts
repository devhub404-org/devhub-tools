import type { Tool } from "../../types/tools"
import PasswordGeneratorTool from "./component"

const tool: Tool = {
  id: "password-generator",
  name: "Gerador de Senhas",
  description: "Gere senhas seguras com controle de tamanho e composição.",
  category: "geradores",
  component: PasswordGeneratorTool,
}

export default tool