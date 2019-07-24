import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { GoogleLogout } from 'react-google-login'
import Context from '../../context'

const Signout = ({ classes }) => {
  const { dispatch } = useContext(Context)

  const onSignout = () => {
    dispatch({ type: "SIGNOUT_USER" })
    console.log('xaxa')
  }

  return (
    <button onClick={onSignout} className={classes.buttonTransparent}>
      <GoogleLogout
        onLogoutSuccess={() => onSignout}
        render={({ onClick }) => (
          <span className={classes.root}>
            <Typography
              variant="body1"
              className={classes.buttonText}
            >
              Signout
            </Typography>
            <ExitToAppIcon className={classes.buttonIcon} />
          </span>
        )}
      />
    </button>
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  },
  buttonTransparent: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderColor: 'rgba(0,0,0,0.0)'
  }
};

export default withStyles(styles)(Signout);
