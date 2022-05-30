const blockSize = 30
const gridSize = { x: 20, y: 20 }
const gameSize = {
    width: gridSize.x * blockSize,
    height: gridSize.y * blockSize,
};
const speedString = {
    40: 'very fast',
    80: 'fast',
    120: 'normal',
    160: 'slow',
    200: 'very slow',
};
colors = {
    snake: '#C2DED1',
    apple: '#D61C4E',
    bgLight: '#5B4B8A',
    bgDark: '#4C3575'
};