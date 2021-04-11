const render = (context, [x, y], [w, h], stroke, fill) => {
  if (fill) context.fillRect(x, y, w, h)
  if (stroke) context.strokeRect(x, y, w, h)
}

export default render
