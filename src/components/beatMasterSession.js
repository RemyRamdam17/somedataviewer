import React, { useState, useEffect } from 'react' ;

import { Progress, Column, Radar, RingProgress, Line, Heatmap, BidirectionalBar } from '@ant-design/charts' ;
import '../styles/beatmaster.css' ;

const BeatMasterSessions = ( { session } ) => {

    const primaryColor = '#ff552299' ;
    const secondaryColor = '#b9448f99' ;
    const tertiaryColor = '#75539799' ;
    const quaternaryColor = '#3d537f99' ;

    const [ lineMetrics, setLineMetrics ] = useState([])
    const [ indexMetrics, setIndexMetrics ] = useState(0) ;
    const metrics = ['f1score', 'efficiency', 'accuracy', 'sensibility', 'achievement']

    const [ heatMapData, setHeatMapData ] = useState([])
    const [ ruleChangedBehaviour, setRuleChangedBehaviour ] = useState([])
    const [ consecutiveErrors, setConsecutiveErrors] = useState([])
 
    useEffect( () => {
        if (session !== undefined)
        {
            let _lineMetrics = [] ;
            let _heatMapData = [] ;
            let _ruleChangesSequences = [] ;
            let _rule = 0 ;
            let _consecutiveErrors = [] ;
            let _currentErrorSequence = 0 ;

            ['Left', 'Right', 'Blue', 'Red', 'Cube', 'Sphere'].map( item1 => {
                ['GoodNegative', 'FalseNegative', 'FalsePositive', 'GoodPositive'].map( item2 => {
                    _heatMapData.push({
                        situation : item1,
                        decisionType : item2,
                        value : 0,
                        cardinal : 0,
                        ratio : 0
                    })
                } )
            }) 
            Object.keys(session.data.events).map( (item, index) => {

                _lineMetrics.push({
                    id : index,
                    f1score : session.data.events[index].f1score * 100,
                    efficiency : session.data.events[index].efficiency * 100,
                    accuracy : session.data.events[index].accuracy * 100,
                    sensibility : session.data.events[index].sensibility * 100,
                    achievement : session.data.events[index].achievement * 100,
                    rule : session.data.events[index].rule.toString(),
                    position : session.data.events[index].position > 1 ? 'left' : 'right',
                    shape : session.data.events[index].type %2 === 0 ? 'cube' : 'sphere',
                    color : session.data.events[index].type > 1 ? 'red' : 'blue',
                    TP : session.data.events[index].eventType === 'GoodPositive' ? 1 : 0,
                    FP : session.data.events[index].eventType === 'FalsePositive' ? 1 : 0,
                    FN : session.data.events[index].eventType === 'FalseNegative' ? 1 : 0,
                    TN : session.data.events[index].eventType === 'GoodNegative' ? 1 : 0,
                })

                console.log('YOOO ' + session.data.events[index].eventType) ;

                if (['GoodPositive', 'FalsePositive', 'FalseNegative', 'GoodNegative'].includes(session.data.events[index].eventType))
                {
                    let _color = session.data.events[index].type > 1 ? 'Red' : 'Blue' ;
                    let _shape = session.data.events[index].type %2 === 0 ? 'Cube' : 'Sphere' ;
                    let _side = session.data.events[index].position > 1 ? 'Left' : 'Right' ;
                    _heatMapData = _heatMapData.map(item => item.situation === _color && item.decisionType === session.data.events[index].eventType ? { ...item, value : item.value + 1} : {...item} )
                    _heatMapData = _heatMapData.map(item => item.situation === _color ? { ...item, cardinal : item.cardinal + 1} : {...item} )

                    _heatMapData = _heatMapData.map(item => item.situation === _shape && item.decisionType === session.data.events[index].eventType ? { ...item, value : item.value + 1} : {...item} )
                    _heatMapData = _heatMapData.map(item => item.situation === _shape ? { ...item, cardinal : item.cardinal + 1} : {...item} )

                    _heatMapData = _heatMapData.map(item => item.situation === _side && item.decisionType === session.data.events[index].eventType ? { ...item, value : item.value + 1} : {...item} )
                    _heatMapData = _heatMapData.map(item => item.situation === _side ? { ...item, cardinal : item.cardinal + 1} : {...item} )
                }
                _heatMapData = _heatMapData.map(item => item.cardinal > 0 ? { ...item, ratio : (100 * item.value / item.cardinal).toFixed(1)} : {...item} )

                let _newRule = session.data.events[index].rule ;
                if (_rule !== _newRule)
                {
                    _rule = _newRule ;
                    let _dIndex = 0 ;
                    let _previousEvent = 0 ;
                    let _previous = 0 ;
                    while (_previousEvent < 5)
                    {
                        let i = index - _dIndex ;
                        if (
                            session.data.events[i].eventType === 'FalseNegative' ||
                            session.data.events[i].eventType === 'FalsePositive' )
                            {
                                _previous = _previous + 1 ;
                                _previousEvent = _previousEvent + 1 ;
                            }
                            if (
                                session.data.events[i].eventType === 'GoodNegative' ||
                                session.data.events[i].eventType === 'GoodPositive' )
                                {
                                    _previousEvent = _previousEvent + 1 ;
                                }
                            
                        _dIndex ++ ;
                    }

                    _dIndex = 0 ;
                    let _nextEvent = 0 ;
                    let _next = 0 ;
                    while (_nextEvent < 5)
                    {
                        let i = index + _dIndex ;
                        if (
                            session.data.events[i].eventType === 'FalseNegative' ||
                            session.data.events[i].eventType === 'FalsePositive' )
                            {
                                _next = _next + 1 ;
                                _nextEvent = _nextEvent + 1 ;
                            }
                            if (
                                session.data.events[i].eventType === 'GoodNegative' ||
                                session.data.events[i].eventType === 'GoodPositive' )
                                {
                                    _nextEvent = _nextEvent + 1 ;
                                }
                        _dIndex ++ ;
                    }
                    _ruleChangesSequences.push ({
                        id : _ruleChangesSequences.length,
                        previous : _previous,
                        after : _next,
                        value : [-_previous, _next]
                    })
                }

                if (
                    session.data.events[index].eventType === 'FalseNegative' ||
                    session.data.events[index].eventType === 'FalsePositive' )
                    _currentErrorSequence ++ ;

                if ( _currentErrorSequence > 0 &&
                    ( session.data.events[index].eventType === 'GoodNegative' ||
                    session.data.events[index].eventType === 'GoodPositive') )
                {
                    _consecutiveErrors.push( {id : _consecutiveErrors.length, value : _currentErrorSequence }) ;
                    _currentErrorSequence = 0 ;
                }
            })
            setLineMetrics(_lineMetrics) ;
            setHeatMapData(_heatMapData) ;
            setRuleChangedBehaviour(_ruleChangesSequences) ;
            setConsecutiveErrors(_consecutiveErrors) ;
            console.log(_heatMapData) ;

        }
    }, [session])

    useEffect( () => {

        console.log(lineMetrics) ;
    }, [lineMetrics])

    const radarData = [
        { name : 'F1-Score' , value : session.data.current.f1score },
        { name : 'Efficiency' , value : session.data.current.efficiency },
        { name : 'Accuracy' , value : session.data.current.accuracy },
        { name : 'Sensibility' , value : session.data.current.sensibility },
        { name : 'Achievement' , value : session.data.current.achievement },
    ] ;

    const columnData = [
        { name : 'VP' , value : session.data.current.confusionMatrix[0] },
        { name : 'FP' , value : session.data.current.confusionMatrix[1] },
        { name : 'FN' , value : session.data.current.confusionMatrix[2] },
        { name : 'VN' , value : session.data.current.confusionMatrix[3] },
    ] ;
    
    const configRingProgress = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        autoFit : true,
        padding : 20,
        percent : session.data.current.f1score,
        color : ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#ffffff66'],
        innerRadius : 0.75,
        radius : 0.98,
        title : 'F1-Score',
        statistic : {
            title : {
                style : {
                    color : '#121435',
                    fontSize : '12px',
                    lineHeight : '14px',
                    fontFamily: 'Raleway',
                },
                formatter : () => {
                    return 'F1-Score';
                },
            },
            content: {
                style :  {
                    color : '#121435',
                    fontSize : '12px',
                    lineHeight : '18px',
                    fontFamily: 'Raleway',
                },
                formatter : (item) => {
                    return (session.data.current.f1score * 100).toFixed(1) + '%' ;
                },
            },
        },
    } ;

    const configRadar = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        data : radarData,
        xField : 'name',
        yField : 'value',
        radius : 1,
        autoFit : true,
        padding : 20,
        color : 'l(0) 0:' + primaryColor + ' 1:' + secondaryColor,
        smooth : true,
        showCrosshairs : true,
        meta : {
            value : {
                alias : 'Valeur',
                min : 0,
                nice : true,
                formatter : (item) => {
                    return (item * 100).toFixed(1) + '%' ;
                },
            },
        },
        xAxis: {
            line : null,
            tickLine : null,
            grid : {
                line : {
                    style : {
                        lineDash : null,
                    },
                },
            },
            label : {
                style : {
                    fill : '#121435',
                    opacity : 0.9,
                    fontSize : 10,
                    fontFamily: 'Raleway',
                },
                rotate : 0,
                offset : 5,
            }
        },
        yAxis : {
            label : false,
            line : null,
            tickLine : null,
            grid : {
                line : {
                    type : 'line',
                    style : {
                        lineDash : null,
                        stroke : '#ffffffcc',
                    },
                },
            },
            min : 0,
            max : 1,
        },
        point : {},
        area : {
        },
    } ;

    var configColumn = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        data: columnData,
        xField: 'name',
        yField: 'value',
        autoFit : true,
        padding : 20,
        color: function color(_ref) {
            var name = _ref.name ;
            if (name === 'VP')
              return 'l(0) 0:' + '#ffd700' + ' 1:' + '#ffa700' ;
            if (name === 'FP')
                return 'l(0) 0:' + '#ffa700' + ' 1:' + '#ff6c00' ;
            if (name === 'FN')
                return 'l(0) 0:' + '#ff6c00' + ' 1:' + '#ff3e00' ;
            if (name === 'VN')
                return 'l(0) 0:' + '#ff3e00' + ' 1:' + '#ff1700';
        },
        columnStyle : {
            //fill : 'l(0) 0:' + primaryColor + ' 1:' + secondaryColor,
            radius : [5, 5, 0, 0],
        },
        xAxis: {
            line : null,
            tickLine : null,
            label : {
                style : {
                    fill : '#121435',
                    opacity : 0.6,
                    fontSize : 10,
                    fontFamily: 'Raleway',
                },
                rotate : 0,
                offset : 5,
            }
        },
        yAxis : {
            label : {
                style : {
                    fill : '#121435',
                    opacity : 0.6,
                    fontSize : 10,
                    fontFamily: 'Raleway',
                },
                rotate : 0,
                offset : 5,
            },
            grid : {
                line : {
                    type : 'line',
                    style : {
                        lineDash : null,
                        stroke : '#ffffffcc',
                    },
                },
            },
            max : 200,
        },
    };

    var configProgressShape = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        height: 2,
        width: 100,
        percent: session.data.current.ruleShapeAchievement,
        padding : 20,
        color: ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#E8EDF3'],
        barWidthRatio : 0.6,
        style : {
            marginTop : -10,
        }
    }

    var configProgressColor = {
        
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        height: 2,
        width: 100,
        percent: session.data.current.ruleColorAchievement,
        padding : 20,
        color: ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#E8EDF3'],
        barWidthRatio : 0.6,
        style : {
            marginTop : -10,
        }
    }

    var configProgressShapeAndColor = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        height: 2,
        width: 100,
        autoFit: true,
        percent: session.data.current.ruleShapeAndColorAchievement,
        padding : 20,
        color: ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#E8EDF3'],
        barWidthRatio : 0.6,
        style : {
            marginTop : -10,
        }
    }

    var configHeatMap = {
        data: heatMapData,
        xField: 'situation',
        yField: 'decisionType',
        colorField: 'value',
        sizeField: 'ratio',
        shape: 'circle',
        color: [primaryColor, secondaryColor, tertiaryColor, quaternaryColor],
        label: {
            offset: 2,
            nice : true,
            style: {
                stroke : '#fff',
                fill: '#121435',
                fontSize : 12,
                fontFamily: 'Raleway',
            },
            formatter : (item) => {
                return (item.ratio + '%') ;
            },
        },
        tooltip : {
            fields : ['value'],
        }
    };

    var configMetricsLine = {
        data: lineMetrics,
        xField: 'id',
        yField: metrics[indexMetrics],
        color: ( { id } ) => {
            if (lineMetrics[id].rule === '0')
                return '#00ccff'
                if (lineMetrics[id].rule === '1')
                return '#ccff00aa'
                if (lineMetrics[id].rule === '2')
                return '#ff33a0aa'
        },
        smooth: true,
        yAxis : {
            min : indexMetrics === 4 ? 0 : 50,
            max : 100,
        },
    }

    var configColumnRuleChangedBidirectionalBar = {
        title : 'Errors during rule changes [-5, 5])',
        data: ruleChangedBehaviour,
        color: function color(_ref) {
            return 'l(0) 0:' + primaryColor + ' 1:' + secondaryColor ;
        },
        xField: 'id',
        yField: 'value',
        isRange: true,
        label: {
          position: 'middle',
          layout: [{ type: 'adjust-color' }],
        },
        yAxis : {
            min : -5,
            max : 5,
            tickInterval : 1,
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

    var configColumnConsecutiveErrors = {
        title : 'Consecutive errors',
        data: consecutiveErrors,
        color: function color(_ref) {
            return 'l(0) 0:' + primaryColor + ' 1:' + secondaryColor ;
        },
        xField: 'id',
        yField: 'value',
        label: {
          position: 'middle',
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
    };

    useEffect( () => {

    }, []) ;

    return (

        <div className = "BeatMasterSessionContainer">

            <div className = 'BeatMasterSessionContainerFlexColumnLeft'>

                <h2 className = "BeatMasterSessionCardTitle">Decision metrics</h2>
                <div className = "BeatMasterSessionContainerItem">

                    <div className = 'BeatMasterSessionCardInfo'>
                        <p className = 'BeatMasterSessionCardInfoText'>{session.data.song}</p>
                        <p className = 'BeatMasterSessionCardInfoText'>{session.data.bpm} BPM</p>
                        <div className = 'BeatMasterSessionCardF1Score'>
                        <RingProgress
                            {...configRingProgress}
                        />
                        </div>

                    </div>

                    <div className = 'BeatMasterSessionCardRadar'>
                        <Radar
                            {...configRadar}
                        />
                    </div>

                </div>

                <h2 className = "BeatMasterSessionCardTitle">Decision typology</h2>
                <div className = "BeatMasterSessionContainerItem">
               
                    <div className = 'BeatMasterSessionCardConfusionMatrix'>
                        <Column
                            {...configColumn}
                        />                
                    </div>

                    <div className = 'BeatMasterSessionCardRule'>
                        <p className = 'BeatMasterSessionCardRuleTitle'>Formes</p>
                            <Progress {...configProgressShape} />
                        <p className = 'BeatMasterSessionCardRuleTitle'>Couleurs</p>
                            <Progress {...configProgressColor} />
                        <p className = 'BeatMasterSessionCardRuleTitle'>Formes et couleurs</p>
                            <Progress {...configProgressShapeAndColor} />
                    </div>
                </div>

                <h2 className = "BeatMasterSessionCardTitle">Decision dynamics</h2>
                <div className = "BeatMasterSessionContainerItem">
                    <div className = 'BeatMasterSessionCardMetrics'>
                      <Line {...configMetricsLine} />
                    </div>
                </div>

                <div className = 'BeatMasterSessionChartConfusionMetricsButtons'>
                <button
                    className = {indexMetrics === 0 ? 'BeatMasterSessionChartConfusionMetricsButtonSelected' : 'BeatMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(0) }
                >
                    F1-Score
                </button>
                <button
                    className = {indexMetrics === 1 ? 'BeatMasterSessionChartConfusionMetricsButtonSelected' : 'BeatMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(1) }                
                >
                    Efficiency
                </button>
                <button
                    className = {indexMetrics === 2 ? 'BeatMasterSessionChartConfusionMetricsButtonSelected' : 'BeatMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(2) }                                
                >
                    Accuracy
                </button>
                <button
                    className = {indexMetrics === 3 ? 'BeatMasterSessionChartConfusionMetricsButtonSelected' : 'BeatMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(3) }                                
                >
                    Sensibility
                </button>
                <button
                    className = {indexMetrics === 4 ? 'BeatMasterSessionChartConfusionMetricsButtonSelected' : 'BeatMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(4) }                                
                >
                    Achievement
                </button>

                </div>


            </div>

            <div className = 'BeatMasterSessionContainerFlexColumnRight'>

                <h2 className = "BeatMasterSessionCardTitle">Decision repartition</h2>
                <div className = "BeatMasterSessionContainerItemAlternate">
                    <div className = 'BeatMasterSessionCardHeatmap'>
                        <Heatmap {...configHeatMap} />
                    </div>
                </div>

                <h2 className = "BeatMasterSessionCardTitle">Decision errors during rule transition</h2>
                <div className = "BeatMasterSessionContainerItemAlternate">
                    <div className = 'BeatMasterSessionCardRuleChangedBehaviour'>
                        <Column {...configColumnRuleChangedBidirectionalBar} />

                    </div>
                </div>

                <h2 className = "BeatMasterSessionCardTitle">Number on consecutive errors</h2>
                <div className = "BeatMasterSessionContainerItemAlternate">
                    <div className = 'BeatMasterSessionCardConsecutiveErrors'>
                        <Column {...configColumnConsecutiveErrors} />
                    </div>
                </div>

            </div>
        </div>
    ) ;
} ;

export default BeatMasterSessions ;