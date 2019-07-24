import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { GraphQLClient } from 'graphql-request'
import { GoogleLogin } from 'react-google-login'
import Context from '../../context'
import { ME_QUERY } from '../../graphql/queries'

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context)
  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: { authorization: idToken } 
      })
      const data = await client.request(ME_QUERY)
      dispatch({type: "LOGIN_USER", payload: data.authenticated})
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn()})
    } catch (err) {
      onFailure(err)
    }

  }

  const onFailure = err => {
    console.error("Error logging in", err)
  }

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{color: "rgb(66,133,244)"}}>
        Welcome
      </Typography>
      <GoogleLogin 
        clientId="570591330068-b3h868cn5rc16ilomus9mvltavui7ddb.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        theme="dark"
        isSignedIn={true}
        buttonText="Login with Google"
      />
    </div>) 
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
