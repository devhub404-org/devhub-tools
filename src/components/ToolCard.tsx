import type { FC } from "react";
import type { Tool } from "../types/tools";

interface Props {
  tool: Tool;
}

const ToolCard: FC<Props> = ({ tool }) => {
    return (
        <a href={`/tools/${tool.id}`} className="tool-card">
            <span className="tool-card-category">{tool.category}</span>
            <h2 className="tool-card-name">{tool.name}</h2>
            <p className="tool-card-description">{tool.description}</p>
            <span className="tool-card-arrow" aria-hidden="true">→</span>
        </a>
    );
};

export default ToolCard;