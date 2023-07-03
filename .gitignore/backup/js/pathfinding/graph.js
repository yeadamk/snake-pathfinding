// graph.js

export class Graph {

  constructor() {
    // Keeps track of nodes
    this.nodes = [];

    // Keeps track of both nodes and its adjacent nodes
    this.adjacencyList = new Map();
  }

  getAdjacencyList(node) {
    for (const adjNode of this.adjacencyList) {
      console.log(adjNode);
      if (adjNode.x === node.x && adjNode.y === node.y) {
        return this.adjacencyList.get(adjacentNodes);
      }
    }
    return this.adjacencyList.get(node);
  }

  addNode(node) {
    this.nodes.push(node);
    this.adjacencyList.set(node, new Set());
  }

  addNeighbor(startNode, endNode) {
    this.adjacencyList.get(startNode).add(endNode);
    // this.adjacencyList.get(endNode).add(startNode);
  }
}
