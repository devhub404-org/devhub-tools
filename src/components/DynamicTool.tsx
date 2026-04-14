import type { FC, ComponentType } from "react"

interface Props {
  component: ComponentType
}

const DynamicTool: FC<Props> = ({ component: ToolComponent }) => {
  return <ToolComponent />
}

export default DynamicTool