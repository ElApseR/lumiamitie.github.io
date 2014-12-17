var test_node = []
var test_link = []

var node_size = d3.scale.linear()
					.range([6,18]);
					
var node_color = d3.scale.category10();

var node_distance = d3.scale.linear()
								.range([10, 250]);

var link_opacity = d3.scale.linear()
							.range([0.1, 1]);
							
d3.json("data/topicmodeling2.json",function(data){

	var links = data.edge;
	var nodes = data.node;
	test_node = nodes;
	test_link = links;
	
	node_distance.domain(d3.extent(nodes, function(d){console.log(d);return d.prob}));
	
	var width = 1000,
		height = 700;
		
	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([width, height])
		.linkDistance(110)
		.friction(0.5)
		.charge(-800)
		.gravity(0.2)
		.on("tick", tick)
		.start();
		
	var svg = d3.select("div").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	link_opacity.domain(d3.extent(test_link, function(d){return d.lift}));
	
	var link = svg.selectAll(".link")
		.data(force.links())
	  .enter().append("line")
		.attr("class", "link");
		
	link.style("opacity", function(d){return link_opacity(d.lift)});
		
	var node = svg.selectAll(".node")
		.data(force.nodes())
	  .enter().append("g")
		.attr("class", "node")
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.call(force.drag);
		
	node_size.domain([d3.min(nodes, function(d){return d.prob}), 
					  d3.max(nodes, function(d){return d.prob})]);
	
	node.append("circle")
		.attr("r", function(d){return node_size(d.prob);})
		.style("fill",function(d){return node_color(d.cluster);});
		
	node.append("text")
		.attr("x", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; });
		
	function tick() {
	  link
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });
	  node
		  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	
	function mouseover() {
	  d3.select(this).select("circle").transition()
		  .duration(750)
		  .attr("r", function(d){return 1.5 * node_size(d.prob)});
	}
	
	function mouseout() {
	  d3.select(this).select("circle").transition()
		  .duration(750)
		  .attr("r", function(d){return node_size(d.prob)});
	}
});