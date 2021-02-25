import React, { useState, useEffect } from 'react' ;
import { Line, Column } from '@ant-design/charts' ;
import Switch from "react-switch" ;


const TrackingMasterSynthesis = ( { sessions } ) => {

    const primaryColor = '#ff552299' ;
    const secondaryColor = '#b9448f99' ;
    const tertiaryColor = '#75539799' ;
    const quaternaryColor = '#3d537f99' ;

    const metrics = ['f1score', 'efficiency', 'accuracy', 'sensibility', 'achievement']

    const [ indexMetrics, setIndexMetrics ] = useState(1) ;

    const [ displayedData, setDisplayedData ] = useState([]) ;
    const [ displayedSessions, setDisplayedSessions ] = useState([]) ;
    const [ confusionMatrices, setConfusionMatrices ] = useState([]) ;

    const [showPercentage, setShowPercentage] = useState(false) ;

    const datify = ( date ) => {
        return date.toDate().toLocaleString() ;
    }

    useEffect ( () => {
        console.log("Found sessions : " + sessions.length) ;
    }, [])

    useEffect ( () => {
        console.log("Found sessions : " + sessions.length) ;
        setDisplayedSessions(sessions) ;
    }, [sessions])

    useEffect ( () => {

        let _displayedData = [] ;
        let _confusionMatrices = [] ;

        let _sessions = sessions.sort((a,b) => {
            console.log(a.data.timestamp, new Date(a.data.timestamp).getTime())
            return a.data.timestamp - 
                b.data.timestamp > 0
        }).slice(-10) ;

        let indexSession = 0 ;
        _sessions.map ( item => {
            if (item.data.current !== undefined)
            {
                _displayedData.push( {
                    id : datify(item.data.timestamp),
                    song : item.data.song,
                    efficiency : item.data.current.efficiency,
                    accuracy : item.data.current.accuracy,
                    sensibility : item.data.current.sensibility,
                    f1score : item.data.current.f1score,
                    achievement : item.data.current.achievement,
                    confusionMatrix : item.data.current.confusionMatrix,
                    ruleColorAchievement : item.data.current.ruleColorAchievement,
                    shapeColorAchievement : item.data.current.shapeColorAchievement,
                    ruleShapeAndColorAchievement : item.data.current.ruleShapeAndColorAchievement,
                    score : item.data.current.score
                }) ;

                let m = item.data.current.confusionMatrix ;
                let _types = ['True Positive', 'False Positive', 'False Negative', 'True Negative'] ;
                let _sum = m.reduce((a, b) => a + b, 0) ;
                m.map( (value, index) => {
                    console.log('index : ' + index + ', value : ' + value) ;
                    _confusionMatrices.push( {
                        indexSession : indexSession,
                        timestamp : datify(item.data.timestamp),
                        type : _types[index],
                        value : value,
                        ratio : value / _sum,
                    })
                })
                indexSession++ ;
            }
        })
        setDisplayedData(_displayedData) ;
        setConfusionMatrices(_confusionMatrices) ;

    }, [displayedSessions])

    useEffect ( () => {

        if (displayedData !== null)
        {
            console.log(displayedData)
        }

    }, [ displayedData ])

    var configBarConfusionMatrices = {
        animation : {
            appear: {
                duration : 0,
            },
            update :{
                duration : 0,
            }
        },
        data : confusionMatrices,
        xField : 'timestamp',
        yField : 'value',
        seriesField : 'type',
        isStack: true,
        isPercent : showPercentage,
        color: [ primaryColor, secondaryColor, tertiaryColor, quaternaryColor ],
        label: {
            position: 'middle',
            content: (item) => {
                return showPercentage ? (item.ratio * 100).toFixed(1) + '%' : item.value ;
            },
            style: { fill: '#121435' },
        },
        tooltip : {
            content: (item ) => {
                return showPercentage ? item.value : (item.ratio * 100).toFixed(1) + '%'  ;
            },  
        },
        xAxis: {
            rotate : true,
            label : {
                style : {
                    fill : '#121435',
                    opacity : 0.9,
                    fontSize : 8,
                    fontFamily: 'Raleway',
                },
                rotate : 0.7,
                offset : 25,
            },
        },
        yAxis : {
            label : false,
        },
    };

    const configConfusionMetricsLine = {
        data : displayedData,
        xField : 'id',
        yField : metrics[indexMetrics],
        autoFit : true,
        smooth : true,
        color: quaternaryColor,
        point: {
          size: 5,
          shape: 'diamond',
        },
        label: {
            offsetY : 30, 
            style: {
                fill: '#121434',
            },
            formatter: ( item ) => {
                return (item[metrics[indexMetrics]]*100).toFixed(2) + '%' ;
            },
        },
        tooltip : {
            content: (item ) => {
                return (Number(item[metrics[indexMetrics]]*100).toFixed(2) + '%')  ;
            },  
        },

        xAxis: {
            line : null,
            tickLine : null,
            nice : true,
            grid : {
                line : {
                    type : 'line',
                    style : {
                        lineDash : null,
                        stroke : '#ffffff33',
                    },
                },
            },
            rotate : true,
            label : {
                style : {
                    fill : '#121435',
                    opacity : 0.9,
                    fontSize : 12,
                    fontFamily: 'Raleway',
                },
                rotate : 0.7,
                offset : 25,
            },
        },
        yAxis : {
            label : false,
            line : null,
            tickLine : null,
            min : 0,
            max : 1,
            grid : {
                line : {
                    type : 'line',
                    style : {
                        lineDash : null,
                        stroke : '#ffffffcc',
                    },
                },
            },
        },
    };


    return (
        <div className = "BeatMasterSynthesisContainer">

            <div className = "BeatMasterContainerItem">

                <h2 className = "BeatMasterSynthesisCardTitle">Decision metrics</h2>

                <div className = 'BeatMasterSynthesisChartConfusionMetrics' >
                    <Line {...configConfusionMetricsLine} />
                </div> 

                <div className = 'BeatMasterSynthesisChartConfusionMetricsButtons'>
                    <button
                        className = {indexMetrics === 0 ? 'BeatMasterSynthesisChartConfusionMetricsButtonSelected' : 'BeatMasterSynthesisChartConfusionMetricsButton' }
                        onClick = { () => setIndexMetrics(0) }
                    >
                        F1-Score
                    </button>
                    <button
                        className = {indexMetrics === 1 ? 'BeatMasterSynthesisChartConfusionMetricsButtonSelected' : 'BeatMasterSynthesisChartConfusionMetricsButton' }
                        onClick = { () => setIndexMetrics(1) }                
                    >
                        Efficiency
                    </button>
                    <button
                        className = {indexMetrics === 2 ? 'BeatMasterSynthesisChartConfusionMetricsButtonSelected' : 'BeatMasterSynthesisChartConfusionMetricsButton' }
                        onClick = { () => setIndexMetrics(2) }                                
                    >
                        Accuracy
                    </button>
                    <button
                        className = {indexMetrics === 3 ? 'BeatMasterSynthesisChartConfusionMetricsButtonSelected' : 'BeatMasterSynthesisChartConfusionMetricsButton' }
                        onClick = { () => setIndexMetrics(3) }                                
                    >
                        Sensibility
                    </button>
                    <button
                        className = {indexMetrics === 4 ? 'BeatMasterSynthesisChartConfusionMetricsButtonSelected' : 'BeatMasterSynthesisChartConfusionMetricsButton' }
                        onClick = { () => setIndexMetrics(4) }                                
                    >
                        Achievement
                    </button>

                </div>
            </div>


            <div className = "BeatMasterContainerItem">

                <h2 className = "BeatMasterSynthesisCardTitle">Confusion matrices</h2>
                <div className = 'BeatMasterSynthesisChartConfusionMatrix'>
                    <Column {...configBarConfusionMatrices} />
                </div>

                <div className = 'BeatMasterSynthesisChartConfusionMatrixSwitch'>
                    <p className = 'BeatMasterSynthesisChartConfusionMatrixSwitchText' >Showing %</p>
                    <Switch
                        onChange = { () => setShowPercentage(!showPercentage) }
                        checked = { showPercentage }
                        onColor = '#ff5522'
                        offColor = '#121435'
                    />
                </div>
            </div>

        </div>
    ) ;
} ;

export default TrackingMasterSynthesis ;