import React, { useState, useEffect } from 'react' ;

import SelectSearch from 'react-select-search' ;
import '../selector.css' ;

import NavHeader from '../components/navHeader.js' ;

import TrackingMasterSynthesis from '../components/trackingMasterSynthesis.js' ;
import TrackingMasterSession from '../components/trackingMasterSession.js' ;

import { db } from '../functions/firebase.js' ;

import '../styles/trackingmaster.css' ;

const TrackingMaster = props => {

  const [players, setPlayers] = useState([]) ;
  const [playerIndex, setPlayerIndex] = useState(-1) ;
  const [optionsPlayers, setOptionsPlayers] = useState([]) ;

  const [sessions, setSessions] = useState([]) ;
  const [sessionIndex, setSessionIndex] = useState(-1) ;
  const [optionsSessions, setOptionsSessions] = useState([]) ;

  const [selectedUserSessions, setSelectedUserSessions] = useState([])
  const [selectedUserSession, setSelectedUserSession] = useState([])

  useEffect( () => {
    db.collection('Players')    
    .get()
    .then(querySnapshot => {
        var _players = []
        querySnapshot.docs.map( doc => {
            _players.push( { id : doc.id, username : doc.data().username, nickname : doc.data().nickname})
        } ) ;
        setPlayers(_players) ;
    });


    let _sessions = [] ;
    db.collection('Sessions')
    .get()
    .then ( queryDocuments => {
        queryDocuments.docs.map( doc => {
            if ( doc.data().game.includes("TrackingMaster") && doc.data().events !== undefined )
                _sessions.push({ id : doc.id, data : doc.data() })
        } ) ;
        setSessions(_sessions) ;
    })

  }, [])

  useEffect( () => {
    if (players !== undefined && players.length > 0)
    {
      let _players = []
      players.map( (item, index) => {
        var findItem = _players.find(x => x.username === item.username) ;
        if (!findItem) {
          _players.push({name : item.nickname, username : item.username, value : index })
        }
      });

      _players.sort( (a, b) => {
        return a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}) ;
      })
      setOptionsPlayers(_players) ;
    }
  }, [players])

  const playerChanged = ( value ) => {
    setPlayerIndex(value) ;
  }

  const sessionChanged = ( value ) => {
    setSessionIndex(value) ;
  }
  useEffect( () => {
    if (sessions !== undefined)
        console.log("Number of found sessions : " + sessions.length) ;
  }, [sessions]) ;

  useEffect ( () => {
    if (playerIndex !== -1)
    {
      console.log('player index : ' + playerIndex) ;
      console.log('selected username : ' + players[playerIndex].username) ;
      console.log('selected nickname : ' + players[playerIndex].nickname) ;
      let _sessions = sessions.filter( item => item.data.player === players[playerIndex].username)
      setSelectedUserSessions( _sessions.sort((a, b) => b.data.timestamp -  a.data.timestamp > 0)) ;
    }
  }, [playerIndex])

  useEffect ( () => {
    if (sessionIndex !== -1)
    {
      let _session = sessions.filter( item => item.data.timestamp === selectedUserSessions[sessionIndex].data.timestamp) ;
      
      if (_session !== undefined)
      {
        console.log('new session : ') ;
        console.log(_session) ;
      }
      else
      {
        console.log('session is undefined') ;
      }
      
      setSelectedUserSession( _session[0]) ;
    }
  }, [sessionIndex])


  const datify = ( date ) => {
    return date.toDate().toLocaleString() ;
  }

  useEffect( () => {
    if (selectedUserSession !== undefined)
    {
      console.log('Selected user session : ') ;
      console.log(selectedUserSession.data) ;
    }
  }, [selectedUserSession])

  useEffect( () => {
    if (selectedUserSessions !== undefined) {

      console.log('yo ' + selectedUserSessions.length) ;
      let _sessions = []
      selectedUserSessions.map( (item, index) => {
        var findItem = _sessions.find(x => x.data.timestamp === item.data.timestamp) ;
        if (!findItem) {
          _sessions.push({name : datify(item.data.timestamp), data : item.data, value : index })
        }
      });

      console.log(_sessions) ;
      setOptionsSessions(_sessions) ;
    }
  }, [selectedUserSessions])


  return (
    <div className = 'trackingMasterPageContainer'>

      <NavHeader history = {props.history} />
  
      <div className = "TrackingMasterContainers">

        <SelectSearch className = 'playerSelectSearch' options = { optionsPlayers } value = {playerIndex} name = "Player" placeholder = "Select Player" onChange = { playerChanged } openMenuOnClick = { true } />

        <TrackingMasterSynthesis
          sessions = { selectedUserSessions }
        />

        <SelectSearch className = 'sessionSelectSearch' options = { optionsSessions } value = {sessionIndex} name = "Player" placeholder = "Select Session" onChange = { sessionChanged } openMenuOnClick = { true } />

        {selectedUserSession.data !== undefined &&
          <TrackingMasterSession
            session = { selectedUserSession }
          />
        }

      </div>

    </div>

  ) ;
} ;

export default TrackingMaster ;