import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {  ActivityIndicator ,StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

const {width:SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "e3e622ab8222e942b657a6a293cad77c";

export default function App() {
  const [city, setCity] = useState('Loading...')
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  
  const getWeather = async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    //사용자가 위치정보 제공을 거부한 경우
    if(!granted){
      setOk(false)
    }
    //사용자의 위치정보 가져오기
    const {
      coords: {latitude, longitude}
    } = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude,longitude},{useGoogleMaps:false}
    );
    setCity(location[0].region);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`)
    const json = await response.json();
    // console.log(json)
    setDays(json.daily);
  };
  
  useEffect(()=>{
    getWeather();
  },[])


  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.weather}>
        {/* <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View> */}
        {
          days.length === 0? (
            <View style={styles.day}>
              <ActivityIndicator color="white" style={{marginTop:10}} size="large"/>
            </View>) : (
              days.map((day,index)=>{
                <View key={index} style={styles.day}>
                  {/* <Text style={styles.temp}>{day.temp.day}</Text> */}
                  {/* <Text style={styles.description}>{day.weather[0].main}</Text> */}
                </View>
              })
            )
        }
      </ScrollView>
      <StatusBar style="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:"tomato"
  },
  city:{
    flex:1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName:{
    fontSize:48,
    fontWeight: "500"
  },
  weather:{
  },
  day:{
    flex:1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp:{
    fontSize: 158,
  },
  description:{
    marginTop: -30,
    fontSize: 60,
  },
});
