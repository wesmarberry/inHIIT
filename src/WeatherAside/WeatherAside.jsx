import React, {Component} from 'react';
import Forecast from './Forecast/Forecast'

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/

class WeatherAside extends Component {
    

    render(){
        return(
            <div id='weather-aside' className='flex-container'>
                <h1 className='weather-title'>8 Day Forecast</h1>
                {this.props.forecast? <Forecast forecast={this.props.forecast}/> : null}
            </div>
        )
    }
}



export default WeatherAside;