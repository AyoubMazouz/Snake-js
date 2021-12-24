const blockSize = 30
const gridSize = { x: 20, y: 20 }
const gameSize = {
    width: gridSize.x * blockSize,
    height: gridSize.y * blockSize,
};
const speedString = {
    60: 'very fast',
    90: 'fast',
    120: 'normal',
    150: 'slow',
    180: 'very slow',
}
colors = {
    snake: '#8bac0f',
    apple: '#9bbc0f',
    bgLight: '#0f380f',
    bgDark: '#306230'
}