import React from 'react';
import NewWorkout from './NewWorkout/NewWorkout';
import EditWorkout from './EditWorkout/EditWorkout';
import TimerApp from './TimerApp/TimerApp';

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/

const WorkoutList = (props) => {
    
    const toggleClass = (index) => {
        document.getElementById(index).classList.toggle('hidden');
        document.getElementById(index).classList.toggle('start');
        document.getElementById(`timer${index}`).classList.toggle('drop-animation');
    }

    console.log(props);
    const workouts = props.workouts.map((workout, index)=> {
        return(
            <div className="workout-div flex-container" key={workout.id}>
                    <div>
                        <h2>{workout.name}</h2>
                    </div>
                    <div>
                        <p>Interval One: {workout.intervalone}</p>
                        <p>Interval Two: {workout.intervaltwo}</p>
                        <p>Cycles: {workout.cycles}</p>
                    </div>
                    <div>
                        <button onClick={toggleClass.bind(null, index)}>Let's Go!</button>
                        <div id={index} className="hidden">
                            <TimerApp index={index} timerID={`timer${index}`} workout={workout}/>
                        </div>
                    
                    </div>
                    
                    {props.isLogged ? <EditWorkout workout={workout} modalShows={props.modalShows} editWorkout={props.editWorkout} handleFormChange={props.handleFormChange}></EditWorkout> : null} 
                    {props.isLogged ? <button className="delete" onClick={() =>{
                        props.deleteWorkout(workout.id)
                    }}>Delete</button> : null}      
            </div>
        )
    });

    return(
        <div>
            {props.isLogged ? <NewWorkout buttonLabel={"New Workout"} createWorkout={props.createWorkout}/> : null}
            <div className="flex-container">
                {workouts}
            </div>
        </div>
        
    )
}




export default WorkoutList;
