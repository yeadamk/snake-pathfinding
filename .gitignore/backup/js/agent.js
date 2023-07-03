// agent.js
'use strict'

import { getLastInputDirection } from "./events.js";
import { getGridSize } from "./grid.js";
import { BreathFirstSearch } from "./pathfinding/bfs.js";
import { Graph } from "./pathfinding/graph.js";

// Default agent directions
const defaultAgentDirection = { x: 0, y: 0 };
let lastAgentDirection = defaultAgentDirection;
const lastInputDirection = getLastInputDirection();

// Get grid size
const GRID_SIZE = getGridSize();

// Set up the snake grid graph
const snakeGrid = setupGraph(GRID_SIZE);

// Get agent direction
export function getAgentDirection(snakeBody) {
  let agentDirection = defaultAgentDirection;

  // Get fruit location
  const FRUIT_LOCATION = (async () => {
    await getFruitLocation();
  })();

  // Algorithm list
  const algorithmList = [
    defaultAgentDirection,
    HamiltonianCycle(snakeBody),
    BreathFirstSearch(snakeGrid, snakeBody[0], FRUIT_LOCATION),
  ]

  // Pick your algorithm
  //  0. Default agent direction: {x:0, y:0}
  //  1. Hamiltonian Cycle
  //  2. Breath First Search
  agentDirection = algorithmList[2];

  
    if(!agentDirection || agentDirection === defaultAgentDirection) {
      console.error('agentDirection is null or not defined');
      return defaultAgentDirection;
    }

  agentDirection = {x: agentDirection.x - snakeBody[0].x, 
                    y: agentDirection.y - snakeBody[0].y};

  lastAgentDirection = agentDirection;
  return agentDirection;
}

export function getLastAgentDirection() {
  return lastAgentDirection;
}

// Agent direction
// Trigger keypress if needed
// e.g. element.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArxUp'} ));
function goUp() {
  if (lastInputDirection.y !== 0) return;
  return { x: 0, y: -1 };
}

function goDown() {
  if (lastInputDirection.y !== 0) return;
  return { x: 0, y: 1 };
}

function goLeft() {
  if (lastInputDirection.x !== 0) return;
  return { x: -1, y: 0 };
}

function goRight() {
  if (lastInputDirection.x !== 0) return;
  return { x: 1, y: 0 };
}

async function getFruitLocation() {
  // Wait to fetch the fruit element
  const fruitElement = await new Promise(() => {
    document.querySelector('.apple');
  });
  
  let x = fruitElement.style.gridColumnStart;
  let y = fruitElement.style.gridxStart;

  return {x, y};
}

// The Hamiltonian cycle method -- brute force
// Only works with even grid sizes
function HamiltonianCycle(snakeBody) {
  const GRID_SIZE = getGridSize();
  let agentDirection = { x: 0, y: 0 };

  // First column
  if(snakeBody[0].x === 1) {
    if(snakeBody[0].y === GRID_SIZE) {
      agentDirection = goRight();
    }
    else {
      agentDirection = goDown();
    }
  }

  // Last column
  if(snakeBody[0].x === GRID_SIZE) {
    if(snakeBody[0].y === 1) {
      agentDirection = goLeft();
    }
    else {
      agentDirection = goUp();
    }
  }

  // First row
  if(snakeBody[0].y === 1) {
    if(snakeBody[0].x === 1) {
      agentDirection = goDown();
    }
    else {
      agentDirection = goLeft();
    }
  }

  // Others
  if(!(snakeBody[0].x === 1 || // NOT FIRST COLUMN
        snakeBody[0].x === GRID_SIZE || // NOT LAST COLUMN
        snakeBody[0].y === 1)) // NOT FIRST ROW
  {
    // Even columns
    if((snakeBody[0].x % 2) === 0) {

      // Second rows
      if(snakeBody[0].y  === 2) {
        agentDirection = goRight();
      }
      // All other rows
      else {
        agentDirection = goUp();
      }
    }
    // Odd columns 
    else {
      // Bottom rows
      if(snakeBody[0].y  === GRID_SIZE) {
        agentDirection = goRight();
      }
      // All other rows
      else {
        agentDirection = goDown();
      }
    }
  }

  return agentDirection;
}

// Set up graph of the snake grid
function setupGraph(GRID_SIZE) {
  // Create a new graph
  let grid = new Graph();
  
  // Loop through the grid tiles
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      let startNode = ({x: col, y: row});
      
      // Add node
      grid.addNode(startNode);
    }
  }
  
  // For every node, add adjacent nodes to adjacencyList
  const dirs = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}];

  for(let node of grid.nodes) {
    for(let dir of dirs) {
      const neighbor = {x: node.x + dir.x, y: node.y + dir.y};
      
      // Add only if the grid contains the neighbor node
      grid.nodes.forEach(node => {
        if(node.x === neighbor.x && node.y === neighbor.y) {
          grid.addNeighbor(node, neighbor);
        }
      });
    }
  }

  return grid;
}