import React from 'react' ;
import { Route, Redirect } from 'react-router-dom' ;

export const PrivateRoute = ({ component : Comp, loggedIn, path, ...rest}) => {

    return (
        <Route
            path = { path }
            {...rest}
            render = { (props ) => {
                    return loggedIn ?
                        <Comp {...props} />
                        :
                        <Redirect
                            to = {{
                                pathname : "/login",
                                state : { from : props.location },
                                error : "You need to log in first !"
                            }}
                        />
                }
            }
        />
    )
}
  