// bfs.js
'use strict'

import { Graph } from "./graph.js";

// BFS Function that returns agent direction
export function AgentBreathFirstSearch(graphObj, startNode, targetNode) {
  console.log(targetNode);
  let path = BreathFirstSearch(graphObj, startNode, targetNode);
  
  if(path === []) {
    return null;
  }
  
  let agentDirection = [0, 0];
  // let agentDirection = [path[0][0] - startNode[0][0], 
  //                       path[0][1] - startNode[0][1]];
  
  console.log(`path: ${path}`);

  return agentDirection;
}


// Implements breath first search
function BreathFirstSearch(graphObj, startNode, targetNode) {

  // Variables
  let startX = startNode.x;
  let startY = startNode.y;
  let targetX = targetNode.x;
  let targetY = targetNode.y;
  
  // A queue to manage the unvisited nodes 
  let queue = [];
  queue.push(startNode);
  
  // A visited array to keep track of visited nodes
  let visited = new Set();
  visited.add(startNode);
  
  // A path array that stores the shortest path to target node
  let path = [];
  
  // While there are nodes left to visit
  while (queue.length > 0) {

    // Take the first node from the queue
    let node = queue.shift();
    visited.add(node);
    
    // Reached the target node
    if(JSON.stringify(node) === JSON.stringify(targetNode)) {
      return backtrace(targetNode);
    }
    
    // Get adjacent(neighbor) nodes
    let adjacentNodes = graphObj.getAdjacencyList(node);

    for(const adjacentNode of adjacentNodes) {

      // If the node hasn't been visited before
      if(!visited.has(adjacentNode)) {
        
        // Add node to queue
        queue.push(adjacentNode);
        
        // Add node to visited array
        visited.add(adjacentNode);

        adjacentNode.parent = node;
      }
    }
  }

  // Failed to find path
  return [];
}

function backtrace(node) {
  var path = [[node[0], node[1]]];
  while (node.parent) {
      node = node.parent;
      path.push([node[0], node[1]]);
  }
  return path.reverse();
}