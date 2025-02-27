class Utility {
  static positionNodes(
    nodes,
    nodeWidth = 224,
    nodeHeight = 80,
    horizontalGap = 50,
    verticalGap = 70,
    screenRatio = 16 / 9,
    containerWidth = 1600,
  ) {
    // Return early if no nodes
    if (!nodes || nodes.length === 0) return [];

    // Get exact node count
    const nodeCount = nodes.length;

    // Calculate container height based on aspect ratio
    const containerHeight = containerWidth / screenRatio;

    // Calculate optimal grid dimensions based on node count and aspect ratio
    // This is the key improvement - using the exact node count for grid calculation

    // First determine how many nodes can fit in a row based on container width
    const maxNodesPerRow = Math.floor(
      (containerWidth + horizontalGap) / (nodeWidth + horizontalGap),
    );

    // Then find the optimal number of rows and columns
    // Start with a square-ish grid adjusted for aspect ratio
    let cols = Math.min(maxNodesPerRow, Math.ceil(Math.sqrt(nodeCount * screenRatio)));
    let rows = Math.ceil(nodeCount / cols);

    // Check if we can create a more balanced grid
    // Try different column counts to find the most compact arrangement
    let bestArea = Infinity;
    let optimalCols = cols;
    let optimalRows = rows;

    for (let testCols = 1; testCols <= maxNodesPerRow; testCols++) {
      const testRows = Math.ceil(nodeCount / testCols);
      const gridWidth = testCols * nodeWidth + (testCols - 1) * horizontalGap;
      const gridHeight = testRows * nodeHeight + (testRows - 1) * verticalGap;

      // Calculate how much of the container this grid would use
      const areaUtilization = (gridWidth / containerWidth) * (gridHeight / containerHeight);

      // We want a grid that uses space efficiently without stretching too far in either dimension
      if (
        areaUtilization < bestArea &&
        gridWidth <= containerWidth &&
        gridHeight <= containerHeight
      ) {
        bestArea = areaUtilization;
        optimalCols = testCols;
        optimalRows = testRows;
      }
    }

    cols = optimalCols;
    rows = optimalRows;

    // Calculate the total grid dimensions
    const totalGridWidth = cols * nodeWidth + (cols - 1) * horizontalGap;
    const totalGridHeight = rows * nodeHeight + (rows - 1) * verticalGap;

    // Calculate starting position to center the grid
    const startX = (containerWidth - totalGridWidth) / 2;
    const startY = (containerHeight - totalGridHeight) / 2;

    // Position each node
    return nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const posX = startX + col * (nodeWidth + horizontalGap);
      const posY = startY + row * (nodeHeight + verticalGap);

      return {
        ...node,
        position: {
          x: posX,
          y: posY,
        },
      };
    });
  }

  static calculateViewport(
    nodes: any[],
    containerWidth = 1600,
    containerHeight = 900,
    padding = 50,
  ) {
    if (!nodes || nodes.length === 0) {
      return { x: 0, y: 0, zoom: 1 };
    }

    // Find the bounding box of all nodes
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    // Assume nodes have width and height (or use default values)
    const defaultNodeWidth = 224;
    const defaultNodeHeight = 80;

    nodes.forEach((node) => {
      const nodeWidth = node.width || defaultNodeWidth;
      const nodeHeight = node.height || defaultNodeHeight;

      const x = node.position.x;
      const y = node.position.y;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + nodeWidth);
      maxY = Math.max(maxY, y + nodeHeight);
    });

    // Add padding
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Calculate dimensions of the bounding box
    const width = maxX - minX;
    const height = maxY - minY;

    // Calculate zoom to fit all nodes
    const zoomX = containerWidth / width;
    const zoomY = containerHeight / height;
    const zoom = Math.min(zoomX, zoomY, 1); // Cap zoom at 1 to avoid making nodes too large

    // Calculate center of the bounding box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate viewport position to center on the nodes
    return {
      x: containerWidth / 2 - centerX * zoom,
      y: containerHeight / 2 - centerY * zoom,
      zoom: zoom,
    };
  }
}

export default Utility;
