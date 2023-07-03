// bfs.js
'use strict'

import { Graph } from "./graph.js";

// Implements breath first search
export function BreathFirstSearch(graphObj, startNode, targetNode) {

  // Variables
  let startX = startNode.x;
  let startY = startNode.y;
  let targetX = targetNode.x;
  let targetY = targetNode.y;

  
  // A queue to manage the unvisited nodes 
  let queue = [];
  
  // A visited array to keep track of visited nodes
  let visited = new Set();
  
  // A path array that stores the shortest path to target node
  let path = [];
  
  // Starting node is already visited
  visited.add(startNode);
  
  // Add the start node to the queue
  queue.push(startNode);
  
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
  return null;
}

function backtrace(node) {
  var path = [{x: node.x, y: node.y}];
  while (node.parent) {
      node = node.parent;
      path.push({x: node.x, y: node.y});
  }
  return path.reverse();
}