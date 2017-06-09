var array = [1,2,3,4];

var svg = d3.select('svg');

svg.selectAll('rect').data(array)
    .enter().append('rect');
