export const lerp = (a, b, t) => (1 - t) * a + t * b

export const remap = (input, inputStart, inputEnd, outputStart, outputEnd) => {
  const inputRange = inputEnd - inputStart
  const outputRange = outputEnd - outputStart

  return (input - inputStart) * outputRange / inputRange + outputStart
}
