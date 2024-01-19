export function getRandomColor(value1, value2) {
    const red = value1 % 256;
    const green = value2 % 256;
    const blue = (value1 * value2) % 256;

    return `rgb(${red}, ${green}, ${blue})`;
}
