var initalColor = {
    h:20,
    s:88,
    v:85
}

var white = {
  h: 0,
  s: 0,
  v: 100,
}

var black = {
  h: 0,
  s: 0,
  v: 0
}


var accessibilityValue = 4.5;

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
        y: (100*height) - ypos,
        width: width,
        height: height,
        columnPos: columnPos,
        rowPos: rowPos,
        fill: plotHSV(hue, columnPos, rowPos),
        hsv: "HSB(" + hue + "," + columnPos + "," + rowPos + ")",
        isOnBoundary: false
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

  for (var column = 0; column <= 100; column++) {
    for (var row = 0; row <=100; row++) {
      if (checkColorContrast(hue, column, row)) {
        data[row][column].isOnBoundary = true;
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
      width: width / 1.8,
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

var hueSelectorNub = [{x:initalColor.h / 1.8}];

function accessibleColors() {

  //Draw Color Grid
  var svg = d3.select('#colorSpace');

  var row = svg.selectAll('.row')
      .data(gridData(initalColor.h))
    .enter().append('g')
      .attr('class', "row");

  var column = row.selectAll('.square')
    .data(function(d) { return d;})
  .enter().append('rect')
    .attr('x', function(d) { return d.x;})
    .attr('y', function(d) { return d.y;})
    .attr('width', 0)
    .attr('height', 0)
    .attr('class', function(d) { return d.isOnBoundary ? "line" : null })
    .attr('fill', function(d) { return d.fill });

  column
    .attr('width', function(d) { return d.width;})
    .attr('height', function(d) { return d.height;})
    .attr('data-hsv', function(d) { return d.hsv})


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
      .on('mousedown', function(d) {return update(d.hue)})

  var selector = svg.selectAll('#hueSelector')
        .data(hueSelectorNub)
      .enter().append('rect')
        .attr('x', function(d) {return d.x;})
        .attr('y', '0')
        .attr('width', '5')
        .attr('height', '10')
        .attr('hue', initalColor.h)
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
    update(Math.round(hueSelectorNubPosition));
  }

  function dragended(d) {
    d3.select(this).classed('active', false);
  }

  d3.select('#hueSpecial').on('input', function() {
    update(this.value);
  });

  // Inital starting hue
  update(initalColor.h);
  d3.select('#hueSpecial').attr('value', initalColor.h);

  function update(hue) {
    d3.select('#hueSpecial').attr('value', hue);
    d3.select('#hueSelectorNub').attr('x', hue / 1.8).attr('hue', hue);
    d3.selectAll('.row')
        .data(gridData(hue))
      .selectAll('rect')
        .data(function(d) { return d;})
          .attr('class', function(d) { return d.isOnBoundary ? "line" : null })
          .attr('fill', function(d) { return d.fill });
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
  var contrast = getColorContrastHSV(tempColorHSV, white);

  return (contrast <= 4.5);
}

// When the hue input changes update the graphic
