import * as d3 from 'd3';
import $ from 'jquery';
import bullet from './vendor/bullet';

//Function that returns 0 if the value passed is NaN or less than 0
function validateBulletNums(val) {
  var enteredVal = Number(val),
    finalVal = 0;
  if (enteredVal > 0) {
    finalVal = enteredVal;
  }
  return finalVal;
}

//Function to convert hex value to rgb array
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

//Function to take hypercube data and turn it into d3 readable array
function createDataArray(hypercubeData, layout) {
  //get dimension label if it exists, if not create an empty string
  if (layout.props.section1.dimLabel) {
    var dimLabel = layout.props.section1.dimLabel;
  }
  else {
    var dimLabel = '';
  }
  //create variables from layout settings
  var propShowDimSubTitles = layout.props.section1.showDimSubTitles,
    propMeasureBarSize = layout.props.section2.barSize,
    propUpperRangeThresh = Number(layout.props.section4.upperThreshRange),
    propMiddleRangeThresh = Number(layout.props.section4.middleThreshRange),
    propLowerRangeThresh = Number(layout.props.section4.lowerThreshRange),
    propUniformAxis = layout.props.section5.uniformAxisBool;


  //final array creation, create variables for testing and data manipulation as well
  var dataObject = [],
    numMeasures = hypercubeData.qMeasureInfo.length,
    numDims = hypercubeData.qDimensionInfo.length,
    dataPages = hypercubeData.qDataPages[0].qMatrix;
  var rangeMax = 0;

  //loop through all rows in data cube
  for (var r = 0; r < dataPages.length; r++) {
    //use dimensions if one was created
    if (numDims !== 0) {
      dataObject.push({ 'title': dataPages[r][0].qText });

      //check for subtitles in the menu text box
      if (propShowDimSubTitles == true) {
        dataObject[r]['subtitle'] = dimLabel;
      }
    }
    //if no dimensions were added, use the title listed
    else {
      dataObject.push({ 'title': dimLabel });
    }

    //check number of dimensions and build object based on the expressions available
    if (numMeasures == 1) {
      //use numDims to account for when chart does not have dimensions
      dataObject[r]['measures'] = [validateBulletNums(dataPages[r][numDims].qText.replace(',', ''))];
      dataObject[r]['markers'] = [0];
      dataObject[r]['ranges'] = [0, 0, 0];
    }
    if (numMeasures == 2) {
      dataObject[r]['measures'] = [validateBulletNums(dataPages[r][numDims].qText.replace(',', ''))];
      dataObject[r]['markers'] = [validateBulletNums(dataPages[r][numDims + 1].qText.replace(',', ''))];
      dataObject[r]['ranges'] = [0, 0, 0];
    }
    if (numMeasures == 3) {
      dataObject[r]['measures'] = [validateBulletNums(dataPages[r][numDims].qText.replace(',', ''))];
      dataObject[r]['markers'] = [validateBulletNums(dataPages[r][numDims + 1].qText.replace(',', ''))];
      dataObject[r]['ranges'] = [validateBulletNums(dataPages[r][numDims + 2].qText.replace(',', '')) * propUpperRangeThresh,
        validateBulletNums(dataPages[r][numDims + 2].qText.replace(',', '')) * propMiddleRangeThresh,
        validateBulletNums(dataPages[r][numDims + 2].qText.replace(',', '')) * propLowerRangeThresh];
    }
    //create the measure bar height as an additional data measure, this is driven from properties
    dataObject[r]['measureBarHeight'] = [propMeasureBarSize];

    //set range max to zero if the configuration is set to not create a single axis for all dimensions
    if (propUniformAxis == true) {
      //Find the biggest number in the current array and compare it to
      if (Math.max(dataObject[r]['measures'], dataObject[r]['markers'], dataObject[r]['ranges'][0]) > rangeMax) {
        rangeMax = Math.max(dataObject[r]['measures'], dataObject[r]['markers'], dataObject[r]['ranges'][0]);
      }
    }
  }

  //Loop through array again to bind the maximum range to the array
  for (var r = 0; r < dataPages.length; r++) {
    dataObject[r]['rangeMax'] = [rangeMax];
  }

  return dataObject;
}

export default function paint($element, layout, component) {

  //set hypercube variable and call function on hcData to return data in a json format
  var hc = layout.qHyperCube,
    hcData = createDataArray(hc, layout);

  //create variables for number of bars allowed and the size of the dimension area for text
  var dimWidth = Number(layout.props.section1.dimWidth),
    barsNum = layout.props.section2.barNum;


  // Create margin - should be replaced by dynamic numbers when this is eventually a responsive viz
  var margin = { top: 5, right: 20, bottom: 25, left: dimWidth };

  // Set chart object width
  var width = $element.width() - margin.left - margin.right;

  // Set chart object height
  if(barsNum > hcData.length){
    barsNum = hcData.length;
  }
  var height =Math.abs($element.height() / barsNum - margin.top - margin.bottom - 1);

  // Chart object id
  var id = 'container_' + layout.qInfo.qId;

  // Check to see if the chart element has already been created
  if (document.getElementById(id)) {
    // if it has been created, empty it's contents so we can redraw it
    $('#' + id).empty();
  } else {
    // if it hasn't been created, create it with the appropiate id and size
    $element.append($('<div />').attr('id', id).attr('class', 'divbullet' ).height($element.height()));
  }
  d3.select(`#${id}`).classed({ 'edit_mode' : component._inEditState });
  var chart = bullet()
    .width(width)
    .height(height);

  var svg = d3.select('#' + id).selectAll('svg')
    .data(hcData)
    .enter().append('svg')
    .attr('class', 'bullet')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom - 2)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(chart);

  //create labels for each bullet
  var title = svg.append('g')
    .style('text-anchor', 'end')
    .attr('transform', 'translate(-6,' + height / 2 + ')');

  title.append('text')
    .attr('class', 'title')
    .text(function (d) { return d.title; });

  title.append('text')
    .attr('class', 'subtitle')
    .attr('dy', '1em')
    .text(function (d) { return d.subtitle; });

  // Colors (with fallbacks to previous properties)
  const { props: { section2, section3, section4 } } = layout;
  const barColor = section2.barColor.color || section2.barColor;
  const markerColor = section3.markerColor.color || section3.markerColor;
  const rangeColor = section4.rangeColor.color || section4.rangeColor;

  //fill the bullet with the color specified in the menu
  $('#' + id + ' rect.measure').attr('fill', barColor);

  //color the marker with the color specified in the menu
  $('#' + id + ' line.marker').attr('stroke', markerColor);

  //convert hex to rgb as first step of gradient creation
  var rangeRGB = hexToRgb(rangeColor),
    lowerRangeThresh = section4.lowerThreshRangeColor,
    middleRangeThresh = section4.middleThreshRangeColor;

  //bind the colors to the ranges on the chart
  $('#' + id + ' rect.range.s2').attr('fill', 'rgb(' + Math.floor(rangeRGB.r * middleRangeThresh) + ', ' + Math.floor(rangeRGB.g * middleRangeThresh) + ', ' + Math.floor(rangeRGB.b * middleRangeThresh) + ')');
  $('#' + id + ' rect.range.s1').attr('fill', 'rgb(' + Math.floor(rangeRGB.r * lowerRangeThresh) + ', ' + Math.floor(rangeRGB.g * lowerRangeThresh) + ', ' + Math.floor(rangeRGB.b * lowerRangeThresh) + ')');
  $('#' + id + ' rect.range.s0').attr('fill', 'rgb(' + rangeRGB.r + ', ' + rangeRGB.g + ', ' + rangeRGB.b + ')');
}
