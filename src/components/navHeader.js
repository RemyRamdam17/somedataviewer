import React from 'react' ;
import { Link, NavLink } from 'react-router-dom' ;
import { auth } from '../functions/firebase.js' ;
import '../styles/navHeader.css' ;

import { push as Menu } from 'react-burger-menu' ;


const NavHeader = ( { history } ) => {

    return (
        <>
            <div className = 'navHeaderLandscape'>

                <ul className = 'navHeaderList' >
                    <li className = 'navEntry'><Link to="/live"><div className = "navLabel"><p>Live</p></div></Link></li>
                    <li className = 'navEntry'><Link to="/beatmaster"><div className = "navLabel"><p>Beat Master</p></div></Link></li>
                    <li className = 'navEntry'><Link to="/trackingmaster"><div className = "navLabel"><p>Tracking Master</p></div></Link></li>
                </ul>

                <button
                    onClick = { () => { auth.signOut().then(() => history.push('/login')) }}
                    className = "navSignOut"
                >
                    Sign out
                </button>

            </div>

            <div className = 'navHeaderPortrait'>

                <Menu
                    width = {'100%'}
                    htmlClassName = { 'burgerMenuhtmlClassName' }
                    bodyClassName = { 'burgerMenuBodyClassName' }
                >
                    <ul className = 'burger-item-list' >
                        <li className = 'burger-item'><Link to="/live"><p className = 'burger-item-text'>Live</p></Link></li>
                        <li className = 'burger-item'><Link to="/beatmaster"><p className = 'burger-item-text'>Beat Master</p></Link></li>
                        <li className = 'burger-item'><Link to="/trackingmaster"><p className = 'burger-item-text'>Tracking Master</p></Link></li>
                        <li className = 'burger-item'><a onClick={ () => { auth.signOut().then(() => history.push('/login')) } } href=""><p className = 'burger-item-text'>Sign out</p></a></li>
                    </ul>
                </Menu>
                
            </div>
        </>

    ) ;
} ;

export default NavHeader ;