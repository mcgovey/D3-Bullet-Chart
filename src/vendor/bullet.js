import * as d3 from "d3";

export default function bullet () {
  var orient = "left", // TODO top & bottom
    reverse = false,
    duration = 0,
    ranges = bulletRanges,
    markers = bulletMarkers,
    measures = bulletMeasures,
    measureHeight = bulletMeasureHeight,
    maxRange = getRangeMax,
    width = 380,
    height = 30,
    maxTickHeight;
  // For each small multiple…
  function bullet(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
        markerz = markers.call(this, d, i).slice().sort(d3.descending),
        measurez = measures.call(this, d, i).slice().sort(d3.descending),
        measureHeightz = measureHeight.call(this, d, i).slice().sort(d3.descending),
        rangeMax = maxRange.call(this, d, i).slice().sort(d3.descending),
        g = d3.select(this);

      //set the x-axis scale based on the menu setting for universal vs independent
      var usedRangeMax = rangeMax[0] == 0 ? [1] : rangeMax;
      // Compute the new x-scale.
      var x1 = d3.scale.linear()
        .domain([0, usedRangeMax])
        .range(reverse ? [width, 0] : [0, width]);

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

      // The min x-position of the rects. Using a negative value to move the rect slightly to the
      // left to make it "fill" the area of the "tick".
      var minRectX = -1;

      range.enter().append("rect")
        .attr("class", function(d, i) { return "range s" + i; })
        .attr("width", w0)
        .attr("height", height)
        .attr("x", reverse ? x0 : minRectX)
        .transition()
        .duration(duration)
        .attr("width", w1)
        .attr("x", reverse ? x1 : minRectX);

      range.transition()
        .duration(duration)
        .attr("x", reverse ? x1 : minRectX)
        .attr("width", w1)
        .attr("height", height);

      // Update the measure rects.
      var measure = g.selectAll("rect.measure")
        .data(measurez);

      measure.enter().append("rect")
        .attr("class", function(d, i) { return "measure s" + i; })
        .attr("width", w0)
        .attr("height", height * measureHeightz[0] * .01)
        .attr("x", reverse ? x0 : minRectX)
        .attr("y", height * (100-measureHeightz[0]) * .005)
        .transition()
        .duration(duration)
        .attr("width", w1)
        .attr("x", reverse ? x1 : minRectX);

      measure.transition()
        .duration(duration)
        .attr("width", w1)
        .attr("height", height * measureHeightz[0] * .01)
        .attr("x", reverse ? x1 : minRectX)
        .attr("y", height * (100-measureHeightz[0]) * .005);//use user defined measure height divided by two for y positioning

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
      var format = getTickFormat(d);

      // Ensure max tick height is less than 11
      if ((height*1.05)>11) {
        maxTickHeight = 11;
      }
      else {
        maxTickHeight = height*1.05;
      }

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
        .attr("y2", height+maxTickHeight);
      tickEnter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .attr("y", height+maxTickHeight)
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
        .attr("y2", height+maxTickHeight);

      tickUpdate.select("text")
        .attr("y", height+maxTickHeight);

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

  bullet.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
}

function bulletMeasureHeight(d){
  return d.measureBarHeight;
}

function getRangeMax (d){
  return d.rangeMax;
}

function bulletRanges(d) {
  return d.ranges;
}

function bulletMarkers(d) {
  return d.markers;
}

function bulletMeasures(d) {
  return d.measures;
}

function getTickFormat(d) {
  if (d.tickFormat) {
    var tickFormat = d.tickFormat[0];
    switch (tickFormat['type']) {
      case 'F':
        if (tickFormat['extChar'] === '%') {
          return function(d) { return d3.format(`,.${tickFormat['decCount']}%`)(d); };
        }
        return function(d) { return d3.format(`,.${tickFormat['decCount']}f`)(d); };
      case 'M':
        return function(d) { return "$" + d3.format(`,.${tickFormat['decCount']}f`)(d); };
      case 'R':
        return function(d) { return d3.format(`,.${tickFormat['decCount']}f`)(d); };
      case 'D':
        return function(d) {
          // 0 is 1899-12-30 (Copying Qlik-Client behavior)
          var date = new Date(1899, 11, 30 + Math.floor(d), 0, 0, 24 * 60 * 60 * (d - Math.floor(d)));
          return d3.time.format(tickFormat['timeFormat'])(date);
        };
      case 'IV':
        return function(d) {
          // Integers represents days
          var millis = d * 86400000;
          var result = tickFormat['timeFormat'];
          var match = null;
          if (match = /D{1,2}|d{1,2}/.exec(result)) {
            var days = Math.floor(millis / 86400000);
            var daysString = match[0].length > 1 && days < 10 ? '0' + days : '' + days;
            result = result.replace(/D{1,2}|d{1,2}/gi, daysString);
            millis -= days * 86400000;
          }
          if (match = /h{1,2}/.exec(result)) {
            var hours = Math.floor(millis / 3600000);
            var hoursString = match[0].length > 1 && hours < 10 ? '0' + hours : '' + hours;
            result = result.replace(/h{1,2}/gi, hoursString);
            millis -= hours * 3600000;
          }
          if (match = /m{1,2}/.exec(result)) {
            var minutes = Math.floor(millis / 60000);
            var minutesString = match[0].length > 1 && minutes < 10 ? '0' + minutes : '' + minutes;
            result = result.replace(/m{1,2}/gi, minutesString);
            millis -= minutes * 60000;
          }
          if (match = /s{1,2}/.exec(result)) {
            var seconds = Math.floor(millis / 1000);
            var secondsString = match[0].length > 1 && seconds < 10 ? '0' + seconds : '' + seconds;
            result = result.replace(/s{1,2}/gi, secondsString);
            millis -= seconds * 1000;
          }
          if (match = /f{1,3}/.exec(result)) {
            var millisString = match[0].length > 2 && millis < 100 ? '0' : '';
            millisString += match[0].length > 1 && millis < 10 ? '0' : '';
            millisString += millis;
            result = result.replace(/f{1,3}/gi, millisString);
          }
          return result;
        };
    }
  }

  return function(d) { return d3.format(",.g")(d); };
}

function bulletTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function bulletWidth(x) {
  var x0 = x(0);
  return function(d) {
    // 2 is minWidth and also to make the rect "fill" the first and last "ticks"
    return Math.abs(x(d) - x0) + 2;
  };
}
