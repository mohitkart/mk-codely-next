const list = [
    "#7367F0", // Purple
    "#FF9F43", // Orange
    "#28C76F", // Green
    "#EA5455", // Red
    "#00CFE8", // Blue
    "#8c564b", // Brown
    "#e377c2", // Pink
    "#7f7f7f", // Gray
    "#bcbd22", // Yellow-Green
    "#17becf"  // Cyan
];
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomLightColor() {
  const r = Math.floor(Math.random() * 156) + 75; // 75–230 (light range)
  const g = Math.floor(Math.random() * 156) + 75;
  const b = Math.floor(Math.random() * 156) + 75;

  // Convert each to hex and pad with 0 if needed
  const toHex = (c:number) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getColor(i=-1){
    let value=list?.[i]||getRandomLightColor()
    return value
}

const colorsModel = { list,getRandomColor,getRandomLightColor,getColor}
export default colorsModel