// eslint-disable-next-line
import * as React from 'react';
import axios from "axios";
import {render} from 'react-dom';
import Map, {Popup,Marker} from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon  from '@mui/icons-material/Star';
import "./app.css";
import { format } from "timeago.js";
import Register from "./components/register"
import Login from "./components/login"

import 'mapbox-gl/dist/mapbox-gl.css';


export default function App() {
  const myStorage = window.localStorage;
  const [showPopup, setShowPopup] = React.useState(true);
  const [viewPort, setViewPort] = React.useState({
    latitude: 28.7439185,
    longitude:77.1923635,
    zoom: 5
  })
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [star, setStar] =React.useState(0);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);




//getting the pIns from the backend database using Axios
//at the beginning of the program


 React.useEffect(()=>{
const getPins = async()=>{
  try{
    const res = await axios.get("/Pins");
    setPins(res.data);
  }catch(err){
    console.log("hjhhhhjjjjjjjjjjj");
  }
 
};
getPins();
console.log(pins);
 },[]);



const handleLogout =()=>{
  setCurrentUser(null)
  myStorage.removeItem("user");
}

  
   const handleMarkerClick = (id) => {
     setCurrentPlaceId(id);
   }

   const handleDoubleClick = (e) => {
    const coordinates = e.lngLat;

    setNewPlace({
      lng: coordinates.lng,
      lat: coordinates.lat,
    });

 
console.log(newPlace);

   }


   const handleSubmit = async (e)=>{
     e.preventDefault();
     const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try{
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    }
    catch(err){
      console.log(err);
    }
   }

  return (
    <Map
      initialViewState={viewPort}

      style={{ height: "100vh", width: "100%" }}

      mapStyle="mapbox://styles/mapbox/streets-v9"

      mapboxAccessToken={"pk.eyJ1Ijoic2F0eWFta3VtYXIwNDE0IiwiYSI6ImNsMmh6aHd5NzAwNW4zcHFuOG80Z2hiOHUifQ.Q1rQ1qKd5_1QiPXwJa9B2A"}
     
      onDblClick= {handleDoubleClick}
      onViewportChange={(viewPort) => setViewPort(viewPort)}
      
    >
      {pins.map(p=>(

<>
   <Marker 
   longitude={p.long}
    latitude={p.lat} 
    anchor="bottom"
    offsetLeft={-3.5 * viewPort.zoom}
              offsetTop={-7 * viewPort.zoom}
    >
  <LocationOnIcon style={{fontSize: viewPort.zoom*7, color: p.username === currentUser?"tomato": "slateblue",cursor: "pointer",}}
  
  onClick={() => handleMarkerClick(p._id)}

  />
   </Marker>
{p._id === currentPlaceId &&(
<Popup latitude={p.lat} longitude={p.long}

        anchor="top"
        closeOnClick ={false} 
        onClose={ ()=>setCurrentPlaceId(null)}
        >
      <div className='card'>
      <label> Place</label>
      <h4 className= "place">{p.title}</h4>
      <label> Review</label>
      <p className='desc'>{p.desc}</p>
      <label> Rating</label>
       <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
      <label> Information</label>
         <span className="username">
         Created by <b>{p.username}</b>

         </span>
         <span className="date">{format(p.createdAt)}</span>

      </div>
      </Popup>
      )}
      </>
      ))}
      
      {newPlace &&(
     <Popup
              latitude={newPlace.lat}
              longitude={newPlace.lng}
              closeButton={true}
              closeOnClick={false}
               onClose={() => setNewPlace(null)}
               anchor="left" 
             
            >
             <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup> 
            )}
            {currentUser ? (
          <button className="button logout" onClick={handleLogout}> 
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login"  onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
         

          </div>
          
        )}
        {showRegister &&(<Register setShowRegister={setShowRegister}/>)}
          {showLogin &&(<Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} myStorage={myStorage}/>)}

          

    </Map>
  );
}
