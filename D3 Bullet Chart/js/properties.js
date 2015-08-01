define( [], function () {
    'use strict';

    //----------individual accordion labels-------------
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
        type : "integer",
        defaultValue : 2
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
                                dimensionLabel: dimLabel,
                                dimensionTitleBtn : showDimSubTitles
                            }
                        },
                        header2: {
                            type: "items",
                            label: "Measure Bar",
                            items: {
                                barSize: barSize,
                                barColor: barColor
                            }
                        }
                    }
                    // type : "expandable-items",
                    // label : "Configuration",
                    // items : {
                    //     type    : "accordion",
                    //     label   : "Dimensions",
                    //     items   : {
                    //         dimLabel : {
                    //             ref: "props.dimLabel",
                    //             label: "Dimension Label",
                    //             type: "string"
                    //         }
                    //     }
                    //     ,
                    //     backButton : {
                    //         ref : "buttons.back",
                    //         label : "Back",
                    //         type : "boolean",
                    //         defaultValue : true
                    //     },
                    //     forwardButton : {
                    //         ref : "buttons.forward",
                    //         label : "Forward",
                    //         type : "boolean",
                    //         defaultValue : true
                    //     },
                    //     lockButton : {
                    //         ref : "buttons.lockall",
                    //         label : "Lock All",
                    //         type : "boolean",
                    //         defaultValue : false
                    //     },
                    //     unlockButton : {
                    //         ref : "buttons.unlockall",
                    //         label : "Unlock All",
                    //         type : "boolean",
                    //         defaultValue : false
                    //     },
                        
                    // //McGovey 5/19/15 - Added to show tab names
                    //     tabs : {
                    //         ref : "buttons.tabs",
                    //         label : "Show Tab Names",
                    //         type : "boolean",
                    //         defaultValue : false
                    //     }
                    //}
            }
        }
    };

} );
