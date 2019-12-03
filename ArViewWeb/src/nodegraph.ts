export interface NodeGraph {
    version: string;
    creationTime: number;
    elapsed: number;
    graph: Record<string, string[]>
}