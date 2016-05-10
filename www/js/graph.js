var showCirclePacking = function(data) {
  var diameter = 960,
      format = d3.format(",d");

  var pack = d3.layout.pack()
      .size([diameter - 4, diameter - 4])
      .value(function(d) { return d.size; });

  $('#circlePacking').empty();
  var svg = d3.select("#circlePacking").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(2,2)");

  var node = svg.datum(data).selectAll(".node")
      .data(pack.nodes)
    .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.name; });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", "#eee");

  var images = node.filter(function(d) { return !d.children; }).append("svg:image")
      .attr("xlink:href",  function(d) { return d.photo_200_orig;})
      .attr("x", function(d) { return -16;})
      .attr("y", function(d) { return -16;})
      .attr("height", 32)
      .attr("width", 32);
  
  // make the image grow a little on mouse over and add the text details on click
  var setEvents = images
          .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("xlink:href",  function(d) { return d.photo_200_orig;})
              .attr("x", function(d) { return -128;})
              .attr("y", function(d) { return -128;})
              .attr("height", 256)
              .attr("width", 256)
              .style("z-index", 10);
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()              
              .attr("xlink:href",  function(d) { return d.photo_200_orig;})
              .attr("x", function(d) { return -16;})
              .attr("y", function(d) { return -16;})
              .attr("height", 32)
              .attr("width", 32)
              .style("z-index", 1);
          });

  d3.select(self.frameElement).style("height", diameter + "px");
}; 

