d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then(function (data) {
  const dataset = data.monthlyVariance;
  const svg = d3.select("#heatmap");
  const width = 800;
  const height = 600;
  const padding = 60;

  svg.attr("width", width).attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(0, d.month - 1, 1)),
      d3.max(dataset, (d) => new Date(0, d.month - 1, 1)),
    ])
    .range([padding, height - padding]);

  const colorScale = d3
    .scaleQuantize()
    .domain([
      d3.min(dataset, (d) => d.variance),
      d3.max(dataset, (d) => d.variance),
    ])
    .range([
      "#053061",
      "#2166ac",
      "#4393c3",
      "#92c5de",
      "#d1e5f0",
      "#fddbc7",
      "#f4a582",
      "#d6604d",
      "#b2182b",
      "#67001f",
    ]);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 1)))
    .attr("width", 4)
    .attr("height", (height - 2 * padding) / 12)
    .attr("fill", (d) => colorScale(d.variance))
    .on("mouseover", function (d) {
      d3.select("#tooltip")
        .style("visibility", "visible")
        .style("left", d3.event.pageX + "px") // Set the x position of the tooltip
        .style("top", d3.event.pageY + "px") // Set the y position of the tooltip
        .text(`Year: ${d.year}, Temp: ${data.baseTemperature + d.variance}℃`)
        .attr("data-year", d.year); // Set the data-year attribute of the tooltip
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("visibility", "hidden"); // Hide the tooltip
    });

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  let legend = svg.append("g").attr("id", "legend");

  // Define the colors for the legend
  let legendColors = [
    "#053061",
    "#2166ac",
    "#4393c3",
    "#92c5de",
    "#d1e5f0",
    "#fddbc7",
    "#f4a582",
    "#d6604d",
    "#b2182b",
    "#67001f",
  ];

  // Define the scale for the legend
  let legendScale = d3
    .scaleQuantize()
    .domain([
      d3.min(dataset, (d) => d.variance),
      d3.max(dataset, (d) => d.variance),
    ])
    .range(legendColors);

  // Create the rectangles for the legend
  legend
    .selectAll("rect")
    .data(legendColors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => padding + i * 30)
    .attr("y", height - padding / 2)
    .attr("width", 30)
    .attr("height", 15)
    .attr("fill", (d) => d);

  // Add the legend scale
  let legendAxisScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.variance),
      d3.max(dataset, (d) => d.variance),
    ])
    .range([padding, padding + legendColors.length * 30]);

  legend
    .append("g")
    .attr("transform", "translate(0," + (height - padding / 2 + 15) + ")")
    .call(d3.axisBottom(legendAxisScale));
});
