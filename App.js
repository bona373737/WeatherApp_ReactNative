import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Fontisto } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {  ActivityIndicator ,StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

const {width:SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "e3e622ab8222e942b657a6a293cad77c";
const icons ={
  Clouds:"cloudy",
  Clear:"day-sunny",
  Atmosphere:"cloudy-gusts",
  Snow:"snow",
  Rain:"rains",
  Drizzle:"rain",
  Thunderstorm: "lightning",
};

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

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
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
        {
          days.length === 0? (
            <View style={styles.day}>
              <ActivityIndicator color="white" style={{marginTop:10}} size="large"/>
            </View>
            ) : (
              days.map((day,index)=>{
                return(
                // <View key={index} style={{...styles.day,alignItems:"center"}}>
                <View key={index} style={styles.day}>
                  <View style={styles.temp_wrap}>
                    <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                    <Fontisto name={icons[`${day.weather[0].main}`]} size={68} color="white" />
                  </View>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                </View>)
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
    backgroundColor:"teal",
  },
  city:{
    flex:1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName:{
    fontSize:50,
    fontWeight: "600",
    color: "white"
  },
  weather:{
  },
  day:{
    flex:1,
    width: SCREEN_WIDTH,
    padding: 20,
  },
  temp_wrap :{
    width:"100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  temp:{
    fontSize: 100,
    color: "white",
  },
  description:{
    marginTop: -20,
    fontSize: 40,
    color: "white",
  },
  tinyText:{
    color:"white"
  }
})
