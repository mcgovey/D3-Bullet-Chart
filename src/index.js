
import paint from './paint';
import './stylesheet.css';

//----------individual accordion labels-------------
//Dimension
var dimLabel = {
  ref: 'props.section1.dimLabel',
  label: 'Dimension Label',
  type: 'string',
  expression: 'optional'
};

var showDimSubTitles = {
  ref: 'props.section1.showDimSubTitles',
  label: 'Display Label',
  type: 'boolean',
  defaultValue: false
};
var dimWidth = {
  ref: 'props.section1.dimWidth',
  label: 'Change space for dimension text',
  type: 'number',
  defaultValue: 60,
  min: 10,
  max: 200,
  component: 'slider'
};
//Measure configuration
var barSize = {
  ref: 'props.section2.barSize',
  label: 'Change size of bar',
  type: 'number',
  defaultValue: 33,
  min: 10,
  max: 100,
  component: 'slider'
};
var barNum = {
  ref: 'props.section2.barNum',
  label: 'Quantity of bars showed(max. 50)',
  type: 'integer',
  defaultValue: 4,
  min: 1,
  max: 50
};
var barColor = {
  ref: 'props.section2.barColor',
  label: 'Change bar color',
  type: 'object',
  defaultValue: {
    color: '#4682B4',
    index: 0
  },
  component: 'color-picker',
  dualOutput: true
};
//Marker configuration
var markerColor = {
  ref: 'props.section3.markerColor',
  label: 'Change marker color',
  type: 'object',
  defaultValue: {
    color: '#000000'
  },
  component: 'color-picker',
  dualOutput: true
};
//Range configuration
var rangeColor = {
  ref: 'props.section4.rangeColor',
  label: 'Change range color',
  type: 'object',
  defaultValue: {
    color: '#D3D3D3'
  },
  component: 'color-picker',
  dualOutput: true
};
var middleThreshRangeColor = {
  ref: 'props.section4.middleThreshRangeColor',
  label: 'Change middle range gradient',
  type: 'integer',
  defaultValue: 0.7,
  min: 0,
  max: 1.55,
  step: .05,
  component: 'slider'
};
var lowerThreshRangeColor = {
  ref: 'props.section4.lowerThreshRangeColor',
  label: 'Change lower range gradient',
  type: 'integer',
  defaultValue: 0.85,
  min: 0,
  max: 1.55,
  step: .05,
  component: 'slider'
};
var lowerThreshRange = {
  ref: 'props.section4.lowerThreshRange',
  label: 'Change lower range',
  type: 'integer',
  defaultValue: 0.5,
  min: 0,
  max: 1.05,
  step: .05,
  component: 'slider'
};
var middleThreshRange = {
  ref: 'props.section4.middleThreshRange',
  label: 'Change middle range',
  type: 'integer',
  defaultValue: 0.75,
  min: 0,
  max: 1.05,
  step: .05,
  component: 'slider'
};
var upperThreshRange = {
  ref: 'props.section4.upperThreshRange',
  label: 'Change upper range',
  type: 'integer',
  defaultValue: 1,
  min: 0,
  max: 1.05,
  step: .05,
  component: 'slider'
};
//Axis configuration
var uniformAxisBool = {
  ref: 'props.section5.uniformAxisBool',
  label: 'Consistent for all axis dimension values',
  type: 'boolean',
  defaultValue: true
};

export default {
  definition: {
    type: 'items',
    component: 'accordion',
    items: {
      data:{
        uses: 'data',
        items:{
          dimensions:{
            disabledRef: ''
          },
          measures: {
            disabledRef: ''
          }
        }
      },
      sorting: {
        uses: 'sorting'
      },
      appearance: {
        uses: 'settings',
        items: {
          header1: {
            type: 'items',
            label: 'Dimension',
            items: {
              dimensionLabel: dimLabel,
              dimensionTitleBtn: showDimSubTitles,
              dimWidth: dimWidth
            }
          },
          header2: {
            type: 'items',
            label: 'Measure Bar',
            items: {
              barSize: barSize,
              barNum: barNum,
              barColor: barColor
            }
          },
          header3: {
            type: 'items',
            label: 'Marker',
            items: {
              markerColor: markerColor
            }
          },
          header4: {
            type: 'items',
            label: 'Range',
            items: {
              rangeColor: rangeColor,
              lowerThreshRangeColor: lowerThreshRangeColor,
              middleThreshRangeColor: middleThreshRangeColor,
              upperThreshRange: upperThreshRange,
              middleThreshRange: middleThreshRange,
              lowerThreshRange: lowerThreshRange
            }
          },
          header5: {
            type: 'items',
            label: 'Axis',
            items: {
              uniformAxisBool: uniformAxisBool
            }
          }
        }
      },
    }
  },
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
  data : {
    dimensions: {
      min: 0,
      max: 1
    },
    measures: {
      min: 1,
      max: 3
    }
  },
  support: {
    snapshot: true,
    export: true,
    exportData: true
  },
  paint: function ($element, layout) {
    var g = this;
    try {
      paint($element, layout, g);
    }
    catch (e) {
      console.error(e); // eslint-disable-line no-console
      throw e;
    }
  },
};
