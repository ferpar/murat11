import React, { useRef, useEffect } from "react";
import { 
  select, 
  axisBottom, 
  axisRight,
  scaleLinear,
  scaleBand
} from "d3";
import useResizeObserver from "../ResizeObserver";


const BarChart = ({data}) => {

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions)

    if (!dimensions) return;

    const xScale = scaleBand()
      .domain(data.map( (val, idx) => idx))
      .range([0, dimensions.width])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)*1.2])
      .range([dimensions.height, 0]);

    const colorScale = scaleLinear()
      .domain([75, 150, dimensions.height])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat( idx => idx + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisRight(yScale).ticks(5);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);      

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("index", (value, index) => index)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (event, value) => {
        const index = event.target.attributes.index.value;
        svg
          .selectAll(".tooltip")
          .data([value])
          .join( enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth()/2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1)
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => dimensions.height - yScale(value));

    }, [data, dimensions]);
  
  return (
    data ?
    <div ref={wrapperRef} style={{marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
    
    :
    <h4>No Data</h4>
  )
};

export default BarChart;