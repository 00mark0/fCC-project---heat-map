const width = 800;
const height = 600;

// Fetch the data
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then((data) => {
    // Parse the data
    const dataset = data.monthlyVariance;
    const baseTemp = data.baseTemperature;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, (d) => d.year))
      .range([0, width]);

    const yScale = d3
      .scaleTime()
      .domain([new Date(0, 11, 0, 0, 0, 0), new Date(0, 0, 0, 0, 0, 0)]) // Reverse the domain
      .range([0, height]);

    const colorScale = d3
      .scaleQuantize()
      .domain(d3.extent(dataset, (d) => baseTemp + d.variance))
      .range([
        "#313695",
        "#4575b4",
        "#74add1",
        "#abd9e9",
        "#e0f3f8",
        "#ffffbf",
        "#fee090",
        "#fdae61",
        "#f46d43",
        "#d73027",
        "#a50026",
      ]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    // Append axes to SVG
    d3.select("#heatmap")
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    d3.select("#heatmap").append("g").attr("id", "y-axis").call(yAxis);

    // Create cells for heat map and append to SVG
    d3.select("#heatmap")
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => baseTemp + d.variance)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0)))
      .attr("width", 1)
      .attr(
        "height",
        yScale(new Date(0, 0, 0, 0, 0, 0)) - yScale(new Date(0, 1, 0, 0, 0, 0)) // Reverse the order of the dates
      )
      .attr("fill", (d) => colorScale(baseTemp + d.variance))
      .on("mouseover", (d) => {
        // Show tooltip with more information
        d3.select("#tooltip")
          .style("opacity", 1)
          .attr("data-year", d.year)
          .html(
            "Year: " +
              d.year +
              "<br>Month: " +
              d.month +
              "<br>Temperature: " +
              (baseTemp + d.variance).toFixed(1) +
              "℃"
          );
      })
      .on("mouseout", (d) => {
        // Hide tooltip
        d3.select("#tooltip").style("opacity", 0);
      });

    // Create legend and append to SVG
    const legend = d3
      .select("#legend")
      .selectAll("rect")
      .data(colorScale.range())
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 30)
      .attr("width", 30)
      .attr("height", 10)
      .attr("fill", (d) => d);
  });
