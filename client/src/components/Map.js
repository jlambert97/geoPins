import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import PinIcon from './PinIcon'
import Context from '../context'
import Blog from './Blog'
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: -25.4214365,
  longitude:-49.2428963,
  zoom: 13
}

const INITIAL_VIEWSTYLE = 'mapbox://styles/mapbox/streets-v9'

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [viewstyle, setViewstyle] = useState(INITIAL_VIEWSTYLE)
  const [userPosition, setUserPosition] = useState(null)
  const { state, dispatch } = useContext(Context)

  useEffect(() => {
    getUserPosition()
  }, [])

  const getUserPosition = () => {
    if("geolocation" in navigator) {
      navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({...viewport, latitude, longitude})
        setUserPosition({latitude, longitude})
      }, PositionError => {
        console.error(PositionError)
      })
    }
  }

  const handleMapClick = ({lngLat, leftButton}) => {
    if (!leftButton) return 
    if(!state.draft) {
      dispatch({type: "CREATE_DRAFT"})
    }
    const [longitude, latitude] = lngLat
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    })
  }

  return (
    <div className={classes.root}> 
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1Ijoiam9hb2xhbWJlcnQ5NyIsImEiOiJjanloYjg5NmMwYTJjM21ydzQ4d2U5eXRhIn0.y_g8w49tS3BOeZSdNgcIKQ"
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle={viewstyle}
        onViewportChange={newViewPort => setViewport(newViewPort)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Controle de navegação */}
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={newViewPort => setViewport(newViewPort)}
          />
          <div>
            <button title="Satelite" onClick={() => setViewstyle("mapbox://styles/mapbox/satellite-v9")}>Sat</button>
          </div>
          <div>
            <button title="Rua" onClick={() => setViewstyle("mapbox://styles/mapbox/streets-v9")}>Rua</button>
          </div>
        </div>

        {/* Pin da posicao atual */}
        {userPosition && (
          <Marker
            offsetLeft={-20}
            offsetTop={-37}
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
          >
            <PinIcon size={40} color="red"/>
          </Marker>
        )}

        {/* Pin clicado no mapa */}
        {state.draft && (
          <Marker
          offsetLeft={-20}
          offsetTop={-37}
          latitude={state.draft.latitude}
          longitude={state.draft.longitude}
        >
          <PinIcon size={40} color="hotpink"/>
        </Marker>
        )}
      </ReactMapGL>

      {/* Espaço lateral para editar pin  */}
      <Blog />
    </div>
  )
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
