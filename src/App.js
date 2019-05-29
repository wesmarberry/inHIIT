import React, {Component} from 'react';
import './App.css';
import WorkoutList from './WorkoutList/WorkoutList';
import WeatherAside from './WeatherAside/WeatherAside';
import WeatherForecast from './WeatherForecast/WeatherForecast';
import UserLogin from './UserLogin/UserLogin';

// Admin Username is 'Adam' and password is '123'

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/


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
        lat: 41.8781,
        long: -87.6298,
        city: 'Chicago',  
        isLogged: false,
        loggedUser: '',
        loggedUserId: '',
        logFailMsg: '',
        latLong: '',
        showWeather: false,
        workouts: [],
        workoutToEdit: {
          id: null,
          name: '',
          intervalone: 0,
          intervaltwo: 0,
          cycles: 0
      },  
      }
      
    }

    componentDidMount = async () => {
    //   navigator.geolocation.getCurrentPosition((data) => {
    //   const latLong = data
    //   console.log(latLong);
    //   this.setState({
    //     latLong: latLong
    //   })
    // })

    //   if (this.state.latLong.coords.latitude !== 0) {
    //     this.setState({
    //       city: 'Your location',
    //       lat: this.state.latLong.coords.latitude,
    //       lng: this.state.latLong.coords.longitude
    //     })      
        
    //   } else {
    //     this.setState({
    //       lat: 41.8781,
    //       long: -87.6298,
    //       city: 'Chicago'
    //     })
    //   }

      this.getWeather();
      this.getWorkouts();
      
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
          document.getElementsByTagName('body')[0].setAttribute('class', icon);
        }
      })
    }

    createUser = async (formData, e) => {
      e.preventDefault();


      try {
          const createdUser = await fetch(process.env.REACT_APP_API_CALL + 'users', {
              method: 'POST',
              credentials: 'include',
              body: JSON.stringify(formData),
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const parsedResponse = await createdUser.json();
          //   if(parsedResponse !== 'User name not available'){
          //     this.setState({
          //       isLogged: true,
          //       loggedUser: parsedResponse.username,
          //       loggedUserId: parsedResponse.id,
          //   })
          // } else {
          //   this.setState({
          //     logFailMsg: 'User name not available'
          //   })
          // }

          await this.setState({
            isLogged: true,
            loggedUser: parsedResponse.username,
            loggedUserId: parsedResponse.id
          })
          await this.getWorkouts();
      } catch(err) {
          console.log(err)
      }
      
  }

  loginUser = async (formData, e) => {
      e.preventDefault();
      console.log(process.env.REACT_APP_API_CALL);
      try {
        const loginUser = await fetch(process.env.REACT_APP_API_CALL + 'users/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
        }
        })
        const parsedResponse = await loginUser.json();
        console.log(parsedResponse);
        if(parsedResponse.message === "Invalid Credentials"){
          this.setState({
            logFailMsg: 'Username or Password Incorrect'
          })
          
        } else {
          this.setState({
            isLogged: true,
            loggedUser: parsedResponse.username,
            loggedUserId: parsedResponse.id,
            logFailMsg: '',
          })
          this.getWorkouts();
        }
      } catch(err) {
        console.log(err);
      }

  }

  logoutUser = async () => {
    try {
      const logoutUser = await fetch(process.env.REACT_APP_API_CALL + 'users/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
      })

      
      console.log(logoutUser, 'this is parsed response')

      this.setState({
        isLogged: false,
        loggedUser: '',
        loggedUserId: ''
      })
    } catch(err) {
        console.log(err);
    }
    this.getWorkouts();
  }

  getWorkouts = async () => {

    try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'workouts', {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
        }
      })

      const parsedResponse = await response.json();
      console.log('==================');
      console.log(parsedResponse);
      console.log('==================');
      console.log(this.state);
        if(response.status !== 200){
            throw(Error(response.statusText));
        }

           
        if(this.state.isLogged){
            const workoutArr = parsedResponse;
            const userWorkouts = workoutArr.filter((workout) => workout.user.id.toString() === this.state.loggedUserId.toString());
            this.setState({
                workouts: userWorkouts
            })

        } else {
          const adminUserId = '5cddbea066a0da8bcea93c44';
          const workoutArr = parsedResponse;
          // const userWorkouts = workoutArr.filter((workout) => workout.user.toString() === adminUserId.toString());
          
            this.setState({
                workouts: workoutArr
            })
            
        }
        
    } catch(err) {
        console.log(err);
    }

}

  createWorkout = async (formData, e) => {
    e.preventDefault();
    try {
        const createdWorkout = await fetch(process.env.REACT_APP_API_CALL + 'workouts', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const parsedResponse = await createdWorkout.json();
        console.log(parsedResponse);
        this.setState({workouts: [...this.state.workouts, parsedResponse]})

    } catch(err) {
        console.log(err)
    }
  }

  deleteWorkout = async (deletedWorkoutID) => {
    console.log(deletedWorkoutID);
    try{
        const deleteWorkout = await fetch(process.env.REACT_APP_API_CALL + 'workouts/' + deletedWorkoutID, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(deleteWorkout.status);
        if(deleteWorkout.status === 200){
          console.log('hit deleted workout');
            // this.setState({
            //     workouts: this.state.workouts.filter(workout => workout.id !== deletedWorkoutID)
            // })
            this.getWorkouts();
        }


    } catch(err) {
        console.log(err);
    }

  };

  editWorkout = async (e) => {
    e.preventDefault();
    try {
        const updateWorkout = await fetch(process.env.REACT_APP_API_CALL + 'workouts/' + this.state.workoutToEdit.id + '/edit', {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(this.state.workoutToEdit),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const parsedResponse = await updateWorkout.json();
        console.log(parsedResponse);
        const editedWorkoutArr = this.state.workouts.map((workout) => {
            if(workout.id === this.state.workoutToEdit.id){
                workout = parsedResponse
            }
            return workout
        });

        this.setState({
            workouts: editedWorkoutArr,
        });

    } catch(err) {
        console.log(err)
    }        
  };

  handleFormChange = (e) => {
    this.setState({
        workoutToEdit: {
            ...this.state.workoutToEdit, 
            [e.target.name]: e.target.value
        }
    })
  }

  modalShows = (thisOne) => {
    this.setState({
        workoutToEdit: thisOne
    })
  }

  showWeather = () => {
    document.getElementById('forecast').setAttribute('id', 'forecast1');
    document.getElementById('otherForecast').setAttribute('id', 'otherForecast1');
    document.getElementById('show-button').setAttribute('id', 'show-button1');
    document.getElementById('hide-button').setAttribute('id', 'hide-button1');
  }

  hideWeather = () => {
    document.getElementById('forecast1').setAttribute('id', 'forecast');
    document.getElementById('otherForecast1').setAttribute('id', 'otherForecast');
    document.getElementById('show-button1').setAttribute('id', 'show-button');
    document.getElementById('hide-button1').setAttribute('id', 'hide-button');
  }

  render(){
      return (
        <div id='app' className='App flex-container'>
          <div className='logo-div'>
          <div>
            <img className='logo' src={require('./images/inHIIT_logo.png')} alt='logo'></img>
            <div className='version'>
              <p>Version 2.0</p>
            </div>
          </div>
            <WeatherForecast weatherData={this.state.weather} weatherSearch={this.weatherSearch}/>              
          </div>

          

          <div className='main-flex-container'>             
            <div className='workout-container'>
            <WorkoutList isLogged={this.state.isLogged} modalShows={this.modalShows} editWorkout={this.editWorkout} workouts={this.state.workouts} createWorkout={this.createWorkout} deleteWorkout={this.deleteWorkout} handleFormChange={this.handleFormChange}/> 
            </div>            
            <div className='aside-container'>
            <div className='button-container'>
              <div>
              <p className='failure'>{this.state.logFailMsg}</p>
                {this.state.isLogged ? <p className='login'>Welcome, {this.state.loggedUser}! </p> : null}
                {this.state.isLogged ? <button onClick={this.logoutUser} className='newButton loginModalButton'>Logout</button>
                :
                <UserLogin createUser={this.createUser} loginUser={this.loginUser} buttonLabel={'Login/Register'}/>}
              </div>
              <div className='show-weather-div'>
                <button id='show-button' className='newButton show-weather loginModalButton btn btn-secondary' onClick={this.showWeather}>Show Weather</button>
                <button id='hide-button' className='newButton show-weather loginModalButton btn btn-secondary' onClick={this.hideWeather}>Hide Weather</button>
              </div>
            </div>
              <div id="otherForecast">
                {this.state.forecast ? <WeatherAside  forecast={this.state.forecast}/> : null}
                
              </div>
            </div>           
          </div>
        </div>
      )
  }
}

export default App;
