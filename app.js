var toMinutes = function(time) {
  var splitTime = time.split(/:/);
  return (parseInt(splitTime[0]) * 60) + parseInt(splitTime[1]);
}
var margin = { left: 40, right: 20, top: 20, bottom: 20};
var width=800 - margin.left - margin.right;
var height=400 - margin.top - margin.bottom;

var svg = d3.select('body').append('svg')
.attr('class', 'chart')
.attr('width', width + margin.left + margin.right)
.attr('height',height + margin.top + margin.bottom)
.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.linear()
    .domain([ 0, 250 ])
    .range([ 0, width ]);

    var y = d3.scale.linear()
    .domain([0, 130])
    .range([height, 0 ]);

    var formatCount = d3.format(",.0f");
    var formatTime = d3.time.format("%H:%M");
    var formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

    var  generate = function(fileName) { d3.csv(fileName, redraw); }
    var redraw = function(data) {

      var data = data.map(function(x) { return toMinutes(x.time); });
      data = d3.layout.histogram().bins(x.ticks(20))(data);

      var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y })])
        .range([height, 0 ]);

      var bar = svg.selectAll('.bar').data(data)
        .transition()
        .duration(2000)
        .attr('transform', function(d) { return 'translate(' + x(d.x) + ',' + y(d.y) + ')'; });

            var rect = svg.selectAll('.bar rect')
            .data(data)
            .transition()
            .duration(2000)
            .attr('fill', function(d) { return '#'+Math.floor(Math.random()*16777215).toString(16); })
            .attr('height', function(d) { return height - y(d.y); });


            var text = svg.selectAll('.bar text')
            .data(data)
            .text(function(d) { return formatCount(d.y); });


            svg.selectAll('.y.axis')
            .call(d3.svg.axis()
              .scale(y)
              .orient('left'));
            }

var draw = function(data) {
  var data = data.map(function(x) { return toMinutes(x.time); });
  data = d3.layout.histogram().bins(x.ticks(20))(data);
  //bars
  var bar = svg.selectAll('.bar').data(data);

  bar.enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function(d) { return 'translate(' + x(d.x) + ',' + y(d.y) + ')'; });

        bar.append('rect')
        .attr('x', 1)
        .attr('height', function(d) { return height - y(d.y); })
        .attr('fill', 'steelblue')
        .attr('width', x(data[0].dx) - 1);

        bar.append('text')
        .attr('dy', '.75em')
        .attr('y', 6)
        .attr('x', x(data[0].dx) / 2)
        .attr('text-anchor', 'middle')
        .text(function(d) { return formatCount(d.y); });

        //axis
        svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
          .call(d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat(formatMinutes));

          svg.append('g')
          .attr('class', 'y axis')
          .call(d3.svg.axis()
            .scale(y)
            .orient('left'));
          }
          d3.csv('2012-deva-triathlon-july-1.csv', draw);

