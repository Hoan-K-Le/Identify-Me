import React from 'react'

export const DrawBox = (detections, ctx) => {
  return detections.forEach(prediction => {
    // this is how we get the prediction results
    const [x, y, width, height] = prediction['bbox']
    const text = prediction['class']

    // how to style the box
    // color of the box
    const color = 'blue'
    ctx.strokeStyle = color
    ctx.font = '20px sans-serif'
    ctx.filLStyle = color

    // figure out a way to draw the rectangle
    ctx.beginPath()
    ctx.fillText(text, x, y)
    ctx.rect(x, y, width, height)
    ctx.stroke()
  })
}
