var colors = ['F73C4B', "F96E79", "1AAC9F", "20C6B6", "DAA725", "F4BB2B", "0F1E25", "2D3B41", '7D8589', "A3A9AC", "FAFBFB"]
var colorObjects = [];

var white = {
    h: 0,
    s: 0,
    v: 100
}

for (var i = 0; i < colors.length; i++) {
    var colorRGB = hexToRgb(colors[i]);
    var normColorHSV = RGBtoHSV(normRGB(colorRGB));

    var color = {
        r: colorRGB.r,
        g: colorRGB.g,
        b: colorRGB.b,
        h: Math.round(normColorHSV.h*360),
        s: Math.round(normColorHSV.s*100),
        v: Math.round(normColorHSV.v*100),
        hex: colors[i]
    }

    colorObjects.push(color);
}

function colorCurve() {
    var svg = d3.select("#colorCurve");
    var enterSelection = svg.selectAll('circle').data(colorObjects).enter()
    enterSelection.append('circle')
        .attr('cy', function(d) { return +svg.attr('height') - (d.h + 48) })
        .attr('cx', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .attr('r', 8)
        .attr('stroke', "#00BFFF")
        .attr('stroke-width', 2)
        .attr('fill', 'rgba(0,191,255,.24)')
    enterSelection.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight','bold')
        .attr('y', function(d) { return +svg.attr('height') - (d.h + 48 + 12) })
        .attr('x', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .text( function(d) { return d.h })

    enterSelection.append('circle')
        .attr('cy', function(d) { return +svg.attr('height') - (d.s + 48) })
        .attr('cx', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .attr('r', 8)
        .attr('stroke', "#EE00FF")
        .attr('stroke-width', 2)
        .attr('fill', 'rgba(238,0,255,.24)')
        .text(function(d) { return d.s });
    enterSelection.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight','bold')
        .attr('y', function(d) { return +svg.attr('height') - (d.s + 48 + 12) })
        .attr('x', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .text( function(d) { return d.s })

    enterSelection.append('circle')
        .attr('cy', function(d) { return +svg.attr('height') - (d.v + 48)})
        .attr('cx', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .attr('r', 8)
        .attr('stroke', "#FFBB00")
        .attr('stroke-width', 2)
        .attr('fill', 'rgba(255,187,0,.24)')
        .text(function(d) { return d.v });
    enterSelection.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight','bold')
        .attr('y', function(d) { return +svg.attr('height') - (d.v + 48 + 12) })
        .attr('x', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .text( function(d) { return d.v })

    enterSelection.append('circle')
        .attr('cy', +svg.attr('height') - 24)
        .attr('cx', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .attr('r', 16)
        .attr('fill', function(d) { return "#" + d.hex })

    enterSelection.append('text')
        .attr('y', +svg.attr('height') - 18)
        .attr('x', function(d,i) { return i * (+svg.attr('width') / colors.length) + 24})
        .attr('text-anchor', 'middle')
        .text(function(d) {
            var contrastVal = getColorContrastHSV(d, white);
            var floored = (contrastVal.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0]*1).toFixed(1);
            return floored})
        .attr('fill', function(d) {
            var contrastVal = getColorContrastHSV(d, white);
            if (contrastVal >= 4.5) {
                return "white"
            } else {
                return "black"
            }
        })
}
