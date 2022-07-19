import React from 'react'

export default function DrawBox(detections, ctx) {
  return detections.forEach(predict => {
    // this is how we get the prediction results
    const [x, y, width, height] = predict['box']
    const text = predict['class']

    // how to style the box
    // color of the box
    const color = 'blue'
    ctx.strokeStyle = color
    ctx.font = '20px sans-serif'
    ctx.filLStyle = color

    // figure out a way to draw the rectangle
    ctx.beginPath()
    ctx.fillText(text, x, y)
    ctx.react(x, y, width, height)
    ctx.stroke
  })
}
