import React, { useState, useEffect } from 'react' ;

import { Gauge, Column, Radar, RingProgress, Line, Heatmap } from '@ant-design/charts' ;
import '../styles/beatmaster.css' ;

import redball from '../medias/redball.png' ;
import blueball from '../medias/blueball.png' ;

const TrackingMasterSessions = ( { session } ) => {

    const primaryColor = '#ff552299' ;
    const secondaryColor = '#b9448f99' ;
    const tertiaryColor = '#75539799' ;
    const quaternaryColor = '#3d537f99' ;

    const [ lineMetrics, setLineMetrics ] = useState([])
    const [ indexMetrics, setIndexMetrics ] = useState(0) ;
    const metrics = ['f1score', 'efficiency', 'accuracy', 'sensibility', 'achievement'] ;

    const [ arrayOfObjects, setArrayOfObjects ] = useState([]) ;
    const [ consecutiveErrors, setConsecutiveErrors] = useState([]) ;
 
    useEffect( () => {
        if (session !== undefined)
        {
            let _lineMetrics = [] ;

            let _was

            Object.keys(session.data.events).map( (item, index) => {

                _lineMetrics.push({
                    id : index,
                    f1score : session.data.events[index].f1score * 100,
                    efficiency : session.data.events[index].efficiency * 100,
                    accuracy : session.data.events[index].accuracy * 100,
                    sensibility : session.data.events[index].sensibility * 100,
                    achievement : session.data.events[index].achievement * 100,
                    elapsedTime : session.data.events[index].elapsedTime,
                    level : session.data.events[index].level,
                    speed : session.data.events[index].speed,
                    numberOfItems : session.data.events[index].totalNumberOfItems,
                    numberOfTargets : session.data.events[index].totalNumberOfTargets,
                })

            })

            setLineMetrics(_lineMetrics) ;

            let _arr = [] ;
                for (var i = 0 ; i < session.data.current.totalNumberOfItems ; i++)
                    _arr.push(i) ;
            setArrayOfObjects([..._arr]) ;
    
        }
    }, [session])

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

    var configMetricsLine = {
        data: lineMetrics,
        xField: 'id',
        yField: metrics[indexMetrics],
        color : primaryColor,
        smooth: true,
        yAxis : {
            min : indexMetrics === 4 ? 0 : 50,
            max : 100,
        },
    }

    var configGaugeSpeed = {
        animation : {
            appear: {
                duration : 100,
            },
            update :{
                duration : 100,
            }
        },
        percent : session.data.current.speed/40,
        autoFit: true,
        range : { color: 'l(0) 0:' + '#ffd700' + ' 1:' + '#ff1700' },
        indicator: {
          pointer: { style: { stroke: '#D0D0D0' } },
          pin: { style: { stroke: '#D0D0D0' } },
        },
        axis: {
          label: {
            formatter: function formatter(v) {
              return (Number(v)*40).toFixed(1) ;
            },
          },
          subTickLine: { count: 3 },
        },
        statistic: {
            content: {
                formatter: function formatter() {
                    return 'Speed : x'.concat((session.data.current.speed).toFixed(1)) ;
                },
                offsetY : 30,
                style: { fontSize: 14, color : '#121435',},
            },
        },
    };

    var configLevelLine = {
        data : lineMetrics,
        xField : 'id',
        yField : 'level',
        color : tertiaryColor,
    };

    var configElapsedTimeLine = {
        data : lineMetrics,
        xField : 'id',
        yField : 'elapsedTime',
        color : tertiaryColor,
    };

    return (

        <div className = "TrackingMasterSessionContainer">

            <div className = 'TrackingMasterSessionContainerFlexColumnLeft'>

                <h2 className = "TrackingMasterSessionCardTitle">Decision metrics</h2>
                <div className = "TrackingMasterSessionContainerItem">

                    <div className = 'TrackingMasterSessionCardInfo'>
                        <p className = 'TrackingMasterSessionCardInfoText'>Final level : {session.data.current.level}</p>
                        <div className = 'TrackingMasterSessionCardF1Score'>
                        <RingProgress
                            {...configRingProgress}
                        />
                        </div>

                    </div>

                    <div className = 'TrackingMasterSessionCardRadar'>
                        <Radar
                            {...configRadar}
                        />
                    </div>
                </div>

                <h2 className = "TrackingMasterSessionCardTitle">Decision typology</h2>
                <div className = "TrackingMasterSessionContainerItem">
               
                    <div className = 'TrackingMasterSessionCardConfusionMatrix'>
                        <Column
                            {...configColumn}
                        />                
                    </div>

                    <div className = 'TrackingMasterSessionCardProperties'>
                        <div className = 'TrackingMasterSessionCardPropertiesTargets'>
                            {
                                arrayOfObjects.map( (item, index) => {
                                    if (index < session.data.current.totalNumberOfTargets)
                                        return <img key = {index} src = {redball} className = 'ball'/>
                                    else
                                        return <img key = { index } src = {blueball} className = 'ball'/>
                                })
                            }
                        </div>
                        <div className = 'TrackingMasterSessionCardGauge'>
                            <Gauge {...configGaugeSpeed} />
                        </div>
                    </div>
                </div>

                <h2 className = "TrackingMasterSessionCardTitle">Decision dynamics</h2>
                <div className = "TrackingMasterSessionContainerItem">
                    <div className = 'TrackingMasterSessionCardMetrics'>
                      <Line {...configMetricsLine} />
                    </div>
                </div>

                <div className = 'TrackingMasterSessionChartConfusionMetricsButtons'>
                <button
                    className = {indexMetrics === 0 ? 'TrackingMasterSessionChartConfusionMetricsButtonSelected' : 'TrackingMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(0) }
                >
                    F1-Score
                </button>
                <button
                    className = {indexMetrics === 1 ? 'TrackingMasterSessionChartConfusionMetricsButtonSelected' : 'TrackingMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(1) }                
                >
                    Efficiency
                </button>
                <button
                    className = {indexMetrics === 2 ? 'TrackingMasterSessionChartConfusionMetricsButtonSelected' : 'TrackingMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(2) }                                
                >
                    Accuracy
                </button>
                <button
                    className = {indexMetrics === 3 ? 'TrackingMasterSessionChartConfusionMetricsButtonSelected' : 'TrackingMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(3) }                                
                >
                    Sensibility
                </button>
                <button
                    className = {indexMetrics === 4 ? 'TrackingMasterSessionChartConfusionMetricsButtonSelected' : 'TrackingMasterSessionChartConfusionMetricsButton' }
                    onClick = { () => setIndexMetrics(4) }                                
                >
                    Achievement
                </button>

                </div>


            </div>

            <div className = 'TrackingMasterSessionContainerFlexColumnRight'>

                <h2 className = "TrackingMasterSessionCardTitle">Levels</h2>
                <div className = "TrackingMasterSessionContainerItemAlternate">
                    <div className = 'TrackingMasterSessionCardLevels'>
                        <Line {...configLevelLine} />
                    </div>
                </div>

                <h2 className = "TrackingMasterSessionCardTitle">Elapsed time</h2>
                <div className = "TrackingMasterSessionContainerItemAlternate">
                    <div className = 'TrackingMasterSessionCardLevels'>
                        <Line {...configElapsedTimeLine} />
                    </div>
                </div>

                <h2 className = "TrackingMasterSessionCardTitle">An other metric</h2>
                <div className = "TrackingMasterSessionContainerItemAlternate">
                    <div className = 'TrackingMasterSessionCardLevels'>
                        <Line {...configElapsedTimeLine} />
                    </div>
                </div>


            </div>
        </div>
    ) ;
} ;

export default TrackingMasterSessions ;