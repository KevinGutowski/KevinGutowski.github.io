var initialColor = {
    h:274,
    s:49,
    v:63
}

var white = {
  h: 0,
  s: 0,
  v: 100,
}

var backgroundColor = {
  h: 0,
  s: 0,
  b: 0
}

var textColor = {
  h: 0,
  s: 0,
  b: 100,
}

function accessibleColors() {
  var canvas = document.querySelector('#colorSpace'),
    width = canvas.width,
    height = canvas.height,
    context = canvas.getContext('2d'),
    image = context.createImageData(width,height);

  function gridImageData(hue) {
    //iterate over rows
    for (var row = 0, i=-1; row < width; ++row) {
      // interate for cells
      for (var column = 0; column < height; ++column) {
        var tempColor = {
          h: hue,
          s: column,
          v: height - row
        }
        var tempRGBColor = HSVtoRGB(normHSV(tempColor));
        image.data[++i] = Math.round(tempRGBColor.r*255);
        image.data[++i] = Math.round(tempRGBColor.g*255);
        image.data[++i] = Math.round(tempRGBColor.b*255);
        image.data[++i] = 255;
      }
    }
    console.log(image);

    context.putImageData(image,0,0);
  }

  gridImageData(20);

}



