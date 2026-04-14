import type { Tool } from '../types/tools';

const tools: Tool[] = [
    // tools will be added here
];

export function getTools(): Tool[] {
    return tools;
}

export function getToolsById(id: string): Tool | undefined {
    return tools.find(tool => tool.id === id);
}
