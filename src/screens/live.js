import React, { useState, useEffect } from 'react' ;
import NavHeader from '../components/navHeader.js' ;
import { db } from '../functions/firebase.js' ;
import '../styles/live.css' ;
import { BeatMasterCard, TrackingMasterCard } from '../components/liveGameCards.js' ;

const Live = props => {

  const [sessions, setSessions] = useState([]) ;
  const [counter, setCounter] = useState(0) ;
  const [infoGames, setInfoGames] = useState([]) ;

  const monitorSessions = () => {
    return new Promise((resolve, reject) => {
      db.collection("Sessions")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added")
            {

            }
            if (change.type === "modified")
            {
              let updatedData = change.doc.data() ;
              setSessions(sessions => [...sessions.filter( item => {
                if (item.player !== updatedData.player || item.game !== updatedData.game)
                  return true ;
                else
                  return false ;
              }), updatedData]) ;    
            }
            if (change.type === "removed")
            {
              if (counter > 1)
                console.log("Removed data: ", change.doc.data());
            }
          });
      }, reject)
    })
  }

  useEffect ( () => {
    if (sessions !== undefined)
    {
      let _infos = [
      ] ;

      let _sessions = sessions.sort( (a, b) => {
        return a.timestamp - b.timestamp < 0 ;
      }) ;
      
      _sessions.map( item => {
        if (item.current !== undefined)
        {
          let _info = 
            {
              player : '',
              game : '',
              level : 0,
              song : '',
              bpm : 0,
              confusionMatrix : [],
              elapsedTime : 1,
              totalItems : 0,
              totaltargets : 0,
              f1score : 0,
              efficiency : 0,
              accuracy : 0,
              sensibility : 0,
              achievement : 0,
              ruleShapeAchievement : 0,
              ruleColorAchievement : 0,
              ruleShapeAndColorAchievement : 0,
            } ;

          _info.player = item.player ;
          _info.game = item.game ;
          if (item.song !== undefined)
            _info.song = item.song ;
          if (item.bpm !== undefined)
            _info.bpm = item.bpm ;
          if (item.current.level !== undefined)
            _info.level = item.current.level ;
          if (item.current.elapsedTime !== undefined)
            _info.elapsedTime = item.current.elapsedTime ;

          if (item.current.totalNumberOfItems !== undefined)
            _info.totalItems = item.current.totalNumberOfItems ;
          if (item.current.totalNumberOfTargets !== undefined)
            _info.totalTargets = item.current.totalNumberOfTargets ;
          if (item.current.speed !== undefined)
            _info.speed = item.current.speed ;

          if (item.current.confusionMatrix)
          {
            let m = item.current.confusionMatrix ;
            let mat = [] ;
            m.map ( ( _item, index ) => {
              mat.push(_item) ;
            })
            _info.confusionMatrix = mat ;
          }

          if (item.current.f1score !== undefined)
            _info.f1score = item.current.f1score ;
          if (item.current.efficiency !== undefined)
            _info.efficiency = item.current.efficiency ;
          if (item.current.accuracy !== undefined)
            _info.accuracy = item.current.accuracy ;
          if (item.current.sensibility !== undefined)
            _info.sensibility = item.current.sensibility ;
          if (item.current.achievement !== undefined)
            _info.achievement = item.current.achievement ;

          if (item.current.ruleColorAchievement !== undefined)
            _info.ruleColorAchievement = item.current.ruleColorAchievement ;
          if (item.current.ruleShapeAchievement !== undefined)
            _info.ruleShapeAchievement = item.current.ruleShapeAchievement ;
          if (item.current.ruleShapeAndColorAchievement !== undefined)
            _info.ruleShapeAndColorAchievement = item.current.ruleShapeAndColorAchievement ;

          _infos.push(_info)
        }
      })
      setCounter(counter + 1) ;
      setInfoGames(_infos) ;
    }
  }, [sessions])

  useEffect( () => {
    let _monitorSessions = monitorSessions() ;
   
    return _monitorSessions ;
  }, [])

  return (

    <div className = 'livePageContainer'>

      <NavHeader history = {props.history} />

      <div className = 'separator' />

      <div className = 'cardsContainer'>

        {
          infoGames !== undefined && infoGames.map( (info, index) => {
            if (info.game.includes("TrackingMaster")) {
              return (
                <TrackingMasterCard
                  key = { info.game + '_' + info.player}
                  username = {info.player} // from game
                  game = 'TrackingMaster' // from game
                  level = {info.level}
                  elapsedTime = {info.elapsedTime} // from game
                  objects = {info.totalItems} // from game
                  targets = {info.totalTargets} // from game 
                  speed = {info.speed} // from game
                  confusionMatrix = {info.confusionMatrix}  // from game
                  achievement = {info.achievement} // from game
                  f1score = {info.f1score} // from game
                  efficiency = {info.efficiency} // from game
                  accuracy = {info.accuracy} // from game
                  sensibility = {info.sensibility} // from game
                />
              )
            }
            else if (info.game.includes("BeatMaster")) {
              return (
                <BeatMasterCard
                  key = { info.game + '_' + info.player}
                  username = {info.player} // from game
                  game = 'BeatMaster' // from game
                  song = {info.song}  // from game
                  bpm = {info.bpm}  // from game
                  elapsedTime = {info.elapsedTime}  // from game
                  confusionMatrix = {info.confusionMatrix} // from game
                  achievement = {info.achievement} // from game
                  f1score = {info.f1score} // from game
                  efficiency = {info.efficiency} // from game
                  accuracy = {info.accuracy} // from game
                  sensibility = {info.sensibility} // from game
                  ruleColorAchievement = {info.ruleColorAchievement} // from game
                  ruleShapeAchievement = {info.ruleShapeAchievement} // from game
                  ruleShapeAndColorAchievement = {info.ruleShapeAndColorAchievement} // from game
                />
              )
            }
          })
        }
      </div>

    </div>
  ) ;




} ;

export default Live ;