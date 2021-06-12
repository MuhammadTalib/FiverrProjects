var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.call(tip);

d3.csv('aster_data.csv', function(error, data) {
    console.log("data",data)
    data=[
        {
          "id": "FIS",
          "order": 1.1,
          "score": 59,
          "weight": 0.5,
          "color": "#9E0041",
          "label": "Fisheries"
        },
        {
          "id": "MAR",
          "order": 1.3,
          "score": 24,
          "weight": 0.5,
          "color": "#C32F4B",
          "label": "Mariculture"
        },
        {
          "id": "AO",
          "order": 2,
          "score": 98,
          "weight": 1,
          "color": "#E1514B",
          "label": "Artisanal Fishing Opportunities"
        },
        {
          "id": "NP",
          "order": 3,
          "score": 60,
          "weight": 1,
          "color": "#F47245",
          "label": "Natural Products"
        },
        {
          "id": "CS",
          "order": 4,
          "score": 74,
          "weight": 1,
          "color": "#FB9F59",
          "label": "Carbon Storage"
        },
        {
          "id": "CP",
          "order": 5,
          "score": 70,
          "weight": 1,
          "color": "#FEC574",
          "label": "Coastal Protection"
        },
        {
          "id": "TR",
          "order": 6,
          "score": 42,
          "weight": 1,
          "color": "#FAE38C",
          "label": "Tourism &  Recreation"
        },
        {
          "id": "LIV",
          "order": 7.1,
          "score": 77,
          "weight": 0.5,
          "color": "#EAF195",
          "label": "Livelihoods"
        },
        {
          "id": "ECO",
          "order": 7.3,
          "score": 88,
          "weight": 0.5,
          "color": "#C7E89E",
          "label": "Economies"
        },
        {
          "id": "ICO",
          "order": 8.1,
          "score": 60,
          "weight": 0.5,
          "color": "#9CD6A4",
          "label": "Iconic Species"
        },
        {
          "id": "LSP",
          "order": 8.3,
          "score": 65,
          "weight": 0.5,
          "color": "#6CC4A4",
          "label": "Lasting Special Places"
        },
        {
          "id": "CW",
          "order": 9,
          "score": 71,
          "weight": 1,
          "color": "#4D9DB4",
          "label": "Clean Waters"
        },
        {
          "id": "HAB",
          "order": 10.1,
          "score": 88,
          "weight": 0.5,
          "color": "#4776B4",
          "label": "Habitats"
        },
        {
          "id": "SPP",
          "order": 10.3,
          "score": 83,
          "weight": 0.5,
          "color": "#5E4EA1",
          "label": "Species"
        }
    ]
    data.forEach(function(d) {
        d.id     =  d.id;
        d.order  = +d.order;
        d.color  =  d.color;
        d.weight = +d.weight;
        d.score  = +d.score;
        d.width  = +d.weight;
        d.label  =  d.label;
    });
  
    var path = svg.selectAll(".solidArc")
    .data(pie(data))
    .enter().append("path")
    .attr("fill", function(d) { return d.data.color; })
    .attr("class", "solidArc")
    .attr("stroke", "gray")
    .attr("d", arc)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

    var outerPath = svg.selectAll(".outlineArc")
    .data(pie(data))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("class", "outlineArc")
    .attr("d", outlineArc);  


//   var score = 
//     data.reduce(function(a, b) {
//       return a + (b.score * b.weight); 
//     }, 0) / 
//     data.reduce(function(a, b) { 
//       return a + b.weight; 
//     }, 0);

//   svg.append("svg:text")
//     .attr("class", "aster-score")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "middle")
//     .text(Math.round(score));

});