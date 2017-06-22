var myHue = 20;

var myColor = {
    h:44,
    s:100,
    v:100
}

var myColor2 = {
    h:360,
    s:53,
    v:87
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

var colorDouble = [white,myColor2];

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
        y: ypos,
        width: width,
        height: height,
        columnPos: columnPos,
        rowPos: rowPos,
        fill: plotHSV(hue, columnPos, rowPos),
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

window.onload = function() {
  var svg = d3.select('svg');

  var row = svg.selectAll('.row')
      .data(gridData(myHue))
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
    .attr('columnPos', function(d) { return d.columnPos})
    .attr('rowPos', function(d) { return d.rowPos});

  d3.select('#buttonHue').on('input', function() {
    update(this.value);
  });

  // Inital starting hue
  update(myHue);

  function update(hue) {
    d3.select('#buttonHue').attr('value', hue);
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
