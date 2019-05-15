import React, {Component} from 'react';
import './App.css';
import WorkoutContainer from './WorkoutContainer/WorkoutContainer';
import WeatherAside from './WeatherAside/WeatherAside';
import WeatherForecast from './WeatherForecast/WeatherForecast';
import UserLogin from './UserLogin/UserLogin';

class App extends Component {
    constructor(){
      super();
      this.state = {
        weather: {
            temp: null,
            currentSummary: '',
            dailyOutlook: '',            
        },        
        forecast: null,
        lat: 39.7392,
        long: -104.9903,
        city: 'Denver',        
      }
    }

    componentDidMount(){      
      this.getWeather();
    }

    weatherSearch = async (e, zipCode) => {
      e.preventDefault();      
      try{
          const response = await fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address="${zipCode}"&key=AIzaSyDVPLLlJAQ679Frd0gu11khJ9mW02wsvWQ`);
          if(response.status !== 200){
              throw(Error(response.statusText));
          }
          const parsedResponse = await response.json();

          this.setState({
              lat: parsedResponse.results[0].geometry.location.lat,
              long: parsedResponse.results[0].geometry.location.lng,
              city: parsedResponse.results[0].address_components[1].long_name
          })
      } catch(err){
          console.log(err);
      }      
      this.getWeather(); 
  }

    getWeather = async () => {

        try {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8a94adc7152ba66046780b53e6b95709/${this.state.lat},${this.state.long}`);

            if(response.status !== 200){
                throw(Error(response.statusText));
            }
            const parsedWeather = await response.json();
            const forecastArray = [];
            parsedWeather.daily.data.forEach((day) => {
                //console.log(parsedWeather.currently.icon);
                forecastArray.push({
                    summary: day.summary,
                    precipProb: day.precipProbability,
                    precipType: day.precipType,
                    tempHigh: day.temperatureHigh,
                    tempLow: day.temperatureLow,
                    unixTime: day.time
                    
                })
            })

            this.setState({
                weather: {
                    temp: parsedWeather.currently.temperature,
                    currentSummary: parsedWeather.currently.summary,
                    dailyOutlook: parsedWeather.daily.summary,
                    city: this.state.city,
                    icon: parsedWeather.currently.icon
                },
                forecast: forecastArray
            })

            this.setBackground();

        } catch(err) {
            console.log(err);
        }
    }

    setBackground = () => {
      const currentIcon = this.state.weather.icon;
      const iconArr = ['clear-day', 'clear-night', 'rain', 'snow', 'sleet', 'wind', 'fog', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night'];

      iconArr.forEach((icon) => {
        if(icon === currentIcon){
          document.getElementsByTagName("body")[0].setAttribute("class", icon);
        }
      })
    }


    render(){
        return (
          <div id="app" className="App flex-container">
            <div className='logo-div'>
            <div>
              <img className='logo' src={require('./images/inHIIT_logo.png')} alt="logo"></img>
            </div>
              
              <WeatherForecast weatherData={this.state.weather} weatherSearch={this.weatherSearch}/>
              
            </div>
            <UserLogin buttonLabel={'Login/Register'}/>
            <button className="newButton loginModalButton">Logout</button>
            
            <div className="main-flex-container">             
              <div className="workout-container">
                <WorkoutContainer setForcast={this.setForecast}/>
              </div>            
              <div className="aside-container">
                {this.state.forecast ? <WeatherAside  forecast={this.state.forecast}/> : null}
              </div>           
            </div>
          </div>
        )
    }
}

export default App;
