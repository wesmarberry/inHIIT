import React, {Component} from 'react';

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/

class WeatherForecast extends Component {
    constructor(){
        super();
        this.state = {
            zipCode: null
        }
    }

    updateState = (e) =>{
        e.preventDefault();
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    render(){
        
        return(
            <div id='forecast' className='flex-container'>
                
                <div className='weather-div city'>
                    <p className='weather-title'>{this.props.weatherData.city}, {this.props.weatherData.currentSummary}</p>           
                    <form onSubmit={(e) => {
                        this.props.weatherSearch(e, this.state.zipCode)
                    }}>
                    <input onChange={this.updateState} type='text' name='zipCode' placeholder='zip code'/>
                    <button type='submit'>Submit</button> 
                    </form>
                </div>

                <div className='weather-div'>                
                    <h1 id='temp' >{this.props.weatherData.temp}°</h1>
                </div>                    
                
            </div>
        )
    }
};

export default WeatherForecast;


