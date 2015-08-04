requirejs.config({
    shim: {
      //Load d3 library before bullet.js
      //Only seems to work when extension name is hard coded
        "extensions/D3-Bullet-Chart/js/bullet": ["extensions/D3-Bullet-Chart/js/d3.min"]
    }
});

define( [
        './js/properties'
        ,'jquery'
        ,'./js/bullet'
        ,'css!./stylesheet.css'
    ],
    function (props, $, bullet) {
        'use strict';

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        var createDataArray = function (hypercubeData, layout){
          
          // console.log(layout);

          //get dimension label if it exists, if not create an empty string
          if (layout.props.section1.dimLabel) { 
            var dimLabel=layout.props.section1.dimLabel;
          }
          else {
            var dimLabel=""
          };
          //create variables from layout settings
          var propShowDimSubTitles  = layout.props.section1.showDimSubTitles,
              propMeasureBarSize    = layout.props.section2.barSize,
              propUpperRangeThresh  = Number(layout.props.section4.upperThreshRange),
              propMiddleRangeThresh = Number(layout.props.section4.middleThreshRange),
              propLowerRangeThresh  = Number(layout.props.section4.lowerThreshRange);


          //final array creation, create variables for testing and data manipulation as well
          var dataObject = [],
              numMeasures = hypercubeData.qMeasureInfo.length,
              numDims     = hypercubeData.qDimensionInfo.length,
              dataPages  = hypercubeData.qDataPages[0].qMatrix;

          //loop through all rows in data cube
          for (var r = 0; r < dataPages.length; r++) {

            //use dimensions if one was created
            if (numDims!==0) {
              dataObject.push({ "title"   : dataPages[r][0].qText});

              //check for subtitles in 
              if (propShowDimSubTitles==true) {
                dataObject[r]["subtitle"]  = dimLabel;
              }
            }
            //if no dimensions were added, use the title listed
            else {
              dataObject.push({ "title"   : dimLabel});
            }

            //check number of dimensions and build object based on the expressions available
            if (numMeasures==1) {
              //use numDims to account for when chart does not have dimensions
              dataObject[r]["measures"] = [Number(dataPages[r][numDims].qText.replace(",",""))];
              dataObject[r]["markers"]  = [0];
              dataObject[r]["ranges"]   = [0,0,0];
            }
            if (numMeasures==2) {
              dataObject[r]["measures"] = [Number(dataPages[r][numDims].qText.replace(",",""))];
              dataObject[r]["markers"]  = [Number(dataPages[r][numDims+1].qText.replace(",",""))];
              dataObject[r]["ranges"]   = [0,0,0];
            }
            if (numMeasures==3)  {
              dataObject[r]["measures"] = [Number(dataPages[r][numDims].qText.replace(",",""))];
              dataObject[r]["markers"]  = [Number(dataPages[r][numDims+1].qText.replace(",",""))];
              dataObject[r]["ranges"]   = [Number(dataPages[r][numDims+2].qText.replace(",",""))*propUpperRangeThresh,
                                            Number(dataPages[r][numDims+2].qText.replace(",",""))*propMiddleRangeThresh,
                                            Number(dataPages[r][numDims+2].qText.replace(",",""))*propLowerRangeThresh];
            }
//need else condition here - having trouble with number of dimension handling
            //create the measure bar height as an additional data measure, this is driven from properties
            dataObject[r]["measureBarHeight"] = [propMeasureBarSize];

            }

            // console.log("dataObject: ", dataObject);

          return dataObject;
        };

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

                //set hypercube variable and call function on hcData to return data in a json format
                var hc = layout.qHyperCube,
                    hcData = createDataArray(hc,layout);

                // console.log('hcDataType: ',typeof hcData);
                // console.log('hcData: ',hcData);

                var margin = {top: 5, right: 20, bottom: 10*hcData.length, left: 60};

                // Chart object width
                var width = $element.width() - margin.left - margin.right;

                // Chart object height
                var height = ($element.height()/hcData.length) - margin.top - margin.bottom;// - hcData.length*10;//subtract addtl for bottom margin clipping

                // Chart object id
                var id = "container_" + layout.qInfo.qId;

                // Check to see if the chart element has already been created
                if (document.getElementById(id)) {
                    // if it has been created, empty it's contents so we can redraw it
                    $("#" + id).empty();
                } else {
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

                title.append("text")
                  .attr("class", "subtitle")
                  .attr("dy", "1em")
                  .text(function(d) { return d.subtitle; });

                //fill the bullet with the color specified in the menu
                $("#" + id+" rect.measure").attr("fill",layout.props.section2.barColor);

                //color the marker with the color specified in the menu
                $("#" + id+" line.marker").attr("stroke",layout.props.section3.markerColor);

                //convert hex to rgb as first step of gradient creation
                var rangeRGB          = hexToRgb(layout.props.section4.rangeColor),
                    lowerRangeThresh  = (layout.props.section4.lowerThreshRangeColor),
                    middleRangeThresh = (layout.props.section4.middleThreshRangeColor);

console.log("middleColorNum: ",middleRangeThresh,"lowerColorNum: ",lowerRangeThresh);

                $("#" + id+" rect.range.s2").attr("fill","rgb("+Math.floor(rangeRGB.r*middleRangeThresh)+", "+Math.floor(rangeRGB.g*middleRangeThresh)+", "+Math.floor(rangeRGB.b*middleRangeThresh)+")");
                $("#" + id+" rect.range.s1").attr("fill","rgb("+Math.floor(rangeRGB.r*lowerRangeThresh)+", "+Math.floor(rangeRGB.g*lowerRangeThresh)+", "+Math.floor(rangeRGB.b*lowerRangeThresh)+")");
                $("#" + id+" rect.range.s0").attr("fill","rgb("+rangeRGB.r+", "+rangeRGB.g+", "+rangeRGB.b+")");
            },
            resize: function ($el, layout) {
                this.paint($el, layout);
            }
        };
    } );