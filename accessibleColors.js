function gridData() {
  var data = new Array();
  var xpos = 1;
  var ypos = 1;
  var columnPos = 0;
  var rowPos = 0;
  var width = 1;
  var height = 1;

  //iterate over rows

  for (var row = 0; row <= 255; row++) {
    data.push( new Array() );

    // interate for cells
    for (var column = 0; column <= 255; column++) {
      data[row].push({
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        columnPos: columnPos,
        rowPos: rowPos,
      })

      // increment x
      xpos += width;
      //increment column position by 1
      columnPos += 1;
    }
    // reset x position after row is complete
    xpos = 1;
    // reset column position after row is complete
    columnPos = 0;
    // increment the y position for the new row
    ypos += height;
    // increment the row position for the new row
    rowPos += 1;
  }

  return data;
}


window.onload = function() {
console.log("hello");
var svg = d3.select('svg');

var row = svg.selectAll('.row')
    .data(gridData())
  .enter().append('g')
    .attr('class', "row");

  var column = row.selectAll('.square')
    .data(function(d) { return d;})
  .enter().append('rect')
    .attr('x', function(d) { return d.x;})
    .attr('y', function(d) { return d.y;})
    .attr('width', function(d) { return d.width;})
    .attr('height', function(d) { return d.height;})
    .attr('fill', function(d) {
      var tempColor = "rgb(" + d.columnPos + "," + d.rowPos + ",255)"
      return tempColor;});
}
