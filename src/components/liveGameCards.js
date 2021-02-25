import React, { useState, useEffect } from 'react' ;
import { Gauge, Progress, Column, Radar, RingProgress } from '@ant-design/charts' ;
import redball from '../medias/redball.png' ;
import blueball from '../medias/blueball.png' ;

import '../styles/cardContainer.css' ;

export const BeatMasterCard = props => {

    const primaryColor = '#ff1700' ;
    const secondaryColor = '#ffd700' ;

    const radarData = [
        { name : 'F1-Score' , value : props.f1score },
        { name : 'Efficiency' , value : props.efficiency },
        { name : 'Accuracy' , value : props.accuracy },
        { name : 'Sensibility' , value : props.sensibility },
        { name : 'Achievement' , value : props.achievement },
    ] ;

    const columnData = [
        { name : 'VP' , value : props.confusionMatrix[0] },
        { name : 'FP' , value : props.confusionMatrix[1] },
        { name : 'FN' , value : props.confusionMatrix[2] },
        { name : 'VN' , value : props.confusionMatrix[3] },
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
        percent : props.f1score,
        color : ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#ffffff66'],
        innerRadius : 0.75,
        radius : 0.98,
        title : 'F1-Score',
        statistic : {
            title : {
                style : {
                    color : '#121435',
                    fontSize : '14px',
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
                    return (props.f1score * 100).toFixed(1) + '%' ;
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
        percent: props.ruleShapeAchievement,
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
        percent: props.ruleColorAchievement,
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
        percent: props.ruleShapeAndColorAchievement,
        padding : 20,
        color: ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#E8EDF3'],
        barWidthRatio : 0.6,
        style : {
            marginTop : -10,
        }
    }

    var configProgressRemainingTime = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        width: 200,
        percent: props.elapsedTime,
        color: ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#E8EDF3'],
        barWidthRatio : 0.2,
    }

    useEffect( () => {
        //console.log(props) ;
    }, []) ;

    return (
        <div className = 'cardContainer'>

            <div className = 'cardInfo'>
                <p className = 'cardInfoText'>{props.username}</p>
                <p className = 'cardInfoText'>{props.game}</p>
                <p className = 'cardInfoText'>{props.song}</p>
                <p className = 'cardInfoText'>{props.bpm} BPM</p>
            </div>

            <div className = 'cardF1Score'>
                <RingProgress
                    {...configRingProgress}
                />
            </div>

            <div className = 'cardRadar'>
                <Radar
                    {...configRadar}
                />
            </div>

            <div className = 'cardConfusionMatrix'>
                <Column
                    {...configColumn}
                />                
            </div>


            <div className = 'cardRule'>

                <p className = 'cardRuleTitle'>Formes</p>
                <Progress {...configProgressShape} />
                <p className = 'cardRuleTitle'>Couleurs</p>
                <Progress {...configProgressColor} />
                <p className = 'cardRuleTitle'>Formes et couleurs</p>
                <Progress {...configProgressShapeAndColor} />

            </div>

            <div className = 'cardRemainingTime'>
                <p className = 'cardRemainingTimeTitle'>Temps écoulé</p>
                <Progress {...configProgressRemainingTime} />
            </div>

        </div>

    ) ;
} ;

export const TrackingMasterCard = props => {
    
    const primaryColor = '#ff1700' ;
    const secondaryColor = '#ffd700' ;

    const [arrayOfObjects, setArrayOfObjects] = useState([]) ;

    const radarData = [
        { name : 'F1-Score' , value : props.f1score },
        { name : 'Efficiency' , value : props.efficiency },
        { name : 'Accuracy' , value : props.accuracy },
        { name : 'Sensibility' , value : props.sensibility },
        { name : 'Achievement' , value : props.achievement },
    ] ;

    const columnData = [
        { name : 'VP' , value : props.confusionMatrix[0] },
        { name : 'FP' , value : props.confusionMatrix[1] },
        { name : 'FN' , value : props.confusionMatrix[2] },
        { name : 'VN' , value : props.confusionMatrix[3] },
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
        percent : props.f1score,
        color : ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#ffffff66'],
        innerRadius : 0.75,
        radius : 0.98,
        title : 'F1-Score',
        animate : false,
        statistic : {
            title : {
                style : {
                    color : '#121435',
                    fontSize : '14px',
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
                    return (props.f1score * 100).toFixed(1) + '%' ;
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
                max : 1,
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
        area : {},
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
            tickLine : null,
        },
    };

    var configProgressRemainingTime = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        width: 200,
        percent: props.elapsedTime,
        color: ['l(0) 0:' + primaryColor + ' 1:' + secondaryColor, '#E8EDF3'],
        barWidthRatio : 0.2,
    }

    var configGaugeSpeed = {
        animation : {
            appear: {
                duration : 10,
            },
            update :{
                duration : 10,
            }
        },
        percent : props.speed/40,
        autoFit: true,
        range : { color: 'l(0) 0:' + '#ffd700' + ' 1:' + '#ff1700' },
        indicator: {
          pointer: { style: { stroke: '#D0D0D0' } },
          pin: { style: { stroke: '#D0D0D0' } },
        },
        axis: {
          label: {
            formatter: function formatter(v) {
              return (Number(v)*10).toFixed(1) ;
            },
          },
          subTickLine: { count: 3 },
        },
        statistic: {
            content: {
                formatter: function formatter() {
                    return 'Speed : x'.concat((props.speed).toFixed(1)) ;
                },
                offsetY : 30,
                style: { fontSize: 14, color : '#121435',},
            },
        },
        animation: false,
    };

    useEffect( () => {
        let _arr = [] ;
        for (var i = 0 ; i < props.objects ; i++)
            _arr.push(i) ;
        setArrayOfObjects([..._arr]) ;
    }, []) ;

    useEffect( () => {
        let _arr = [] ;
        for (var i = 0 ; i < props.objects ; i++)
            _arr.push(i) ;
        setArrayOfObjects([..._arr]) ;
    }, [props])

    return (
        <div className = 'cardContainer'>

            <div className = 'cardInfo'>
                <p className = 'cardInfoText'>{props.username}</p>
                <p className = 'cardInfoText'>{props.game}</p>
                <p className = 'cardInfoText'>Level {props.level}</p>
            </div>

            <div className = 'cardF1Score'>
                <RingProgress
                    {...configRingProgress}
                />
            </div>

            <div className = 'cardRadar'>
                <Radar
                    {...configRadar}
                />
            </div>

            <div className = 'cardConfusionMatrix'>
                <Column
                    {...configColumn}
                />                
            </div>


            <div className = 'cardGameProperties'>
                <div className = 'cardGamePropertiesTargets'>
                    {
                        arrayOfObjects.map( (item, index) => {
                            if (index < props.targets)
                                return <img key = {index} src = {redball} className = 'ball'/>
                            else
                                return <img key = { index } src = {blueball} className = 'ball'/>
                        })
                    }
                </div>
                <div className = 'cardGameGauge'>
                    <Gauge {...configGaugeSpeed} />
                </div>
            </div>

            <div className = 'cardRemainingTime'>
                <p className = 'cardRemainingTimeTitle'>Temps écoulé</p>
                <Progress {...configProgressRemainingTime} />
            </div>

        </div>
    ) ;
} ;

