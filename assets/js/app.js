// @TODO: YOUR CODE HERE!
var svgWidth = 700;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 60,
  bottom: 70,
  left: 80
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

// Import data from the CSV file
var csvFile = "assets/data/data.csv"
d3.csv(csvFile)
  .then(function(newsData) {

    // Parse Data/Cast as numbers
    newsData.forEach(function(data) {
      data.poverty = +data.poverty
      data.healthcare = +data.healthcare;
    });

    // Creating scale functions
    var xLinearScale= d3.scaleLinear()
      .domain([8.1, d3.max(newsData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4.1, d3.max(newsData, d => d.healthcare)])
      .range([height, 0]);

    // Creating axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Appending Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    
    chartGroup.append("g")
      .call(yAxis);

    // Creating Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("stroke-width", "1")
      .attr("stroke", "gray");

    // Adding State Abbreviation Text to the Circles
    chartGroup.selectAll()
      .data(newsData)
      .enter()
      .append("text")
      .text(d => (d.abbr))
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare)+4)
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style("font-weight", "700")
      .style('fill', 'white');

    // Initialize tool tip
    var tooltip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // Creating tooltip in the chart
    chartGroup.call(tooltip);

    // Creating event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(d) {
      tooltip.show(d, this);
    })
      .on("mouseout", function(d) {
        tooltip.hide(d);
      });

    // Creating axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)")
      .style("font-weight", "500");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.2}, ${height + margin.top - 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .style("font-weight", "500");
  });
