import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';

export default class App extends React.Component {
  state = {
    userLocation: null,
    userPlaces: []
  }

  getUserLocationHandler = () =>  {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0300,
          longitudeDelta: 0.0200
        }
      });
      fetch('https://everything-bikes-1529817353923.firebaseio.com/places.json', {
        method: 'POST',
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    }, err => console.log(err));
  }

  getUserPlacesHandler = () => {
    fetch('https://everything-bikes-1529817353923.firebaseio.com/places.json')
    .then(res => res.json())
    .then(parsed => {
      const placesArray = [];
      for (const key in parsed) {
        placesArray.push({
          latitude: parsed[key].latitude,
          longitude: parsed[key].longitude,
          id: key
        });
      }
      this.setState({
        userPlaces: placesArray
      });
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.getPlaces}>
          <Button title="Get User Places" onPress={this.getUserPlacesHandler} />
        </View>
        <View style={styles.fetchLocation}>
          <FetchLocation onGetLocation={this.getUserLocationHandler} />
        </View>
        <UsersMap userLocation={this.state.userLocation} usersPlaces={this.state.userPlaces}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  getPlaces: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16
  },
  fetchLocation: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    right: 0
  }
});
