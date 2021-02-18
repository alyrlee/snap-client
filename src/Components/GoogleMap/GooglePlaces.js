import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';
import Geocode from 'react-geocode';
Geocode.setApiKey("AIzaSyDPpPhiwe2nBilWB_ihli85BlyRID4DnpU");
Geocode.enableDebug();

const mapStyles = {
  width: "100%",
  height: "100%",
};

export class MapContainer extends Component {
  state = {
    term: '',
    SnapLocationsList: {},
    places: [],
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
    stores: {},
    address: '',
    city: '',
    area: '',
    state: '',
    // markerPosition: {
    //   lat: 0,
    //   lng: 0
    // },
    // mapPosition: {
    //     lat: 0,
    //     lng: 0
    // },     
    // coords for Boston
    coordinates: {
        lat: 42.3600825,
        lng: -71.0588801
    }  
  };
 
  componentDidMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                mapPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
                markerPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
            },
                () => {
                    Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                        response => {
                            console.log(response)
                            // debugger;
                            const address = response.results[0].formatted_address,
                                addressArray = response.results[0].address_components,
                                city = this.getCity(addressArray),
                                area = this.getArea(addressArray),
                                state = this.getState(addressArray);
                            console.log('city', city, area, state);
                            this.setState({
                                address: (address) ? address : '',
                                area: (area) ? area : '',
                                city: (city) ? city : '',
                                state: (state) ? state : '',
                            })
                        },
                        error => {
                            console.error(error);
                        }
                    );

                })
        });
    } else {
        console.error("Geolocation is not supported by this browser!");
    }
  };

//get all locations from db


//get list of snap locations for Boston 
  // setSnapLocationsList() {
  //   const data =[
  //     {
  //       // x   |     y      | objectid |                     store_name                     |                address                | address_line__2 |  city  | state | zip5 | zip4 | county  |  longitude  |  l
  //       // -71.0622020 | 42.3649290 |     4030 | 7-eleven 32476C                                    | 91 Causeway St                        | 91-99           | Boston | MA    | 2114 | 1308 | SUFFOLK | -71.0622020 | 42.3649290 | 2020-12-15 02:22:00-05
  //       X: -71.0622020,
  //       Y: 42.36492920,
  //       objectid: 4030,
  //       store_name: '7-eleven 32476C',
  //       address: '91 Causeway St',
  //       city: 'Boston',
  //       state: 'MA'  
  //     },
  //     {
  //       // x   |     y      | objectid |                     store_name                     |                address                | address_line__2 |  city  | state | zip5 | zip4 | county  |  longitude  |  l
  //       // -71.0622020 | 42.3649290 |     4030 | 7-eleven 32476C                                    | 91 Causeway St                        | 91-99           | Boston | MA    | 2114 | 1308 | SUFFOLK | -71.0622020 | 42.3649290 | 2020-12-15 02:22:00-05
  //       X: -71.0622021,
  //       Y: 42.36492922,
  //       objectid: 4031,
  //       store_name: '8-eleven 32476C',
  //       address: '93 Causeway St',
  //       city: 'Boston',
  //       state: 'MA'  
  //     }
  //   ]

  //   this.setState({     
  //     setSnapLocationsList: {data}
  //    })
  //    console.log('get data', data);
  // }

  getCity = (addressArray) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
            city = addressArray[i].long_name;
            return city;
        }
    }
  };

  getArea = (addressArray) => {
      let area = '';
      for (let i = 0; i < addressArray.length; i++) {
          if (addressArray[i].types[0]) {
              for (let j = 0; j < addressArray[i].types.length; j++) {
                  if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                      area = addressArray[i].long_name;
                      return area;
                  }
              }
          }
      }
  };

  getState = (addressArray) => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                state = addressArray[i].long_name;
                return state;
            }
        }
    }
  };

onChange = (event) => { event.preventDefault();
  this.props.onChange(this.state.data);
};


onInfoWindowClose = (event) => { };

onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
        newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then(
        response => {
            const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);
            this.setState({
                address: (address) ? address : '',
                area: (area) ? area : '',
                city: (city) ? city : '',
                state: (state) ? state : '',
                markerPosition: {
                    lat: newLat,
                    lng: newLng
                },
                mapPosition: {
                    lat: newLat,
                    lng: newLng
                },
            })
        },
        error => {
            console.error(error);
        }
    );
  };
  
//allow load place and configure search to load snap locations\//snapLocationsList is an object that contains an array of store information to display to the user as markers on the google map.
//pass snapLocationsList as a prop
//make request to API to get store location data, pass via component 

  snapLocationsList = (stores) => (
    <ul>{stores && stores.map(Store_Name => <li key={Store_Name.objectid}>{Store_Name.objectid}</li>)}</ul>
  );
  
  onPlaceSelected = ( place ) => {
    console.log('plc', place);
    const {geometry} = place;
    if (geometry) {
      const {location} = place.geometry;
      if (location) {
        this.setState({
          coordinates: {
            lat: location.lat(), 
            lng: location.lng()
          }
        });
      }
    }
  }
// ---
// {stores.map((snapLocationsList) => (
//   <Marker
//     key={object.id}
//     text={place.name}
//     lat={place.geometry.location.lat}
//     lng={place.geometry.location.lng}
  // />  
  // markers.push(
  //   new google.maps.Marker({
  //     map,
  //     icon,
  //     title: place.name,
  //     position: place.geometry.location,
  //   })
  // );

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  createMarker = (location) => {
    console.log('pull all snap locations', location);
    return (
      <Marker 
        key={`${location.Latitude}${location.Longitude}`}
        id={location.objectid}
        google={this.props.google}
        onClick={this.onMarkerClick}
        position={{ lat: location.Latitude, lng: location.Longitude }}
        name={'Current Location'}
        draggable={true}
        onDragEnd={this.onMarkerDragEnd} />
    ) 
  }
    
//add data from state onto map with address, city , etc....
  render() {
    // if (!this.props.loaded) return <div>Loading...</div>;
    console.log('data loading', this.props.snapLocationsList);
    // console.log('ML SLL:', this.state.snapLocationsList);
    return (
      <Map
      //change the key to force lat,lng to re-render a new key 
           key={this.state.coordinates.lat+this.state.coordinates.lng} 
           google={this.props.google}
           zoom={12}
           style={mapStyles}
           center={
            {
              lat: this.state.coordinates.lat,
              lng: this.state.coordinates.lng
            }
          }
            onClick={this.onMapClicked}
            onReady={this.onMapReady} 
            stores ={this.state.stores} 
            // visible={false}
      >

       {this.props.markers.map(mark => this.createMarker(mark))}
       {/* <Marker 
          google={this.props.google}
          markers={this.props}
          onClick={this.onMarkerClick}
          name={'Current Location'}>
       </Marker> */}
        <Marker
          title={'The marker`s title will appear as a tooltip.'}
          name={'Dollar tree'}
          position={{lat: 32.396797, lng: -82.055046}} />
        <Marker
          name={'Meijer Gas Station'}
          position={{lat: 42.3325693, lng: -83.405739}} />
        <Marker />
        {/* <Marker
          name={'Mercados'}
          position={{lat: 39.526478, lng: -122.19395}}
          icon={{
            url: "/path/to/custom_icon.png",
            // anchor: new google.maps.Point(32,32),
            // scaledSize: new google.maps.Size(64,64)
          }} /> */}
         {/* <Marker 
            onClick={this.onMarkerClick}
            name={'Current location'}
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            // position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
        /> */}
      <Autocomplete
           placeholder='Search'
           fields= {['']}
          //  ref={input => this.search = input}
          //  input id="searchTextField"
           style={{
              width: '100%',
              height: '25px',
              paddingLeft: '16px',
              // marginTop: '2px',
              marginBottom: '100px'
            }}
           onPlaceSelected={ this.onPlaceSelected }
           types={['(cities)']}
           componentRestrictions={{country: 'us'}}
           onChange={e => this.setState({ term: e.target.value })}
           onClick={(stores, places, snapLocationsList, details = null) => {

            // 'details' is provided when fetchDetails = true
            console.log('stores and details!!', stores, places, snapLocationsList, details);
          }}
           term={{
              key: 'AIzaSyDPpPhiwe2nBilWB_ihli85BlyRID4DnpU',
              language: 'en'
              // search: 'value'
          }}
      />    
        {/* <InfoWindow
            marker={this.state.activeMarker}
            onOpen={this.windowHasOpened}
            onClose={this.windowHasClosed}
            visible={this.state.showingInfoWindow}>
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
              </div>
        </InfoWindow> */}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDPpPhiwe2nBilWB_ihli85BlyRID4DnpU"
  // `${process.env.API_KEY}`
})(MapContainer);