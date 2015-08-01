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
    function (props, $, style, bullet) {
        'use strict';

        var createDataArray = function (hypercubeData, layout){
          
          console.log(layout);

          //get dimension label if it exists, if not create an empty string
          if (layout.props.section1.dimLabel) { 
            var dimLabel=layout.props.section1.dimLabel;
          }
          else {
            var dimLabel=""
          };


          //final array creation, create variables for testing and data manipulation as well
          var dataObject = [],
              numMeasures = hypercubeData.qMeasureInfo.length,
              numDims     = hypercubeData.qDimensionInfo.length,
              dataPages  = hypercubeData.qDataPages[0].qMatrix;

          for (var r = 0; r < dataPages.length; r++) {

            //use dimensions if one was created
            if (numDims!=0) {
              dataObject.push({ "title"   : dataPages[r][0].qText});

              //check for subtitles in 
              if (layout.props.section1.showDimSubTitles=true) {
                dataObject[r]["subtitle"]  = dimLabel;
              }
            }
            //if no dimensions were added, use the title listed
            else {
              dataObject.push({ "title"   : dimLabel});
            }

            console.log("data object: ",dataObject);


            if (numMeasures=2) {

              dataObject[r]["markers"] = [Number(dataPages[r][1].qText.replace(",",""))];
              dataObject[r]["measures"] = [Number(dataPages[r][2].qText.replace(",",""))];
              dataObject[r]["ranges"] = [Number(dataPages[r][3].qText.replace(",",""))*.5,
                                      Number(dataPages[r][3].qText.replace(",",""))*.75,
                                      Number(dataPages[r][3].qText.replace(",",""))];

              }


            }

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
                console.log('hcData: ',hcData);

                var margin = {top: 5, right: 20, bottom: 20, left: 60};

                // Chart object width
                var width = $element.width() - margin.left - margin.right;

                // Chart object height
                var height = ($element.height()/hcData.length) - margin.top - margin.bottom - 20;//subtract 20 for bottom margin clipping

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

console.log("bar height: ",height, " + top: ", margin.top, " + bottom: ", margin.bottom);

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

            },
            resize: function ($el, layout) {
                this.paint($el, layout);
            }
        };
    } );