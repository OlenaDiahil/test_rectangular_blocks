import {calculateContainerFullness} from './calculateFullness.js';

export function efficientPlacement(blocks, container) {
  const { width: containerWidth, height: containerHeight } = container;
  const blockCoordinates = [];
  let fullness = 0;

  blocks.sort((a, b) => b.width * b.height - a.width * a.height);

  for (let blockIndex = 1; blockIndex <= blocks.length; blockIndex++) {
    const block = blocks[blockIndex - 1];

    const placedCoordinates = placeBlock(
      block,
      blockCoordinates,
      containerWidth,
      containerHeight,
      blockIndex
    );

    if (placedCoordinates) {
      blockCoordinates.push(placedCoordinates);
    } else {
      const rotatedBlock = { width: block.height, height: block.width };
      const rotatedCoordinates = placeBlock(
        rotatedBlock,
        blockCoordinates,
        containerWidth,
        containerHeight,
        blockIndex
      );

      if (rotatedCoordinates) {
        blockCoordinates.push(rotatedCoordinates);
      }
    }
  }

  fullness = calculateContainerFullness(blockCoordinates, containerWidth, containerHeight);

  return {
    fullness,
    blockCoordinates,
  };
}

function placeBlock(block, blockCoordinates, containerWidth, containerHeight, blockIndex) {
  for (let top = 0; top <= containerHeight - block.height; top++) {
    for (let left = 0; left <= containerWidth - block.width; left++) {
      const doesOverlap = blockCoordinates.some(
        (existingBlock) =>
          top + block.height > existingBlock.top &&
          top < existingBlock.bottom &&
          left + block.width > existingBlock.left &&
          left < existingBlock.right
      );

      if (!doesOverlap) {
        return {
          top,
          left,
          right: left + block.width,
          bottom: top + block.height,
          initialOrder: blockIndex,
        };
      }
    }
  }
  return null;
}
