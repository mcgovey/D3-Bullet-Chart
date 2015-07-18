define( [
        './properties'
    ],
    function (props) {
        'use strict';

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
                //Paint code will go here
            }
        };
    } );