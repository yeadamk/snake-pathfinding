// agent.js
'use strict'

import { getLastInputDirection } from "./events.js";
// import { getFruitLocation } from "./fruit.js";
import { getGridSize } from "./grid.js";
import { Graph } from "./pathfinding/graph.js";
import { HamiltonianCycle } from "./pathfinding/hamiltonian.js";
import { AgentBreathFirstSearch as bfs } from "./pathfinding/bfs.js";

// Default agent directions
const defaultAgentDirection = [0, 0];
let lastAgentDirection = defaultAgentDirection;
const lastInputDirection = getLastInputDirection();

// Get grid size
const GRID_SIZE = getGridSize();

// Set up the snake grid graph
const snakeGrid = setupGraph(GRID_SIZE);

// Get agent direction
// Directs the next move of the snake (up, down, left, or right)
export function getAgentDirection(snakeBody) {
  let agentDirection = defaultAgentDirection;

  // Get fruit location (ERROR cannot get snakebody before initialization)
  // const FRUIT_LOCATION = getFruitLocation();

  // Algorithm list
  const algorithmList = [
    defaultAgentDirection,
    HamiltonianCycle(snakeBody),
    // bfs(snakeGrid, snakeBody[0], FRUIT_LOCATION),
  ]

  // Pick your algorithm
  //  0. Default agent direction: [0, 0]
  //  1. Hamiltonian Cycle
  //  2. Breath First Search
  agentDirection = algorithmList[1];

  // Check for null or undefined agent directions
  if(!agentDirection || agentDirection === defaultAgentDirection) {
    console.error('agentDirection is null or not defined');
    return defaultAgentDirection;
  }

  // Return agent direction
  lastAgentDirection = agentDirection;
  return agentDirection;
}

export function getLastAgentDirection() {
  return lastAgentDirection;
}

// Agent direction
// Trigger keypress if needed
// e.g. element.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowUp'} ));
export function goUp() {
  if (lastInputDirection[1] !== 0) return;
  return [0, -1];
}

export function goDown() {
  if (lastInputDirection[1] !== 0) return;
  return [0, 1];
}

export function goLeft() {
  if (lastInputDirection[0] !== 0) return;
  return [-1, 0];
}

export function goRight() {
  if (lastInputDirection[0] !== 0) return;
  return [1, 0];
}


// Set up graph of the snake grid
function setupGraph(GRID_SIZE) {
  // Create a new graph
  let grid = new Graph();
  
  // Loop through the grid tiles
  for (let col = 1; col <= GRID_SIZE; col++) {
    for (let row = 1; row <= GRID_SIZE; row++) {
      let gridnodes = [col, row];
      
      // Add node
      grid.addNode(gridnodes);
    }
  }
  
  // For every node, add adjacent nodes to adjacencyList
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  for(let node of grid.nodes) {
    for(let dir of dirs) {
      const neighbor = [node[0] + dir[0], node[1] + dir[1]];
      
      // Add only if the grid contains the neighbor node
      grid.nodes.forEach(gridnode => {
        if(gridnode[0] === neighbor[0] && gridnode[1] === neighbor[1]) {
          grid.addNeighbor(node, neighbor);
        }
      });
    }
  }

  return grid;
}