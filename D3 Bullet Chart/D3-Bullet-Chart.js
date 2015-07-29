define( [
        './js/properties',
        'jquery',
        './js/d3.min'
        // ,'./js/bullet'
        ,'css!./stylesheet.css'
    ],
    function (props, $, d3) {//, bullet
        'use strict';

        //start bullet code

        // Chart design based on the recommendations of Stephen Few. Implementation
        // based on the work of Clint Ivy, Jamie Love, and Jason Davies.
        // http://projects.instantcognition.com/protovis/bulletchart/
        d3.bullet = function() {
          var orient = "left", // TODO top & bottom
              reverse = false,
              duration = 0,
              ranges = bulletRanges,
              markers = bulletMarkers,
              measures = bulletMeasures,
              width = 380,
              height = 30,
              tickFormat = null;

          // For each small multiple…
          function bullet(g) {
            g.each(function(d, i) {
              var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
                  markerz = markers.call(this, d, i).slice().sort(d3.descending),
                  measurez = measures.call(this, d, i).slice().sort(d3.descending),
                  g = d3.select(this);

              // Compute the new x-scale.
              var x1 = d3.scale.linear()
                  .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
                  .range(reverse ? [width, 0] : [0, width]);

              // Retrieve the old x-scale, if this is an update.
              var x0 = this.__chart__ || d3.scale.linear()
                  .domain([0, Infinity])
                  .range(x1.range());

              // Stash the new scale.
              this.__chart__ = x1;

              // Derive width-scales from the x-scales.
              var w0 = bulletWidth(x0),
                  w1 = bulletWidth(x1);

              // Update the range rects.
              var range = g.selectAll("rect.range")
                  .data(rangez);

              range.enter().append("rect")
                  .attr("class", function(d, i) { return "range s" + i; })
                  .attr("width", w0)
                  .attr("height", height)
                  .attr("x", reverse ? x0 : 0)
                .transition()
                  .duration(duration)
                  .attr("width", w1)
                  .attr("x", reverse ? x1 : 0);

              range.transition()
                  .duration(duration)
                  .attr("x", reverse ? x1 : 0)
                  .attr("width", w1)
                  .attr("height", height);

              // Update the measure rects.
              var measure = g.selectAll("rect.measure")
                  .data(measurez);

              measure.enter().append("rect")
                  .attr("class", function(d, i) { return "measure s" + i; })
                  .attr("width", w0)
                  .attr("height", height / 3)
                  .attr("x", reverse ? x0 : 0)
                  .attr("y", height / 3)
                .transition()
                  .duration(duration)
                  .attr("width", w1)
                  .attr("x", reverse ? x1 : 0);

              measure.transition()
                  .duration(duration)
                  .attr("width", w1)
                  .attr("height", height / 3)
                  .attr("x", reverse ? x1 : 0)
                  .attr("y", height / 3);

              // Update the marker lines.
              var marker = g.selectAll("line.marker")
                  .data(markerz);

              marker.enter().append("line")
                  .attr("class", "marker")
                  .attr("x1", x0)
                  .attr("x2", x0)
                  .attr("y1", height / 6)
                  .attr("y2", height * 5 / 6)
                .transition()
                  .duration(duration)
                  .attr("x1", x1)
                  .attr("x2", x1);

              marker.transition()
                  .duration(duration)
                  .attr("x1", x1)
                  .attr("x2", x1)
                  .attr("y1", height / 6)
                  .attr("y2", height * 5 / 6);

              // Compute the tick format.
              var format = tickFormat || x1.tickFormat(8);

              // Update the tick groups.
              var tick = g.selectAll("g.tick")
                  .data(x1.ticks(8), function(d) {
                    return this.textContent || format(d);
                  });

              // Initialize the ticks with the old scale, x0.
              var tickEnter = tick.enter().append("g")
                  .attr("class", "tick")
                  .attr("transform", bulletTranslate(x0))
                  .style("opacity", 1e-6);

              tickEnter.append("line")
                  .attr("y1", height)
                  .attr("y2", height * 7 / 6);

              tickEnter.append("text")
                  .attr("text-anchor", "middle")
                  .attr("dy", "1em")
                  .attr("y", height * 7 / 6)
                  .text(format);

              // Transition the entering ticks to the new scale, x1.
              tickEnter.transition()
                  .duration(duration)
                  .attr("transform", bulletTranslate(x1))
                  .style("opacity", 1);

              // Transition the updating ticks to the new scale, x1.
              var tickUpdate = tick.transition()
                  .duration(duration)
                  .attr("transform", bulletTranslate(x1))
                  .style("opacity", 1);

              tickUpdate.select("line")
                  .attr("y1", height)
                  .attr("y2", height * 7 / 6);

              tickUpdate.select("text")
                  .attr("y", height * 7 / 6);

              // Transition the exiting ticks to the new scale, x1.
              tick.exit().transition()
                  .duration(duration)
                  .attr("transform", bulletTranslate(x1))
                  .style("opacity", 1e-6)
                  .remove();
            });
            d3.timer.flush();
          }

          // left, right, top, bottom
          bullet.orient = function(x) {
            if (!arguments.length) return orient;
            orient = x;
            reverse = orient == "right" || orient == "bottom";
            return bullet;
          };

          // ranges (bad, satisfactory, good)
          bullet.ranges = function(x) {
            if (!arguments.length) return ranges;
            ranges = x;
            return bullet;
          };

          // markers (previous, goal)
          bullet.markers = function(x) {
            if (!arguments.length) return markers;
            markers = x;
            return bullet;
          };

          // measures (actual, forecast)
          bullet.measures = function(x) {
            if (!arguments.length) return measures;
            measures = x;
            return bullet;
          };

          bullet.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return bullet;
          };

          bullet.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return bullet;
          };

          bullet.tickFormat = function(x) {
            if (!arguments.length) return tickFormat;
            tickFormat = x;
            return bullet;
          };

          bullet.duration = function(x) {
            if (!arguments.length) return duration;
            duration = x;
            return bullet;
          };

          return bullet;
        };

        function bulletRanges(d) {
          return d.ranges;
        }

        function bulletMarkers(d) {
          return d.markers;
        }

        function bulletMeasures(d) {
          return d.measures;
        }

        function bulletTranslate(x) {
          return function(d) {
            return "translate(" + x(d) + ",0)";
          };
        }

        function bulletWidth(x) {
          var x0 = x(0);
          return function(d) {
            return Math.abs(x(d) - x0);
          };
        }
  //end bullet code

        return {
            definition: props,
            initialProperties: {
                    qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [
                        {
                            qWidth: 10,
                            qHeight: 100
                        }
                    ]
                }
            },
            paint: function ( $element, layout ) {


                var hc = layout.qHyperCube;
          //------code to be used in creating cleaned hypercube array later
                console.log("hc:", hc);

                var hcData = [];

                var numMeasures = hc.qMeasureInfo.length,
                    numDims     = hc.qDimensionInfo.length,
                    dataPages  = hc.qDataPages[0].qMatrix;

                //Array creation
                //Check the number of measures
                if (numMeasures=2) {

                  //Check the number of dimensions
                  if (numDims!=0) {

                    for (var r = 0; r < dataPages.length; r++) {
                      
                      hcData.push({ "title"   : dataPages[r][0].qText,
                                    "markers" : [Number(dataPages[r][1].qText.replace(",",""))],
                                    "measures": [Number(dataPages[r][2].qText.replace(",",""))],
                                    "ranges"  : [Number(dataPages[r][3].qText.replace(",",""))*.5,
                                                  Number(dataPages[r][3].qText.replace(",",""))*.75,
                                                  Number(dataPages[r][3].qText.replace(",",""))]
                                  });

                    }
                  }
                }

                    console.log('hcData: ',hcData);

                var margin = {top: 5, right: 20, bottom: 20, left: 40};

                // Chart object width
                var width = $element.width() - margin.left - margin.right;

                // Chart object height
                var height = $element.height()/hcData.length - margin.top - margin.bottom - 10;//subtract 10 for bottom margin clipping

                // Chart object id
                var id = "container_" + layout.qInfo.qId;

                // Check to see if the chart element has already been created
                if (document.getElementById(id)) {
                    // if it has been created, empty it's contents so we can redraw it
                    $("#" + id).empty();
                }
                else {
                    // if it hasn't been created, create it with the appropiate id and size
                    $element.append($('<div />').attr("id", id).attr("class","divbullet").width(width).height(height));
                }

  
                var chart = d3.bullet()
                    .width(width)
                    .height(height);

            //----------need to replace datavar with hypercube data
                var svg = d3.select("#" + id).selectAll("svg")
                  .data(hcData)
                .enter().append("svg")
                  .attr("class", "bullet")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                  .call(chart);

                var title = svg.append("g")
                  .style("text-anchor", "end")
                  .attr("transform", "translate(-6," + height / 2 + ")");

                title.append("text")
                  .attr("class", "title")
                  .text(function(d) { return d.title; });

                // title.append("text")
                //   .attr("class", "subtitle")
                //   .attr("dy", "1em")
                //   .text(function(d) { return d.subtitle; });

            }
        };
    } );