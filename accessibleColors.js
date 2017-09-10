// Double Line
// var initialColor = {
//   h: 285,
//   s: 65,
//   v: 57
// }

// var white = {
//   h: 62,
//   s: 89,
//   v: 43
// }

var initialColor = {
  h: 199,
  s: 42,
  v: 77
}

var white = {
  h: 0,
  s: 0,
  v: 100
}

var currentColor = initialColor;
var currentTextColor = white;
var showCloseColorsChecked = false;
var accessibilityArray1, accessibilityArray2;
var currentContrastRequirement = 4.5;
var numberOfAccessibilityPaths = 1;
var currentlySelectedColor, renderedColor, renderedColorText;
var currentColorPosition;

var closestBrightCirclePosition1 = {
  x: 0,
  y: 0
}
var closestBrightCirclePosition2  = {
  x: 0,
  y: 0
}
var closestSatCirclePosition1  = {
  x: 0,
  y: 0
}
var closestSatCirclePosition2  = {
  x: 0,
  y: 0
}

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
    .attr('fill', function() {
      var tempRGBnorm = HSVtoRGB(normHSV(currentColor));
      var tempRGB = {
        r: Math.floor(tempRGBnorm.r * 255),
        g: Math.floor(tempRGBnorm.g * 255),
        b: Math.floor(tempRGBnorm.b * 255)
      }
      return ('rgb(' + tempRGB.r + "," + tempRGB.g + ',' + tempRGB.b + ')');
    })
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
      updateCloseColorLines();
      updateRenderClosestColors(currentColor, currentContrastRequirement);
      updateCurrentlySelectedColor();
      updateRenderedColorLocation();
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
    updateHexColor(currentColor);
    updateTextHexColor(currentTextColor);
  }

  function updateHexColor(currentColor) {
    var tempRGBnorm = HSVtoRGB(normHSV(currentColor))
    var tempRGB = {
      r: Math.round(tempRGBnorm.r * 255),
      g: Math.round(tempRGBnorm.g * 255),
      b: Math.round(tempRGBnorm.b * 255)
    }
    var hex = rgbToHex(tempRGB);
    d3.select('#hexInput').property('value', hex);
  }

  function updateTextHexColor(currentTextColor) {
    var tempRGBnorm = HSVtoRGB(normHSV(currentTextColor))
    var tempRGB = {
      r: Math.round(tempRGBnorm.r * 255),
      g: Math.round(tempRGBnorm.g * 255),
      b: Math.round(tempRGBnorm.b * 255)
    }
    var hex = rgbToHex(tempRGB);
    d3.select('#textHexInput').property('value', hex);
  }

  function updateGridImageData(currentColor) {
    gridImageData(currentColor);
  }

  function updateHueNub(hue) {
    d3.select('#hueSelectorNub').attr('x', hue / 1.8).attr('hue', hue);
  }

  function updateCurrentColorCircle(currentColor) {
    currentColorPosition = {
      x: currentColor.s*2,
      y: 200 - (currentColor.v * 2)
    }
    d3.select('#currentColorCircle')
      .attr('cx', currentColorPosition.x)
      .attr('cy', currentColorPosition.y)
      .attr('fill', function() {
        var tempRGBnorm = HSVtoRGB(normHSV(currentColor));
        var tempRGB = {
          r: Math.floor(tempRGBnorm.r * 255),
          g: Math.floor(tempRGBnorm.g * 255),
          b: Math.floor(tempRGBnorm.b * 255)
        }
        return ('rgb(' + tempRGB.r + "," + tempRGB.g + ',' + tempRGB.b + ')');
      });
  }

  function updateCloseSaturationColor(currentColor, currentContrastRequirement) {

    // Data Join
    var closestSatCircles = satBrightSpaceSVG.selectAll('.closestSatCircle').data(getClosestSatCirclePosition(currentColor,currentContrastRequirement));

    // Update
    closestSatCircles
      .attr('cx', function(d,i) {
        if (i == 0) {
          closestSatCirclePosition1.x = d.x;
        } else {
          closestSatCirclePosition2.x = d.x;
        }
        return d.x;
      })
      .attr('cy', function(d,i) {
        if (i == 0) {
          closestSatCirclePosition1.y = d.y;
        } else {
          closestSatCirclePosition2.y = d.y;
        }
        return d.y;
      });

    // Enter
    closestSatCircles.enter().append('circle')
      .attr('fill', 'black')
      .attr('stroke', 'none')
      .attr('id', function(d,i) { return "closestSatCircle" + (i + 1)})
      .attr('class', 'closestSatCircle')
      .attr('cx', function(d,i) {
        if (i == 0) {
          closestSatCirclePosition1.x = d.x;
        } else {
          closestSatCirclePosition2.x = d.x;
        }
        return d.x;
      })
      .attr('cy', function(d,i) {
        if (i == 0) {
          closestSatCirclePosition1.y = d.y;
        } else {
          closestSatCirclePosition2.y = d.y;
        }
        return d.y;
      })
      .attr('r', 5);

    // Exit
    closestSatCircles.exit().remove();
  }

  function updateCloseBrightnessColor(currentColor, currentContrastRequirement) {

    // Data Join
    var closestBrightCircles = satBrightSpaceSVG.selectAll('.closestBrightCircle').data(getClosestBrightCirclePosition(currentColor,currentContrastRequirement));

    // Update
    closestBrightCircles
      .attr('cx', function(d,i) {
        if (i == 0) {
          closestBrightCirclePosition1.x = d.x;
        } else {
          closestBrightCirclePosition2.x = d.x;
        }
        return d.x;
      })
      .attr('cy', function(d,i) {
        if (i == 0) {
          closestBrightCirclePosition1.y = d.y;
        } else {
          closestBrightCirclePosition2.y = d.y;
        }
        return d.y;
      });

    // Enter
    closestBrightCircles.enter().append('circle')
      .attr('fill', 'black')
      .attr('stroke', 'none')
      .attr('id', function(d,i) { return "closestBrightCircle" + (i + 1)})
      .attr('class', 'closestBrightCircle')
      .attr('cx', function(d,i) {
        if (i == 0) {
          closestBrightCirclePosition1.x = d.x;
          console.log(closestBrightCirclePosition1.x);
        } else {
          closestBrightCirclePosition2.x = d.x;
          console.log(closestBrightCirclePosition2.x);
        }
        return d.x;
      })
      .attr('cy', function(d,i) {
        if (i == 0) {
          closestBrightCirclePosition1.y = d.y;
        } else {
          closestBrightCirclePosition2.y = d.y;
        }
        return d.y;
      })
      .attr('r', 5);

    // Exit
    closestBrightCircles.exit().remove();

  }

  function updateCloseColorLines() {
    var line1Sat = {
      x1: closestSatCirclePosition1.x,
      y1: closestSatCirclePosition1.y,
      x2: currentColorPosition.x,
      y2: currentColorPosition.y
    };
    var line2Bright = {
      x1: closestBrightCirclePosition1.x,
      y1: closestBrightCirclePosition1.y,
      x2: currentColorPosition.x,
      y2: currentColorPosition.y
    }

    var line3Sat = {
      x1: closestSatCirclePosition2.x,
      y1: closestSatCirclePosition2.y,
      x2: currentColorPosition.x,
      y2: currentColorPosition.y
    }

    var line4Bright = {
      x1: closestBrightCirclePosition2.x,
      y1: closestBrightCirclePosition2.y,
      x2: currentColorPosition.x,
      y2: currentColorPosition.y
    }

    if (numberOfAccessibilityPaths == 2) {
      var lineArray = [line1Sat,line2Bright,line3Sat,line4Bright];
    } else {
      var lineArray = [line1Sat, line2Bright];
    }

    // Data Bind
    var closestColorLines = satBrightSpaceSVG.selectAll('.closestColorLine').data(lineArray);

    // Update
    closestColorLines
      .attr('x1', function(d) { return d.x1 })
      .attr('y1', function(d) { return d.y1 })
      .attr('x2', function(d) { return d.x2 })
      .attr('y2', function(d) { return d.y2 })

    // Enter
    closestColorLines.enter().insert('line', ':first-child')
      .attr('x1', function(d) { return d.x1 })
      .attr('y1', function(d) { return d.y1 })
      .attr('x2', function(d) { return d.x2 })
      .attr('y2', function(d) { return d.y2 })
      .attr('stroke', 'black')
      .attr('class', 'closestColorLine')

    // Exit
    closestColorLines.exit().remove();
  }

  function updateRenderClosestColors(currentColor, contrastRequirement) {
    d3.select('#renderClosestAccessibileColors1').selectAll('.closestsColors1').classed('selected', false).classed('notActive', false);

    var brightnessArray = getClosestBrightCirclePosition(currentColor,currentContrastRequirement);
    var saturationArray = getClosestSatCirclePosition(currentColor,currentContrastRequirement);
    var brightness1X = Math.floor(brightnessArray[0].x / 2);
    var saturation1X = Math.floor(saturationArray[0].x / 2);
    var isBrightnessLarger1;

    if (brightness1X > saturation1X) {
      var closestColorsArray1 = accessibilityArray1.slice(saturation1X, brightness1X + 1);
      isBrightnessLarger1 = true;
    } else {
      var closestColorsArray1 = accessibilityArray1.slice(brightness1X, saturation1X + 1);
      isBrightnessLarger1 = false;
    }

    var isBrightnessLarger2;
    if ((brightnessArray.length == 2) && (saturationArray.length == 2)) {
      d3.select('#renderClosestAccessibileColors2').style('display', 'flex');

      var brightness2X = Math.floor(getClosestBrightCirclePosition(currentColor,currentContrastRequirement)[1].x / 2);
      var saturation2X = Math.floor(getClosestSatCirclePosition(currentColor, currentContrastRequirement)[1].x / 2);

      if (brightness2X > saturation2X) {
        var closestColorsArray2 = accessibilityArray2.slice(saturation2X,brightness2X + 1);
        isBrightnessLarger2 = true;
      } else {
        var closestColorsArray2 = accessibilityArray2.slice(brightness2X,saturation2X + 1);
        isBrightnessLarger2 = false;
      }
    } else {
      d3.select('#renderClosestAccessibileColors2').style('display', 'none');
    }

    var renderClosestAccessibileColors1 = d3.select('#renderClosestAccessibileColors1').selectAll('.closestsColors1').data(closestColorsArray1);

    var middleOfLength = Math.floor(closestColorsArray1.length / 2)

    if (isBrightnessLarger1) {
      var indexStart1 = saturation1X;
    } else {
      var indexStart1 = brightness1X;
    }

    // REMOVE
    renderClosestAccessibileColors1.exit().remove();

    // UPDATE
    renderClosestAccessibileColors1
      .attr('data-hsv', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart1 + i,
            v: d
          }
        return (tempHSV.h + ", " + tempHSV.s + ', ' + tempHSV.v)
        })
      .style('background-color', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart1 + i,
            v: d
          }
          var tempRGBnorm = HSVtoRGB(normHSV(tempHSV));
          var tempRGB = {
            r: Math.floor(tempRGBnorm.r * 255),
            g: Math.floor(tempRGBnorm.g * 255),
            b: Math.floor(tempRGBnorm.b * 255)
          }
        return "rgb(" + tempRGB.r + "," + tempRGB.g + "," + tempRGB.b + ")"
        });

    // ENTER
    renderClosestAccessibileColors1.enter().append('div')
        .style('height', '20px')
        .style('width', '100%')
        .attr('class', 'closestsColors1')
        .attr('data-hsv', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart1 + i,
            v: d
          }
        return (tempHSV.h + ", " + tempHSV.s + ', ' + tempHSV.v)
        })
        .style('background-color', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart1 + i,
            v: d
          }
          var tempRGBnorm = HSVtoRGB(normHSV(tempHSV));
          var tempRGB = {
            r: Math.floor(tempRGBnorm.r * 255),
            g: Math.floor(tempRGBnorm.g * 255),
            b: Math.floor(tempRGBnorm.b * 255)
          }
        return "rgb(" + tempRGB.r + "," + tempRGB.g + "," + tempRGB.b + ")"
        });



      var closestColors1Nodes = document.querySelector('#renderClosestAccessibileColors1').getElementsByClassName('closestsColors1');

      d3.selectAll(".selected").classed('.selected', false);
      d3.select(closestColors1Nodes[middleOfLength]).attr('class', 'closestsColors1 selected notActive');

      if (typeof closestColorsArray2 === "undefined") {
        closestColorsArray2 = [];
      }

      if (isBrightnessLarger1) {
        var indexStart2 = brightness2X;
      } else {
        var indexStart2 = saturation2X;
      }

      var renderClosestAccessibileColors2 = d3.select('#renderClosestAccessibileColors2').selectAll('.closestsColors2').data(closestColorsArray2);

      // REMOVE
      renderClosestAccessibileColors2.exit().remove();

      // UPDATE
      renderClosestAccessibileColors2
        .attr('data-hsv', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart2 + i,
            v: d
          }
          return (tempHSV.h + ", " + tempHSV.s + ', ' + tempHSV.v)
        })
        .style('background-color', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart2 + i,
            v: d
          }
          var tempRGBnorm = HSVtoRGB(normHSV(tempHSV));
          var tempRGB = {
            r: Math.floor(tempRGBnorm.r * 255),
            g: Math.floor(tempRGBnorm.g * 255),
            b: Math.floor(tempRGBnorm.b * 255)
          }
        return "rgb(" + tempRGB.r + "," + tempRGB.g + "," + tempRGB.b + ")"
        });

      // ENTER
      renderClosestAccessibileColors2.enter().append('div')
        .attr('class','closestsColors2')
        .attr('data-hsv', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart2 + i,
            v: d
          }
          return (tempHSV.h + ", " + tempHSV.s + ', ' + tempHSV.v)
        })
        .style('height', '20px')
        .style('width', '100%')
        .style('background-color', function (d,i) {
          var tempHSV = {
            h: currentColor.h,
            s: indexStart2 + i,
            v: d
          }
          var tempRGBnorm = HSVtoRGB(normHSV(tempHSV));
          var tempRGB = {
            r: Math.floor(tempRGBnorm.r * 255),
            g: Math.floor(tempRGBnorm.g * 255),
            b: Math.floor(tempRGBnorm.b * 255)
          }
        return "rgb(" + tempRGB.r + "," + tempRGB.g + "," + tempRGB.b + ")"
        });
  }

  function updateCurrentlySelectedColor() {
    currentlySelectedColor = d3.selectAll('.renderClosestAccessibileColors').select(".selected");
    renderedColor = currentlySelectedColor;
    renderedColor.datum(function() { renderedColorText = this.dataset.hsv; })
    updateRenderedClosestColor(renderedColorText);

    d3.selectAll(".renderClosestAccessibileColors").selectAll('div')
    .on('click', function() {
      d3.selectAll(".selected").classed('selected', false);
      d3.select(this).classed('selected', true);
      currentlySelectedColor = d3.select(this);
    })
    .on('mouseover', function(){
      renderedColor = d3.select(this);
      currentlySelectedColor.classed('notActive', false);
      renderedColor.datum(function() { renderedColorText = this.dataset.hsv; })
      updateRenderedClosestColor(renderedColorText);
      updateRenderedColorLocation();
    })
    .on('mouseout', function() {
        renderedColor = currentlySelectedColor;
        currentlySelectedColor.classed('notActive', true);
        renderedColor.datum(function() { renderedColorText = this.dataset.hsv; })
        updateRenderedClosestColor(renderedColorText);
        updateRenderedColorLocation();
    });
  }

  function updateRenderedClosestColor(text) {
    var textArray = text.split(', ');
    var tempHSV = {
      h: textArray[0],
      s: textArray[1],
      v: textArray[2]
    }
    var tempRGBnorm = HSVtoRGB(normHSV(tempHSV));
    var tempRGB = {
      r: Math.round(tempRGBnorm.r*255),
      g: Math.round(tempRGBnorm.g*255),
      b: Math.round(tempRGBnorm.b*255)
    }
    var hex = "#" + rgbToHex(tempRGB);
    var hsb = "HSB(" + text + ")"
    d3.select('#renderedClosestColor').text(hsb + " " + hex);
  }

  function updateRenderedColorLocation() {
    renderedColorArray = renderedColorText.split(',')

    var renderedColorPosition = [{
      x: renderedColorArray[1] * 2,
      y: 200 - (renderedColorArray[2] * 2)
    }]

    // Data Bind
    var renderedColorCircle = satBrightSpaceSVG.selectAll('.renderedColorCircle').data(renderedColorPosition);

    // Update
    renderedColorCircle
      .attr('cx', function(d) { return d.x})
      .attr('cy', function(d) { return d.y});

    // Enter
    renderedColorCircle.enter().append('circle')
      .attr('cx', function(d) { return d.x})
      .attr('cy', function(d) { return d.y})
      .attr('r', 3)
      .attr('fill', 'white')
      .attr('class', 'renderedColorCircle');

    // Exit
    renderedColorCircle.exit().remove();

    // Data Bind
    var renderedColorLine = satBrightSpaceSVG.selectAll('.renderedColorLine').data(renderedColorPosition);

    // Update
    renderedColorLine
      .attr('x1', currentColorPosition.x)
      .attr('y1', currentColorPosition.y)
      .attr('x2', function(d) { return d.x})
      .attr('y2', function(d) { return d.y})

    // Enter
    renderedColorLine.enter().insert('line', ':first-child')
      .attr('x1', currentColorPosition.x)
      .attr('y1', currentColorPosition.y)
      .attr('x2', function(d) { return d.x})
      .attr('y2', function(d) { return d.y})
      .attr('stroke', 'white')
      .attr('class', 'renderedColorLine');

    // Remove
    renderedColorLine.exit().remove();
  }

  // MARK: Interaction Handlers
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

  d3.select('#hexInput').on('change', function() {
    if (this.value.charAt(0) == "#") {
      var hex = this.value.substring(1);
      d3.select('#hexInput').property('value', hex);
    } else {
      var hex = this.value;
    }
    var tempHSVnorm = RGBtoHSV(normRGB(hexToRgb(hex)));
    var tempHSV = {
      h: Math.round(tempHSVnorm.h*360),
      s: Math.round(tempHSVnorm.s*100),
      v: Math.round(tempHSVnorm.v*100)
    }
    currentColor = tempHSV;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.select('#textHexInput').on('change', function() {
    if (this.value.charAt(0) == "#") {
      var hex = this.value.substring(1);
      d3.select('#textHexInput').property('value', hex);
    } else {
      var hex = this.value;
    }
    var tempHSVnorm = RGBtoHSV(normRGB(hexToRgb(hex)));
    var tempHSV = {
      h: Math.round(tempHSVnorm.h*360),
      s: Math.round(tempHSVnorm.s*100),
      v: Math.round(tempHSVnorm.v*100)
    }
    currentTextColor = tempHSV;
    update(currentColor, currentTextColor, currentContrastRequirement);
  });

  d3.selectAll(("input[name='contrastValue']")).on("change", function(){
    currentContrastRequirement = this.value;
    update(currentColor,currentTextColor,currentContrastRequirement);
  });

  d3.selectAll(("input[name='showCloseColors']")).on("change", function(){
    showCloseColorsChecked = this.checked;
    if (!this.checked) {
      d3.select("#closestColorsContainer").attr('style', "display:none;");
      d3.selectAll(".renderedColorCircle").attr('style', "display:none;");
      d3.selectAll('.renderedColorLine').attr('style', "display:none;");
      d3.selectAll('.closestColorLine').attr('style', "display:none;");
      d3.selectAll('.closestBrightCircle').attr('style', "display:none;");
      d3.selectAll('.closestSatCircle').attr('style', "display:none;");
    } else {
      d3.select("#closestColorsContainer").attr('style', "display:inherit;")
      d3.selectAll(".renderedColorCircle").attr('style', "display:inherit;");
      d3.selectAll('.renderedColorLine').attr('style', "display:inherit;");
      d3.selectAll('.closestColorLine').attr('style', "display:inherit;");
      d3.selectAll('.closestBrightCircle').attr('style', "display:inherit;");
      d3.selectAll('.closestSatCircle').attr('style', "display:inherit;");
      update(currentColor,currentTextColor,currentContrastRequirement)
    }

    // TODO: Hide / show accessibility dots
  });

}
