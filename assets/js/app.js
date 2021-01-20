// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

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
    .domain([d3.min(myData, d => d.poverty)*.9,
      d3.max(myData, d => d.poverty)
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
    data.healthcare = +data.healthcare;
    // data.num_albums = +data.num_albums;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(myData);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(myData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append circles
  chartGroup.selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15);


  chartGroup.selectAll(".stateText")
    .data(myData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare) + 7)
    .classed("stateText", true);


 

  // Create group for x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    //.classed("active", true)
    .text("Poverty (%)");



  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("healthcare (%)");

  
}).catch(function(error) {
  console.log(error);
});
