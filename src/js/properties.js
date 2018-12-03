define( [], function () {
    'use strict';
    var colorOptions = [{
            value: "#00FFFF",
            label: "Aqua"  
        },{
            value: "#000000",
            label: "Black"  
        },{
            value: "#A52A2A",
            label: "Brown"  
        },{
            value: "#D2691E",
            label: "Chocolate"  
        },{
            value: "#FF7F50",
            label: "Coral"  
        },{
            value: "#DC143C",
            label: "Crimson"  
        },{
            value: "#00008B",
            label: "Dark Blue"  
        },{
            value: "#006400",
            label: "Dark Green"  
        },{
            value: "#FF8C00",
            label: "Dark Orange"  
        },{
            value: "#696969",
            label: "Dim Grey"  
        },{
            value: "#B22222",
            label: "Fire Brick"  
        },{
            value: "#228B22",
            label: "Forest Green"  
        },{
            value: "#008000",
            label: "Green"  
        },{
            value: "#808080",
            label: "Grey"  
        },{
            value: "#ADD8E6",
            label: "Light Blue"  
        },{
            value: "#D3D3D3",
            label: "Light Grey"  
        },{
            value: "#00FF00",
            label: "Lime"  
        },{
            value: "#800000",
            label: "Maroon"  
        },{
            value: "#4169E1",
            label: "Royal Blue"  
        },{
            value: "#8B4513",
            label: "Saddle Brown"
        },{
            value: "#F4A460",
            label: "Sandy Brown"
        },{
            value: "#2E8B57",
            label: "Sea Green"  
        },{
            value: "#708090",
            label: "Slate Grey"  
        },{
            value: "#4682B4",
            label: "Steel Blue"  
        },{
            value: "#008080",
            label: "Teal"  
        },{
            value: "#D2B48C",
            label: "Tan"  
        },{
            value: "#EE82EE",
            label: "Violet"  
        },{
            value: "#F5DEB3",
            label: "Wheat"  
        }
        ]

    //----------individual accordion labels-------------
    //Dimensions
    var dimLabel = {
        ref: "props.section1.dimLabel",
        label: "Dimension Label",
        type: "string",
        expression: "optional"
    };

    var showDimSubTitles = {
        ref : "props.section1.showDimSubTitles",
        label : "Display Subtitles",
        type : "boolean",
        defaultValue : false
    };
    var dimWidth = {
        ref : "props.section1.dimWidth",
        label : "Change space for dimension text",
        type : "number",
        defaultValue : 60,
        min : 10,
        max : 200,
        component : "slider"
    };
    //Measure configuration
    var barSize = {
        ref : "props.section2.barSize",
        label : "Change size of bar",
        type : "number",
        defaultValue : 33,
        min : 10,
        max : 100,
        component : "slider"
    };
    var barColor = {
        ref : "props.section2.barColor",
        label : "Change bar color",
        type : "string",
        defaultValue: "#4682B4",
        component: "dropdown",
        options: colorOptions
    };
    //Marker configuration
    var markerColor = {
        ref : "props.section3.markerColor",
        label : "Change marker color",
        type : "string",
        defaultValue: "#000000",
        component: "dropdown",
        options: colorOptions
    };
    //Range configuration
    var rangeColor = {
        ref : "props.section4.rangeColor",
        label : "Change range color",
        type : "string",
        defaultValue: "#D3D3D3",
        component: "dropdown",
        options: colorOptions
    };
    var middleThreshRangeColor = {
        ref : "props.section4.middleThreshRangeColor",
        label : "Change middle range gradient",
        type : "integer",
        defaultValue: 0.7,
        min : 0,
        max : 1.55,
        step : .05,
        component: "slider"
    };
    var lowerThreshRangeColor = {
        ref : "props.section4.lowerThreshRangeColor",
        label : "Change lower range gradient",
        type : "integer",
        defaultValue: 0.85,
        min : 0,
        max : 1.55,
        step : .05,
        component: "slider"
    };
    var lowerThreshRange = {
        ref : "props.section4.lowerThreshRange",
        label : "Change lower range",
        type : "integer",
        defaultValue: 0.5,
        min : 0,
        max : 1.05,
        step : .05,
        component: "slider"
    };
    var middleThreshRange = {
        ref : "props.section4.middleThreshRange",
        label : "Change middle range",
        type : "integer",
        defaultValue: 0.75,
        min : 0,
        max : 1.05,
        step : .05,
        component: "slider"
    };
    var upperThreshRange = {
        ref : "props.section4.upperThreshRange",
        label : "Change upper range",
        type : "integer",
        defaultValue: 1,
        min : 0,
        max : 1.05,
        step : .05,
        component: "slider"
    };
    //Axis configuration
    var uniformAxisBool = {
        ref : "props.section5.uniformAxisBool",
        label : "Consistent axis for all dimensions",
        type : "boolean",
        defaultValue : true
    };



    //----------final properties creation---------------
    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions"
                ,min: 0
                ,max: 1
            },
            measures: {
                uses: "measures"
                ,min: 1
                ,max: 3
            },
            sorting: {
                uses: "sorting"
            },
            appearance: {
                uses: "settings"
            },
            configuration : {
                    component: "expandable-items",
                    label: "Chart Configuration",
                    items: {
                        header1: {
                            type: "items",
                            label: "Dimensions",
                            items: {
                                dimensionLabel:         dimLabel,
                                dimensionTitleBtn :     showDimSubTitles,
                                dimWidth:               dimWidth
                            }
                        },
                        header2: {
                            type: "items",
                            label: "Measure Bar",
                            items: {
                                barSize:                barSize,
                                barColor:               barColor
                            }
                        },
                        header3: {
                            type: "items",
                            label: "Marker",
                            items: {
                                markerColor:            markerColor
                            }
                        },
                        header4: {
                            type: "items",
                            label: "Range",
                            items: {
                                rangeColor:             rangeColor,
                                lowerThreshRangeColor:  lowerThreshRangeColor,
                                middleThreshRangeColor: middleThreshRangeColor,
                                upperThreshRange:       upperThreshRange,
                                middleThreshRange:      middleThreshRange,
                                lowerThreshRange:       lowerThreshRange
                            }
                        },
                        header5: {
                            type: "items",
                            label: "Axis",
                            items: {
                                uniformAxisBool:        uniformAxisBool
                            }
                        }
                    }
            }
        }
    };

} );
