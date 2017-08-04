var initialColor = {
    h:54,
    s:39,
    v:88
}

var white = {
  h: 251,
  s: 75,
  v: 100,
}

var currentColor = initialColor;
var currentTextColor = white;
var currentContrastRequirement = 4.5;
var showCloseColorsChecked = true;
var accessibilityArray1 = [];
var accessibilityArray2 = [];

function accessibleColors() {

  // canvas start
  var colorSpaceCanvas = document.querySelector('#colorSpace'),
      cSWidth = colorSpaceCanvas.width,
      cSHeight = colorSpaceCanvas.height,
      cSContext = colorSpaceCanvas.getContext('2d'),
      cSImage = cSContext.createImageData(cSWidth,cSHeight);

  // generate image data
  function gridImageData(hue) {
    // iterate over rows
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
  }

  // generate accessibility curve(s)
  function getAccessibilityCurves(hue, contrastRequirement) {
    var accessibilityPath1 = "M";
    var accessibilityPath2 = "M";
    var firstCheck; // store the first point in each row (true or false)
    var previousInitialBoundary;
    for (var column = 0; column <= 100; column++) {
      var accessibilityPath1Found = false;
      for (var row = 0; row <= 100; row++) {
        if (row == 0) {
          firstCheck = checkColorContrast(hue, column, row, contrastRequirement);
          previousInitialBoundary = firstCheck;
        }

        if (accessibilityPath1Found == false) {
          // check if the contrast has changed from false to true or true to false (boundary condition)
          if (checkColorContrast(hue, column, row, contrastRequirement) != firstCheck) {
            var scaledRow = (100 - row) * 2;
            var scaledColumn = column * 2;
            accessibilityPath1 = accessibilityPath1 + " " + scaledColumn + " " + scaledRow;
            accessibilityArray1.push(scaledRow);
            accessibilityPath1Found = true;
          }
        }

        if (accessibilityPath1Found) {
          if (checkColorContrast(hue, column, row, contrastRequirement) == firstCheck) {
            var scaledRow = (100 - row) * 2;
            var scaledColumn = column * 2;
            accessibilityPath2 = accessibilityPath2 + " " + scaledColumn + " " + scaledRow;
            accessibilityArray2.push(scaledRow);
            break;
          }
        }
      }
    }
    return [accessibilityPath1, accessibilityPath2];
  }

  function getClosestColors(currentColor, contrastRequirement) {
  }

  function getClosestSatCirclePosition(currentColor, contrastRequirement) {
    var position, firstCheck;
    var foundBoundaryInRow = false;
    for (var row = 0; row <= 100; row++) {
      if (row == 0) {
        firstCheck = checkColorContrast(currentColor.h, currentColor.s, row, contrastRequirement);
      }

      if (checkColorContrast(currentColor.h, currentColor.s, row, contrastRequirement) != firstCheck) {
        foundBoundaryInRow = true;
        var scaledRow = (100 - row) * 2;
        var scaledColumn = currentColor.s * 2;
        position = {
            x: scaledColumn,
            y: scaledRow
        }
        break;
      }
    }

    if (foundBoundaryInRow == false) {
      // check columns behind current color
      // Don't need to start checking the currentColor column but rather currentColor column - 1 becuase we already checked the currentColor colummn above
      for (var column = 100; column >= 0; column--) {
        if (checkColorContrast(currentColor.h, column, 100, contrastRequirement) != firstCheck) {
          foundBoundaryInRow = true;
          var scaledRow = (100 - 100) * 2;
          var scaledColumn = column * 2;
          position = {
            x: scaledColumn,
            y: scaledRow // minus 2 to position it better on the line?
          }
          break;
        }
      }
    }
    return position;
  }

  function getClosestBrightCirclePosition(currentColor,contrastRequirement) {
    var position, firstCheck;
    var foundBoundaryInColumn = false;
    for (var column = 0; column <= 100; column++) {
      if (column == 0) {
        firstCheck = checkColorContrast(currentColor.h, column, currentColor.v, contrastRequirement);
      }

      if (checkColorContrast(currentColor.h, column, currentColor.v, contrastRequirement) != firstCheck) {
        foundBoundaryInColumn = true;
        var scaledRow = (100 - currentColor.v) * 2;
        var scaledColumn = column * 2;
        position = {
          x: scaledColumn,
          y: scaledRow - 2
        }
        break;
      }
    }

    if (foundBoundaryInColumn == false) {
      for (var row = 100; row >= 0; row--) {
        if (checkColorContrast(currentColor.h, 100, row, contrastRequirement) != firstCheck) {
          foundBoundaryInColumn = true;
          var scaledRow = (100 - row) * 2;
          var scaledColumn = 100 * 2;
          position = {
            x: scaledColumn,
            y: scaledRow - 2,
          }
          break;
        }
      }
    }

    if (foundBoundaryInColumn == false) {
      for (var row = 0; row <= 100; row++) {
        if (checkColorContrast(currentColor.h, 0, row, contrastRequirement) != firstCheck) {
          foundBoundaryInColumn = true;
          var scaledRow = (100 - row) * 2;
          var scaledColumn = 0 * 2;
          position = {
            x: scaledColumn,
            y: scaledRow - 2,
          }
          break;
        }
      }
    }
    return position;
  }

  // canvas start
  var hueChannelCanvas = document.querySelector('#hueChannel'),
      hCWidth = hueChannelCanvas.width,
      hCHeight = hueChannelCanvas.height,
      hCContext = hueChannelCanvas.getContext('2d'),
      hCImage = hCContext.createImageData(hCWidth, hCHeight);

  // generate hue selector data
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


  var satBrightSpaceSVG = d3.select('#satBrightSpace');
  satBrightSpaceSVG.call(d3.drag()
    .on('start', dragstartedSatBrightSpace)
    .on('drag', draggedSatBrightSpace)
    .on('end', dragendedSatBrightSpace)
  );

  function dragstartedSatBrightSpace() {
    d3.select(this).raise().classed('active', true);
    d3.select('#currentColorCircle')
      .attr('cx', Math.floor(d3.event.x))
      .attr('cy', Math.floor(d3.event.y));

    currentColor.s = Math.floor(d3.event.x / 2.0)
    currentColor.v = Math.floor((200.0 - d3.event.y) / 2.0);
    update(currentColor, currentTextColor, currentContrastRequirement);
  }

  function draggedSatBrightSpace() {
    var colorCircleX, colorCircleY;

    if (d3.event.x > 200) {
      colorCircleX = 200;
    } else if (d3.event.x < 0) {
      colorCircleX = 0;
    } else {
      colorCircleX = d3.event.x;
    }

    if (d3.event.y > 200) {
      colorCircleY = 200;
    } else if (d3.event.y < 0) {
      colorCircleY = 0;
    } else {
      colorCircleY = d3.event.y;
    }
    d3.select('#currentColorCircle')
      .attr('cx', Math.floor(colorCircleX))
      .attr('cy', Math.floor(colorCircleY));

    currentColor.s = Math.floor(colorCircleX / 2.0)
    currentColor.v = Math.floor((200.0 - colorCircleY) / 2.0);
    update(currentColor, currentTextColor, currentContrastRequirement);
  }

  function dragendedSatBrightSpace() {
    d3.select(this).classed('active', false);
  }

  // create the accessibility paths
  satBrightSpaceSVG.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('id', 'accessibilityPath1')
    .attr('d', getAccessibilityCurves(currentColor.h, currentContrastRequirement)[0])
    .attr('stroke-width', '1')

  satBrightSpaceSVG.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('id', 'accessibilityPath2')
    .attr('d', getAccessibilityCurves(currentColor.h, currentContrastRequirement)[1])
    .attr('stroke-width', '1')

  // create the saturation & brightness selector
  satBrightSpaceSVG.append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('id', 'currentColorCircle')
    .attr('cx', currentColor.s*2)
    .attr('cy', 200 -(currentColor.v*2))
    .attr('r', 5)
    .attr('stroke-width', 2);

    // If showCloseColors is checked
  if (showCloseColorsChecked) {
    satBrightSpaceSVG.append('circle')
    .attr('fill', 'black')
    .attr('stroke', 'none')
    .attr('id', 'closestSatCircle')
    .attr('cx', getClosestSatCirclePosition(currentColor,currentContrastRequirement).x)
    .attr('cy', getClosestSatCirclePosition(currentColor,currentContrastRequirement).y)
    .attr('r', 5);

    satBrightSpaceSVG.append('circle')
    .attr('fill', 'black')
    .attr('stroke', 'none')
    .attr('id', 'closestBrightCircle')
    .attr('cx', getClosestBrightCirclePosition(currentColor,currentContrastRequirement).x)
    .attr('cy', getClosestBrightCirclePosition(currentColor,currentContrastRequirement).y)
    .attr('r', 5);
  }



  var hueNubSpaceSVG = d3.select('#hueNubSpace');
  hueNubSpaceSVG.call(d3.drag()
    .on('start', dragstartedHueNubSpace)
    .on('drag', draggedHueNubSpace)
    .on('end', dragended)
  );

  function dragstartedHueNubSpace() {
    d3.select(this).raise().classed('active', true);
    d3.select('#hueSelectorNub')
      .attr('x', Math.floor(d3.event.x))
      .attr('stroke', '#000000');
    currentColor.h = Math.floor(d3.event.x * 1.8);
    update(currentColor, currentTextColor, currentContrastRequirement);
  }

  function draggedHueNubSpace() {
    var HueX;
    if (d3.event.x > 200) {
      HueX = 200;
    } else if (d3.event.x < 0) {
      HueX = 0;
    } else {
      HueX = d3.event.x;
    }

    d3.select('#hueSelectorNub')
      .attr('x', Math.floor(HueX))
      .attr('stroke', '#000000');
    currentColor.h = Math.floor(HueX * 1.8);
    update(currentColor, currentTextColor, currentContrastRequirement);
  }

  function dragended() {
    d3.select('#hueSelectorNub').attr('stroke', '#8E8E8E');
    d3.select(this).classed('active', false);
  }

  // create the hue selector nub
  hueNubSpaceSVG.append('rect')
    .attr('x', currentColor.h / 1.8)
    .attr('y', 0)
    .attr('width', 5)
    .attr('height', 10)
    .attr('id', 'hueSelectorNub')
    .attr('fill', 'white')
    .attr('stroke-width', 1)
    .attr('stroke', '#8E8E8E')
    .attr('rx', 2)
    .attr('ry', 2);

  // Initialize Static Items
  hueChannelData();

  // Initialize Items that Update
  update(initialColor, white, currentContrastRequirement)

  // Global Update
  function update(currentColor, currentTextColor, currentContrastRequirement) {
    updateExampleButton(currentColor, currentTextColor);
    updateContrastWarning(currentColor, currentTextColor);
    updateInputs(currentColor, currentTextColor);
    updateAccessibilityPath(currentColor.h, currentContrastRequirement);
    updateSatBrightSpace(currentColor.h);
    updateCurrentColorCircle(currentColor);
    if (showCloseColorsChecked) {
      updateCloseSaturationColor(currentColor, currentContrastRequirement);
      updateCloseBrightnessColor(currentColor, currentContrastRequirement);
    }
  }

  function updateExampleButton(currentColor, currentTextColor) {
    var normCurrentColorRGB = HSVtoRGB(normHSV(currentColor));

    var cCR = Math.round(normCurrentColorRGB.r*255);
    var cCG = Math.round(normCurrentColorRGB.g*255);
    var cCB = Math.round(normCurrentColorRGB.b*255);

    var normCurrentTextColorRGB = HSVtoRGB(normHSV(currentTextColor));
    var cTCR = Math.round(normCurrentTextColorRGB.r*255);
    var cTCG = Math.round(normCurrentTextColorRGB.g*255);
    var cTCB = Math.round(normCurrentTextColorRGB.b*255);

    var cCString = 'background-color: rgb(' + cCR + ',' + cCG + ',' + cCB +')';
    var cTCString = 'color: rgb(' + cTCR + ',' + cTCG + ',' + cTCB +')';

    d3.select('#myButton').attr('style', cCString + "; " + cTCString);
  }

  function updateContrastWarning(currentColor, currentTextColor) {
    var contrastVal = getColorContrastHSV(currentColor, currentTextColor);
    var floored = (contrastVal.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0]*1).toFixed(1)
    d3.select('#contrastValue').text('Contrast: ' + floored + ':1');
    if (contrastVal >= currentContrastRequirement) {
      d3.select('#optionalWarning').attr('style', "display:none");
    } else {
      d3.select('#optionalWarning').attr('style', "display:inherit");
    }
  }

  function updateInputs(currentColor, currentTextColor) {
    d3.select('#hueInput').property('value', currentColor.h);
    d3.select('#satInput').property('value', currentColor.s);
    d3.select('#brightInput').property('value', currentColor.v);

    d3.select('#textHueInput').property('value', currentTextColor.h);
    d3.select('#textSatInput').property('value', currentTextColor.s);
    d3.select('#textBrightInput').property('value', currentTextColor.v);
  }

  function updateAccessibilityPath(hue, contrastRequirement) {
    d3.select('#accessibilityPath1').attr('d', getAccessibilityCurves(hue, contrastRequirement)[0]);
    d3.select('#accessibilityPath2').attr('d', getAccessibilityCurves(hue, contrastRequirement)[1]);
  }

  function updateSatBrightSpace(hue) {
    d3.select('#hueSelectorNub').attr('x', hue / 1.8).attr('hue', hue);
    gridImageData(hue);
  }

  function updateCurrentColorCircle(currentColor) {
    d3.select('#currentColorCircle')
      .attr('cx', currentColor.s*2)
      .attr('cy', 200 - (currentColor.v*2))
  }

  function updateCloseSaturationColor(currentColor, currentContrastRequirement) {
    d3.select('#closestSatCircle')
      .attr('cx', getClosestSatCirclePosition(currentColor,currentContrastRequirement).x)
      .attr('cy', getClosestSatCirclePosition(currentColor,currentContrastRequirement).y);
  }

  function updateCloseBrightnessColor(currentColor, currentContrastRequirement) {
    d3.select('#closestBrightCircle')
      .attr('cx', getClosestBrightCirclePosition(currentColor,currentContrastRequirement).x)
      .attr('cy', getClosestBrightCirclePosition(currentColor,currentContrastRequirement).y);
  }

  // Interaction handlers
  d3.select('#hueInput').on('input', function() {
    currentColor.h = this.value;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.select('#satInput').on('input', function() {
    currentColor.s = this.value;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.select('#brightInput').on('input', function() {
    currentColor.v = this.value;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.select('#textHueInput').on('input', function() {
    currentTextColor.h = this.value;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.select('#textSatInput').on('input', function() {
    currentTextColor.s = this.value;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.select('#textBrightInput').on('input', function() {
    currentTextColor.v = this.value;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.selectAll(("input[name='contrastValue']")).on("change", function(){
    currentContrastRequirement = this.value;
    update(currentColor,currentTextColor,currentContrastRequirement);
  });

  d3.selectAll(("input[name='showCloseColors']")).on("change", function(){
    showCloseColorsChecked = this.checked;
    if (!this.checked) {
      d3.select("#closestColorsContainer").attr('style', "display:none;")
    } else {
      d3.select("#closestColorsContainer").attr('style', "display:inherit;")
    }
  });
}

function checkColorContrast(hue, x, y, contrastRequirement) {
  var tempColor = {
    h: hue,
    s: x,
    v: y
  }
  var contrast = getColorContrastHSV(tempColor, currentTextColor);
  return (contrast >= contrastRequirement)
}
