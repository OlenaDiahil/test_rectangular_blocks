const EMPTY = 0;
const FILLED = 1;

function createEmptyGrid(width, height) {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => EMPTY));
}

export function calculateContainerFullness(blockCoordinates, containerWidth, containerHeight) {
    const containerGrid = createEmptyGrid(containerWidth, containerHeight);

    for (const { top, left, right, bottom } of blockCoordinates) {
        for (let y = top; y < bottom && y < containerHeight; y++) {
            for (let x = left; x < right && x < containerWidth; x++) {
                containerGrid[y][x] = FILLED;
            }
        }
    }

    function floodFill(startX, startY, visited) {
        const stack = [[startX, startY]];

        while (stack.length) {
            const [x, y] = stack.pop();

            if (
                x < 0 || x >= containerWidth ||
                y < 0 || y >= containerHeight ||
                visited[y][x] || containerGrid[y][x] === FILLED
            ) {
                continue;
            }

            visited[y][x] = true;

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    function calculateInternalVoids() {
        const visited = createEmptyGrid(containerWidth, containerHeight);

        function fillBorders(x, y) {
            if (!visited[y][x]) {
                floodFill(x, y, visited);
            }
        }

        for (let i = 0; i < containerWidth; i++) {
            fillBorders(i, 0);
            fillBorders(i, containerHeight - 1);
        }

        for (let i = 0; i < containerHeight; i++) {
            fillBorders(0, i);
            fillBorders(containerWidth - 1, i);
        }

        let internalVoidCount = 0;
        for (let y = 0; y < containerHeight - 1; y++) {
            for (let x = 0; x < containerWidth - 1; x++) {
                if (!visited[y][x] && containerGrid[y][x] === EMPTY) {
                    internalVoidCount++;
                }
            }
        }
        return internalVoidCount;
    }

    const filledArea = blockCoordinates.reduce(
        (sum, { top, left, right, bottom }) => sum + (Math.min(right, containerWidth) - Math.max(left, 0)) * (Math.min(bottom, containerHeight) - Math.max(top, 0)),
        0
    );

    const internalVoidsArea = calculateInternalVoids();
    const totalUsableArea = filledArea + internalVoidsArea;

    return 1 - internalVoidsArea / totalUsableArea;
}
