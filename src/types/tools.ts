import type { ComponentType } from "react"

export type ToolCategory =
  | "formatadores"
  | "encoders"
  | "geradores"
  | "conversores"
  | "utilitários"

export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  component: ComponentType
}