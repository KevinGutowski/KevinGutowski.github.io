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
var accessibilityPath;

function gridData(hue) {
  var data = new Array();
  var xpos = 0;
  var ypos = 0;
  var columnPos = 0;
  var rowPos = 0;
  var width = 2;
  var height = 2;

  //iterate over rows

  for (var row = 0; row <= 100; row++) {
    data.push( new Array() );
    // interate for cells
    for (var column = 0; column <= 100; column++) {

      data[row].push({
        x: xpos,
        y: 100*height - ypos,
        width: width,
        height: height,
        columnPos: columnPos,
        rowPos: rowPos,
        fill: plotHSV(hue, columnPos, rowPos),
        hsv: "HSB(" + hue + "," + columnPos + "," + rowPos + ")",
      })

      // increment x
      xpos += width;
      //increment column position by 1
      columnPos += 1;
    }
    // reset x position after row is complete
    xpos = 0;
    // reset column position after row is complete
    columnPos = 0;
    // increment the y position for the new row
    ypos += height;
    // increment the row position for the new row
    rowPos += 1;
  }

  //Reset Path
  accessibilityPath = "M";
  //Build Accessibility Path
  for (var column = 0; column <= 100; column++) {
    for (var row = 0; row <=100; row++) {
      if (checkColorContrast(hue, column, row)) {
        var scaledRow = (100 - row) * height;
        var scaledColumn = column*width;
        accessibilityPath = accessibilityPath + " " + scaledColumn + " " + scaledRow;
        break;
      }
    }
  }

  return data;
}

function hues() {
  var data = new Array();
  var xpos = 0;
  var ypos = 0;
  var columnPos = 0;
  var width = 1;
  var height = 10;
  for (var hue = 0; hue <= 360; hue++) {
    data.push({
      x: xpos / 1.8,
      y: ypos,
      width: width,
      height: height,
      columnPos: columnPos,
      hue: hue,
      fill: plotHSV(hue, 100, 100),
    })

    // increment x
    xpos += width;
    //increment column position by 1
    columnPos += 1;
  }

  return data;
}

var hueSelectorNub = [{x:initialColor.h / 1.8}];

function accessibleColors() {

  //Draw Color Grid
  var svg = d3.select('#colorSpace');

  var row = svg.selectAll('.row')
      .data(gridData(initialColor.h))
    .enter().append('g')
      .attr('class', "row");

  var column = row.selectAll('.square')
    .data(function(d) { return d;})
  .enter().append('rect')
    .attr('x', function(d) { return d.x;})
    .attr('y', function(d) { return d.y;})
    .attr('width', 0)
    .attr('height', 0)
    .attr('fill', function(d) { return d.fill });

  column
    .attr('width', function(d) { return d.width;})
    .attr('height', function(d) { return d.height;})
    .attr('data-hsv', function(d) { return d.hsv})

  // Draw Accessible Curve
  svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('class', "accessibilityPath")
    .attr('d', accessibilityPath)
    .attr('stroke-width', "1");

  // Draw Current Color
  svg.append('circle')
    .attr('fill', 'none')
    .attr('stroke', "white")
    .attr('class', 'currentColorCircle')
    .attr('cx', currentColor.s*2)
    .attr('cy', 200-(currentColor.v*2))
    .attr('r', 5)
    .attr('stroke-width', 2)

  // Draw Hue Selector
  var svg = d3.select('#hueSelector');

  var hue = svg.selectAll('.hue')
      .data(hues())
    .enter().append('rect')
      .attr('x', function(d) {return d.x;})
      .attr('y', "0")
      .attr('width', function(d) {return d.width})
      .attr('height', function(d) {return d.height})
      .attr('fill', function(d) {return d.fill})
      .attr('class', '.hue')
      .on('mousedown', function(d) {
          currentColor.h = d.hue;
          return update(currentColor,currentTextColor);
        })

  var selector = svg.selectAll('#hueSelector')
        .data(hueSelectorNub)
      .enter().append('rect')
        .attr('x', function(d) {return d.x;})
        .attr('y', '0')
        .attr('width', '5')
        .attr('height', '10')
        .attr('hue', initialColor.h)
        .attr('id', "hueSelectorNub")
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

  function dragstarted(d) {
    d3.select(this).raise().classed('active', true);
  }

  function dragged(d) {
    var draggingX = d3.event.x;
    var hueSelectorNubPosition;
    if (draggingX > 355) {
      hueSelectorNubPosition = 355;
    } else if (draggingX < 0) {
      hueSelectorNubPosition = 0;
    } else {
      hueSelectorNubPosition = draggingX;
    }
    d3.select(this).attr('x', d.x = hueSelectorNubPosition);
    currentColor.h = Math.round(hueSelectorNubPosition)
    update(currentColor, currentTextColor);
  }

  function dragended(d) {
    d3.select(this).classed('active', false);
  }

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
    currentTextColor.s = parseInt(this.value);
    update(currentColor, currentTextColor);
  });

  d3.select('#textBrightInput').on('input', function() {
    currentTextColor.v = parseInt(this.value);
    update(currentColor, currentTextColor);
  });

  // Inital update
  update(initialColor, white);

  // Global Update
  function update(currentColor, currentTextColor) {
    updateDisplay(currentColor, currentTextColor);
    updateContrastWarning(currentColor,currentTextColor);
    updateInputs(currentColor, currentTextColor);
    updateHues(currentColor.h);
    updateCurrentColorCircle(currentColor);
  }

  function updateDisplay(currentColor, currentTextColor) {

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
    if (contrastVal >= accessibilityValue) {
      d3.select('#optionalWarning').attr('style', "display:none");
    } else {
      d3.select('#optionalWarning').attr('style', "display:inherit");
    }

  }

  function updateInputs(backgroundColor, textColor) {
    d3.select('#hueInput').property('value', backgroundColor.h);
    d3.select('#satInput').property('value', backgroundColor.s);
    d3.select('#brightInput').property('value', backgroundColor.v);

    d3.select('#textHueInput').property('value', textColor.h);
    d3.select('#textSatInput').property('value', textColor.s);
    d3.select('#textBrightInput').property('value', textColor.v);
  }

  function updateHues(hue) {
    d3.select('#hueInput').property('value', hue);
    d3.select('#hueSelectorNub').attr('x', hue / 1.8).attr('hue', hue);
    d3.selectAll('.row')
        .data(gridData(hue))
      .selectAll('rect')
        .data(function(d) { return d;})
          .attr('fill', function(d) { return d.fill });

    d3.select('.accessibilityPath').attr('d', accessibilityPath);
  }

  function updateCurrentColorCircle(currentColor) {
    d3.select('.currentColorCircle')
      .attr('cx', currentColor.s*2)
      .attr('cy', 200-(currentColor.v*2))
  }
}

function plotHSV(hue, x, y) {
  var tempColorHSV = {
    h: hue,
    s: x,
    v: y,
  }

  var tempColorRGBnormalized = HSVtoRGB(normHSV(tempColorHSV));

  var tempColorRGB =
    "rgb(" +
    Math.round(tempColorRGBnormalized.r*255)
    + "," +
    Math.round(tempColorRGBnormalized.g*255)
    + "," +
    Math.round(tempColorRGBnormalized.b*255)
     + ")";

  return tempColorRGB;
}

function checkColorContrast(hue, x, y) {
  var tempColorHSV = {
    h: hue,
    s: x,
    v: y,
  }
  var contrast = getColorContrastHSV(tempColorHSV, currentTextColor);

  return (contrast <= accessibilityValue);
}
