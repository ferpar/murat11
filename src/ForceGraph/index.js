import React, { useRef, useEffect } from "react";
import { 
  select, 
  hierarchy, 
  forceSimulation,
  forceCenter, 
  forceManyBody,
  forceCollide,
  pointer,
  forceX,
  forceY
} from "d3";
import useResizeObserver from "../ResizeObserver";

function ForceGraph({data}) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  
  // will be called initially and on every data change
  useEffect( () => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    //d3 util to work with hierarchical data
    const root = hierarchy(data);
    const nodeData = root.descendants();
    const linkData = root.links();

    const simulation = forceSimulation(nodeData)
      .force("center", forceCenter( dimensions.width/2, dimensions.height/2))
      .force("charge", forceManyBody().strength(-30))
      .force("collide", forceCollide(30))
      .on('tick', () => {
        //console.log("current force", simulation.alpha())
        // render our nodes, links...
        // links
        svg
          .selectAll(".link")
          .data(linkData)
          .join("line")
          .attr("class", "link")
          .attr("stroke", "black")
          .attr("fille", "none")
          .attr("x1", link => link.source.x)
          .attr("y1", link => link.source.y)
          .attr("x2", link => link.target.x)
          .attr("y2", link => link.target.y)

        //nodes
        svg
          .selectAll(".node")
          .data(nodeData)
          .join("circle")
          .attr("class", "node")
          .attr("r", 4)
          .attr("cx", node => node.x)
          .attr("cy", node => node.y)

        //labes
        svg
          .selectAll(".label")
          .data(nodeData) 
          .join("text")
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .attr("font-size", 20)
          .attr("x", node => node.x)
          .attr("y", node => node.y - 6)
          .text(node => node.data.name)
    });

    svg
      .on("mousemove", (event) => {
        const [x, y] = pointer(event);
        simulation
          .force(
            "x", 
            forceX(x).strength(node => 0.2 + 0.15 * node.depth)
          )
          .force(
            "y", 
            forceY(y).strength(node => 0.2 + 0.15 * node.depth)
          )
      });

    svg
      .on("click", (event) => {
        const [x, y] = pointer(event);
        simulation
          .alpha(0.5)
          .restart();
      });

  }, [data, dimensions])
  return (
    <div className="graph-wrapper" ref={wrapperRef} style={{ marginBottom: "2rem"}}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default ForceGraph;