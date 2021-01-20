// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// function used for updating x-scale var upon click on axis label
function xScale(myData) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(myData, d => d.poverty) * 0.8,
      d3.max(myData, d => d.poverty) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(myData, err) {
  if (err) throw err;

  // parse data
  myData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    // data.num_albums = +data.num_albums;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(myData);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(myData, d => d.obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var xLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .classed("active", true)
    .text("Poverty (%)");



  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity (%)");

  
}).catch(function(error) {
  console.log(error);
});
