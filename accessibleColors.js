var initialColor = {
  h: 172,
  s: 65,
  v: 57
}

var white = {
  h: 0,
  s: 0,
  v: 100
}

var currentColor = initialColor;
var currentTextColor = white;
var showCloseColorsChecked = true;
var accessibilityArray1, accessibilityArray2;
var currentContrastRequirement = 4.5;
var numberOfAccessibilityPaths = 1;

function accessibleColors() {
  // Canvas start for Colors Space
  var colorSpaceCanvas = document.querySelector('#colorSpace'),
      cSWidth = colorSpaceCanvas.width,
      cSHeight = colorSpaceCanvas.height,
      cSContext = colorSpaceCanvas.getContext('2d'),
      cSImage = cSContext.createImageData(cSWidth,cSHeight);

  // generate image data
  function gridImageData(currentColor) {
    var hue = currentColor.h;
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

  // Canvas start for Hue Channel (underneath the Color Space)
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

  function checkColorContrast(hue, x, y) {
    var tempColor = {
      h: hue,
      s: x,
      v: y
    }
    var contrast = getColorContrastHSV(tempColor, currentTextColor);
    return (contrast >= currentContrastRequirement)
  }

  // generate accessibility curve(s)
  // returns an array of svg path data
  function getAccessibilityCurves(hue, contrastRequirement) {
    accessibilityArray1 = new Array(100);
    accessibilityArray2 = new Array(100);
    var accessibilityPath1 = "M";
    var accessibilityPath2 = "M";
    var firstCheck; // store the first point in each row (true or false)
    for (var column = 0; column <= 100; column++) {
      var accessibilityPath1Found = false;
      for (var row = 0; row <= 100; row++) {
        if (row == 0) {
          firstCheck = checkColorContrast(hue, column, row, contrastRequirement);
        }

        if (accessibilityPath1Found == false) {
          // check if the contrast has changed from false to true or true to false (boundary condition)
          if (checkColorContrast(hue, column, row, contrastRequirement) != firstCheck) {
            var scaledRow = (100 - row) * 2;
            var scaledColumn = column * 2;
            accessibilityPath1 = accessibilityPath1 + " " + scaledColumn + " " + scaledRow;
            accessibilityArray1[column] = row;
            accessibilityPath1Found = true;
          }
        }

        if (accessibilityPath1Found) {
          if (checkColorContrast(hue, column, row, contrastRequirement) == firstCheck) {
            var scaledRow = (100 - row) * 2;
            var scaledColumn = column * 2;
            accessibilityPath2 = accessibilityPath2 + " " + scaledColumn + " " + scaledRow;
            accessibilityArray2[column] = row;
            break;
          }
        }
      }
    }

    var lineOrLines;
    if ((accessibilityPath1 == "M") && (accessibilityPath2 == "M")) {
      console.log("no lines");
      lineOrLines = [];
    } else if (accessibilityPath1 == "M") {
      lineOrLines = [accessibilityPath2];
    } else if (accessibilityPath2 == "M") {
      lineOrLines = [accessibilityPath1];
    } else {
      lineOrLines = [accessibilityPath1, accessibilityPath2];
    }
    numberOfAccessibilityPaths = lineOrLines.length;
    return lineOrLines;
  }

  function getClosestSatCirclePosition(currentColor) {
    var position;
    var foundBoundaryInRow = false;
    var foundBoundaryAbove = false;
    var foundBoundaryBelow = false;

    function getSatPositionFromAccessibilityArray(accessibilityArray) {
      for (var i = 0; i < accessibilityArray.length; i++) {
        if (accessibilityArray[i] == currentColor.v) {
          foundBoundaryInRow = true;
          position = {
            x: i,
            y: currentColor.v
          }
          break;
        }
      }

      if (foundBoundaryInRow == false) {
        var breakCheck = false;
        for (var row = currentColor.v + 1; row <= 100; row++) {
          for (var i=0; i < accessibilityArray.length; i++) {
            if (accessibilityArray[i] == row) {
              foundBoundaryAbove = true;
              position = {
                x: i,
                y: row
              }
              breakCheck = true;
              break;
            }
          }
          if (breakCheck) {break;}
        }
      }

      if (foundBoundaryAbove == false) {
        var breakCheck = false;
        for (var row = currentColor.v - 1; row >= 0; row--) {
          for (var i=0; i < accessibilityArray.length; i++) {
            if (accessibilityArray[i] == row) {
              foundBoundaryBelow = true;

              position = {
                x: i,
                y: row
              }
              breakCheck = true;
              break;
            }
          }
          if (breakCheck) {break;}
        }
      }

      // TODO: Does there exist a closest saturation? If not, handle the error

      var scaledRow = (100 - position.y) * 2;
      var scaledColumn = position.x * 2;

      position = {
        x: scaledColumn,
        y: scaledRow
      }

      console.log(position);

      return position;
    }

    var satPositionsOrPosition;
    if (numberOfAccessibilityPaths == 2) {
      satPositionsOrPosition = [getSatPositionFromAccessibilityArray(accessibilityArray1), getSatPositionFromAccessibilityArray(accessibilityArray2)];
    } else if (numberOfAccessibilityPaths == 1){
      satPositionsOrPosition = [getSatPositionFromAccessibilityArray(accessibilityArray1)]
    } else {
      satPositionsOrPosition = [];
    }

    return satPositionsOrPosition;
  }

  function getClosestBrightCirclePosition(currentColor) {
    var position;
    var foundBoundaryInColumn = false;

    function getBrightPositionFromAccessibilityArray(accessibilityArray) {
      if (accessibilityArray[currentColor.s]) {
        foundBoundaryInColumn = true;
        position = {
          x: currentColor.s,
          y: accessibilityArray[currentColor.s]
        }
      } else {
        var foundToTheRight = false;
        for (var column = currentColor.s + 1; column <= 100; column++) {
          if (accessibilityArray[column]) {
            foundToTheRight = true;
            position = {
              x: column,
              y: accessibilityArray[column]
            }
            // be sure not to search through the whole array but only the first found
            break;
          }
        }

        var foundToTheLeft = false;
        if (foundToTheRight == false) {
          for (var column = currentColor.s - 1; column >= 0; column--) {
            if (accessibilityArray[column]) {
              foundToTheLeft = true;
              position = {
                x: column,
                y: accessibilityArray[column]
              }
              // be sure not to search through the whole array but only the first found
              break;
            }
          }
        }
        // TODO: Does there exist a closest brightness? If not, handle the error
      }

      var scaledRow = (100 - position.y) * 2;
      var scaledColumn = position.x * 2;

      position = {
        x: scaledColumn,
        y: scaledRow
      }

      return position;
    }

    var brightPositionsOrPosition;
    if (numberOfAccessibilityPaths == 2) {
      brightPositionsOrPosition = [getBrightPositionFromAccessibilityArray(accessibilityArray1), getBrightPositionFromAccessibilityArray(accessibilityArray2)];
    } else if (numberOfAccessibilityPaths == 1){
      brightPositionsOrPosition = [getBrightPositionFromAccessibilityArray(accessibilityArray1)]
    } else {
      brightPositionsOrPosition = [];
    }

    return brightPositionsOrPosition;
  }

  //Drag on Color Space
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

  function updateAccessibilityPaths(svgArray) {
    // Data Join
    var line = satBrightSpaceSVG.selectAll('path').data(svgArray);

    // Update
    line.attr('d', function(d) { return d});

    // Enter + Update
    line.enter().insert('path', ":first-child")
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('d', function(d) {return d})
      .attr('stroke-width', 1);

    line.exit().remove();
  }

  // Need to initialize the accessibility path before drawing the saturation & brightness selector
  // so that the selector is on top of the accessibility path.
  updateAccessibilityPaths(getAccessibilityCurves(currentColor.h, currentContrastRequirement));

  // Create the saturation & brightness selector
  satBrightSpaceSVG.append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('id', 'currentColorCircle')
    .attr('cx', currentColor.s*2)
    .attr('cy', 200 -(currentColor.v*2))
    .attr('r', 5)
    .attr('stroke-width', 2);

  // create the Hue selector nub
  var hueNubSpaceSVG = d3.select('#hueNubSpace');
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

  // Handle Drag Events on the hueNubSpaceSVG
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

  // MARK: Initialize HUE Channel Canvas
  hueChannelData();

  // MARK: INITIAL GLOBAL UPDATE
  update(currentColor, currentTextColor, currentContrastRequirement);

  // MARK: GLOBAL UPDATE
  function update(currentColor, currentTextColor, currentContrastRequirement) {
    updateGridImageData(currentColor);
    updateExampleButton(currentColor, currentTextColor);
    updateContrastWarning(currentColor, currentTextColor, currentContrastRequirement);
    updateInputs(currentColor, currentTextColor);
    updateHueNub(currentColor.h);
    updateCurrentColorCircle(currentColor);
    updateAccessibilityPaths(getAccessibilityCurves(currentColor.h, currentContrastRequirement));

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

  function updateContrastWarning(currentColor, currentTextColor, currentContrastRequirement) {
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

  function updateGridImageData(currentColor) {
    gridImageData(currentColor);
  }

  function updateHueNub(hue) {
    d3.select('#hueSelectorNub').attr('x', hue / 1.8).attr('hue', hue);
  }

  function updateCurrentColorCircle(currentColor) {
    d3.select('#currentColorCircle')
      .attr('cx', currentColor.s*2)
      .attr('cy', 200 - (currentColor.v*2))
  }

  function updateCloseSaturationColor(currentColor, currentContrastRequirement) {
    d3.select('#closestSatCircle1')
      .attr('cx', getClosestSatCirclePosition(currentColor,currentContrastRequirement)[0].x)
      .attr('cy', getClosestSatCirclePosition(currentColor,currentContrastRequirement)[0].y);
  }

  function updateCloseBrightnessColor(currentColor, currentContrastRequirement) {
    d3.select('#closestBrightCircle')
      .attr('cx', getClosestBrightCirclePosition(currentColor,currentContrastRequirement).x)
      .attr('cy', getClosestBrightCirclePosition(currentColor,currentContrastRequirement).y);
  }

  // MARK: Interaction Handlers
  d3.select('#hueInput').on('input', function() {
    currentColor.h = this.value;
    update(currentColor, currentTextColor);
  });

  d3.select('#satInput').on('input', function() {
    currentColor.s = this.value;
    update(currentColor, currentTextColor);
  });

  d3.select('#brightInput').on('input', function() {
    currentColor.v = this.value;
    update(currentColor, currentTextColor);
  });

  d3.select('#textHueInput').on('input', function() {
    currentTextColor.h = this.value;
    update(currentColor, currentTextColor);
  });

  d3.select('#textSatInput').on('input', function() {
    currentTextColor.s = this.value;
    update(currentColor, currentTextColor);
  });

  d3.select('#textBrightInput').on('input', function() {
    currentTextColor.v = this.value;
    update(currentColor, currentTextColor);
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
