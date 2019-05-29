import React, {Component} from 'react';

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/

class TimerApp extends Component {
    constructor(){
        super();
        this.state = {
            seconds: 0,
            intervalEnd: 0,
            cycles: 0,
            interval: null,
            whichInterval: 'Press Start To Begin',
            victoryMessage: ''
        }    
    }

    componentDidMount = () => {
        this.setState({
            seconds: 0,
            intervalEnd: this.props.workout.intervalone,
            cycles: 0
        })
    }

    secondsGoUp = () => {
            if(this.state.cycles === (this.props.workout.cycles * 2)){
                document.getElementById(`image${this.props.index}`).classList.toggle('hidden');
                clearInterval(this.state.interval);
                this.setState({
                    seconds: null,
                    victoryMessage: 'Crushed It!',
                    cycles: 199
                })
            }else if(this.state.seconds < this.state.intervalEnd){
                const newSeconds = this.state.seconds + 1;
                this.setState({
                    seconds: newSeconds
                })
            } else if(this.state.cycles % 2 === 0 && this.state.seconds === this.state.intervalEnd){
                const newCycles = this.state.cycles + 1;
                this.setState({
                    seconds: 0,
                    intervalEnd: this.props.workout.intervaltwo,
                    cycles: newCycles,
                    whichInterval: 'Rest'
                    
                })            
            } else if(this.state.cycles % 2 !== 0 && this.state.seconds === this.state.intervalEnd){
                const newCycles = this.state.cycles + 1;
                this.setState({
                    seconds: 0,
                    intervalEnd: this.props.workout.intervalone,
                    cycles: newCycles,
                    whichInterval: 'Exercise!'
                })
            }        
    }

    timer = () => {
        this.setState({
            interval: setInterval(this.secondsGoUp, 1000),
            whichInterval: 'Exercise!'
        })
    }

    pause = () => {
        clearInterval(this.state.interval);
    }

    randomImage = () => {
        const imageArr = ['../../images/crushed_it.png'];
        return imageArr[Math.floor(Math.random() * imageArr.length)];
        
    }

    resetTimer = () => {
        document.getElementById(`image${this.props.index}`).classList.toggle('hidden');
        this.setState({
            seconds: 0,
            intervalEnd: 0,
            cycles: 0,
            interval: null,
            whichInterval: 'Exercise!',
            victoryMessage: ''
        })
    }

    render(){
        return(
            <div className='flex-container' id={this.props.timerID}>
                <div>
                    <div id='timer-div' className='timer'>
                        <p>Set: {Math.floor(this.state.cycles / 2)  + 1}</p>
                        <p>{this.state.whichInterval}</p>
                        <h1>{this.state.seconds}</h1>
                        <img onClick={this.resetTimer} id={`image${this.props.index}`} className='hidden victoryImg' src={require('../../images/crushed_it.png')} alt='name' />
                    </div>
                    <div className='flex-container'>
                        <button onClick={this.timer} className='start-button'>Start</button>
                        <button onClick={this.pause} className='stop-button'>Pause</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TimerApp;

