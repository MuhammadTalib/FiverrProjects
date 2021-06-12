
data =  [
    {          
        "color": "#666888",
        "nodeData": {
            "age": "<5",
            "population": 60
        },
        "subData": [{
            "nodeData": {
                "age": "<5",
                "population": 60
            },
            "subData": [{
                "nodeData": {
                    "age": "<5",
                    "population": 60
                }
            }]
        }]
    }, 
    {          
        "color": "#222222",
        "nodeData": {
            "age": "5-35",
            "population": 100
        },
        "subData": [{
            "nodeData": {
                "age": "5-15",
                "population": 60
            },
            "subData": [{
                "nodeData": {
                    "age": "5-10",
                    "population": 30
                }
            }, {
                "nodeData": {
                    "age": "10-15",
                    "population": 30
                }
            }]
        }, {          "color": "#6CC4A4",

            "nodeData": {
                "age": "15-35",
                "population": 40
            },
            "subData": [{
                "nodeData": {
                    "age": "15-25",
                    "population": 25
                }
            }, {
                "nodeData": {
                    "age": "25-35",
                    "population": 15
                }
            }]
        }]
    }, 
    {          
        "color": "#AAAAAA",
        "nodeData": {
            "age": "35-65",
            "population": 30
        },
        "subData": [{
            "nodeData": {
                "age": "35-50",
                "population": 75
            },
            "subData": [{
                "nodeData": {
                    "age": "35-50",
                    "population": 75
                }
            }]
        }, {
            "nodeData": {
                "age": "50-65",
                "population": 25
            },
            "subData": [{
                "nodeData": {
                    "age": "50-65",
                    "population": 25
                }
            }]
        }]
    }, 
    {          
        "color": "#7AC4d4",
        "nodeData": {
            "age": ">65",
            "population": 40
        },
        "subData": [{
            "nodeData": {
                "age": "65-75",
                "population": 60
            },
            "subData": [{
                "nodeData": {
                    "age": "65-75",
                    "population": 60
                }
            }]
            }, {
            "nodeData": {
                "age": ">75",
                "population": 40
            },
            "subData": [{
                "nodeData": {
                    "age": ">75",
                    "population": 40
                }
            }]
            }
        ]
    }
]  



var width = 300,
    height = 250,
    maxRadius = Math.min(width, height) / 2;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");




var multiLevelData = [];
var setMultiLevelData = function(data) {
    if (data == null)
        return;
    var level = data.length,
        counter = 0,
        index = 0,
        currentLevelData = [],
        queue = [];
    for (var i = 0; i < data.length; i++) {
        queue.push(data[i]);
    };

    while (!queue.length == 0) {
        var node = queue.shift();
        currentLevelData.push(node);
        level--;

        if (node.subData) {
            for (var i = 0; i < node.subData.length; i++) {
                queue.push(node.subData[i]);
                counter++;
            };
        }
        if (level == 0) {
            level = counter;
            counter = 0;            
            multiLevelData.push(currentLevelData);
            currentLevelData = [];
        }
    }
}

let drawPieChart = function(_data, index) {

    let pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.nodeData.population;
    });

    let arc = d3.svg.arc()
    .outerRadius((index + 1) * pieWidth - 1)
    .innerRadius(index * pieWidth);

    let g = svg.selectAll(".arc" + index).data(pie(_data)).enter().append("g")
    .attr("class", "arc" + index);

    g.append("path").attr("d", arc)
    .style("fill", function(d) {
        return color(d.data.nodeData.age);
    });

    g.append("text").attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", ".35em").style("text-anchor", "middle")
    .text(function(d) {
        return d.data.nodeData.age;
    });
}

const drawBarPlot= function(_data, index) {
    // var width = 500,
    // height = 500,
    // radius = Math.min(width, height),
    // innerRadius = 0.3 * radius;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.nodeData.population;  });

    var arc = d3.svg.arc().outerRadius(function (d) {
        console.log("dd",d.data.nodeData.population/((index + 1) * pieWidth - 1)) 
        return ((d.data.nodeData.population))+(index * pieWidth); 
      }
        // (index + 1) * pieWidth - 1
    )
    .innerRadius(index * pieWidth+10);

    var outlineArc = d3.svg.arc().outerRadius((index + 1) * pieWidth - 1)
    .innerRadius(index * pieWidth+10);

    var path = svg.selectAll(".solidArc" + index)
    .data(pie(_data))
    .enter().append("path")
    .attr("fill", function(d) { return d.data.color; })
    .attr("class", "solidArc" )
    .attr("stroke", "gray")
    .attr("d", arc)

    var outerPath = svg.selectAll(".outlineArc"+ index)
    .data(pie(_data))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("class", "outlineArc")
    .attr("d", outlineArc);  

    path.append("path").attr("d", arc)
    .style("fill", function(d) {
        return color(d.data.nodeData.age);
    });

    path.append("text").attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", ".35em").style("text-anchor", "middle")
    .text(function(d) {
        return d.data.nodeData.age;
    });

    // let g = svg.selectAll(".arc" + index).data(pie(_data)).enter().append("g")
    // .attr("class", "arc" + index);

    // g.append("path").attr("d", arc)
    // .style("fill", function(d) {
    //     return color(d.data.nodeData.age);
    // });

    // g.append("text").attr("transform", function(d) {
    //     return "translate(" + arc.centroid(d) + ")";
    // })
    // .attr("dy", ".35em").style("text-anchor", "middle")
    // .text(function(d) {
    //     return d.data.nodeData.age;
    // });

    // let pie = d3.layout.pie()
    // .sort(null)
    // .value(function(d) {
    //     return d.nodeData.population;
    // });

    // let arc = d3.svg.arc()
    // .outerRadius((index + 1) * pieWidth - 1)
    // .innerRadius(index * pieWidth);

    // let g = svg.selectAll(".solidArc" + index).data(pie(_data)).enter().append("g")
    // .attr("class", "arc" + index);

    // g.append("path").attr("d", arc)
    // .style("fill", function(d) {
    //     return color(d.data.nodeData.age);
    // });

    // g.append("text").attr("transform", function(d) {
    //     return "translate(" + arc.centroid(d) + ")";
    // })
    // .attr("dy", ".35em").style("text-anchor", "middle")
    // .text(function(d) {
    //     return d.data.nodeData.age;
    // });
}


setMultiLevelData(data);

let pieWidth = parseInt(maxRadius / multiLevelData.length) - multiLevelData.length;

let color = d3.scale.category20();

for (let i = 0; i < multiLevelData.length; i++) {
    let _cData = multiLevelData[i];
    // if(i!==0) drawPieChart(_cData, i);
    // else 
    if(i==0) drawBarPlot(_cData, i)
}