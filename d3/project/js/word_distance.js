var margin = {top: 20, right: 15, bottom: 60, left: 60}
  , width = 960 - margin.left - margin.right
  , height = 500 - margin.top - margin.bottom;



var chart = d3.select('div')
					.append('svg:svg')
					.attr('width', width + margin.right + margin.left)
					.attr('height', height + margin.top + margin.bottom)
					.attr('class', 'chart')
var main = chart.append('g')
						.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
						.attr('width', width)
						.attr('height', height)
						.attr('class', 'main')   
	
var color = d3.scale.category20();


d3.json("data/distance.json", function(data){
	var x = d3.scale.linear()
						  .domain([0.8 * d3.min(data, function(d) { return d.x; }), 
									1.1 * d3.max(data, function(d) { return d.x; })])
						  .range([ 0, width ]);

	var y = d3.scale.linear()
						  .domain([0.8 * d3.min(data, function(d) { return d.y; }), 
									1.1 *d3.max(data, function(d) { return d.y; })])
						  .range([ height, 0 ]);
			  
	var z = d3.scale.linear()
							.domain([d3.min(data, function(d) {return d.score; }), 
									d3.max(data, function(d) {return d.score; })])
							.range([20, 40])
	
	// draw the x axis					
	var xAxis = d3.svg.axis()
						.scale(x)
						.orient('bottom')
						.innerTickSize(-height)
						.outerTickSize(0)
						.tickPadding(10);
	main.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'main axis date')
			.call(xAxis);
		
	// draw the y axis
	var yAxis = d3.svg.axis()
						.scale(y)
						.orient('left')
						.innerTickSize(-width)
						.outerTickSize(0)
						.tickPadding(10);;
	main.append('g')
			.attr('transform', 'translate(0,0)')
			.attr('class', 'main axis date')
			.call(yAxis);		
	
	
	var g = main.append("svg:g"); 
	
	g.selectAll(".scatter-dots")
	  .data(data)
	  .enter().append("svg:circle")
		  .attr("cx", function (d,i) { return x(d.x); } )
		  .attr("cy", function (d) { return y(d.y); } )
		  .attr("r", function (d) { return z(d.score); })
		  .attr("fill", function(d){return color(d.word)})
		  .attr("class", "scatter-dots");
	
	//Label    
	g.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.text(function(d) {return d.word;})
		.attr("x", function(d,i) {return x(d.x);})
		.attr("y", function(d,i) {return y(d.y);})
		.attr("fill",'black')
		.attr("class","label")
		.attr("text-anchor","middle");
	
});