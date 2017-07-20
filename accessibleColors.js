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

var currentColor = initialColor;
var currentTextColor = white;
var accessibilityValue = 4.5;

function accessibleColors() {
  var colorSpaceCanvas = document.querySelector('#colorSpace'),
      cSWidth = colorSpaceCanvas.width,
      cSHeight = colorSpaceCanvas.height,
      cSContext = colorSpaceCanvas.getContext('2d'),
      cSImage = cSContext.createImageData(cSWidth,cSHeight);

  function gridImageData(hue) {
    //iterate over rows
    for (var row = 0, i=-1; row < cSHeight; ++row) {
      // interate for cells
      for (var column = 0; column < cSWidth; ++column) {
        var tempColor = {
          h: hue,
          s: column,
          v: cSHeight - row
        }
        var tempRGBColor = HSVtoRGB(normHSV(tempColor));
        cSImage.data[++i] = Math.round(tempRGBColor.r*255);
        cSImage.data[++i] = Math.round(tempRGBColor.g*255);
        cSImage.data[++i] = Math.round(tempRGBColor.b*255);
        cSImage.data[++i] = 255;
      }
    }
    cSContext.putImageData(cSImage,0,0);

    var accessibilityPath = "M";
    for (var column = 0; column <= 100; column++) {
      for (var row = 0; row <= 100; row++) {
        console.log(checkColorContrast(hue, column, row));
        if (checkColorContrast(hue, column, row)) {
          var scaledRow = 100 - row;
          accessibilityPath = accessibilityPath + " " + column + " " + scaledRow;
          break;
        }
      }
    }
    p = new Path2D(accessibilityPath);
    cSContext.stroke(p);
  }

  var hueChannelCanvas = document.querySelector('#hueChannel'),
      hCWidth = hueChannelCanvas.width,
      hCHeight = hueChannelCanvas.height,
      hCContext = hueChannelCanvas.getContext('2d'),
      hCImage = hCContext.createImageData(hCWidth, hCHeight);

  function hueChannelData() {
    for (var column = 0, i=-1; column < 360; ++column) {
      var tempColor = {
        h: column,
        s: 100,
        v: 100
      }
      var tempRGBColor = HSVtoRGB(normHSV(tempColor));
      hCImage.data[++i] = Math.round(tempRGBColor.r*255);
      hCImage.data[++i] = Math.round(tempRGBColor.g*255);
      hCImage.data[++i] = Math.round(tempRGBColor.b*255);
      hCImage.data[++i] = 255;
    }
    hCContext.putImageData(hCImage,0,0);
  }

  gridImageData(currentColor.h);
  hueChannelData();
}

function checkColorContrast(hue, x, y) {
  var tempColor = {
    h: hue,
    s: x,
    v: y
  }
  var contrast = getColorContrastHSV(tempColor, currentTextColor);
  return (contrast <= accessibilityValue)
}
