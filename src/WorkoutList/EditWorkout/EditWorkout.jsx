import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/

class EditWorkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modal: false,

    };

    this.toggle = this.toggle.bind(this);
  }

  selectThisWorkout = () => {
      this.props.modalShows(this.props.workout);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    

    return (
      <div>
        
        <button onClick={(e)=>{this.toggle(); this.selectThisWorkout();}}>Edit</button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Edit your workout!</ModalHeader>
          
          <form onSubmit={this.props.editWorkout}>
          <ModalBody>
                
                    Name: <input onChange={this.props.handleFormChange} type='text' name='name' placeholder={this.props.workout.name}/><br/>
                    Reps: <input onChange={this.props.handleFormChange} type='text' name='reps' placeholder={this.props.workout.reps}/><br/>
                    Set Interval (seconds): <input onChange={this.props.handleFormChange} type='text' name='intervalone' placeholder={this.props.workout.intervalone}/><br/>
                    Rest Interval (seconds): <input onChange={this.props.handleFormChange} type='text' name='intervaltwo' placeholder={this.props.workout.intervaltwo}/><br/>
                    Cycles: <input onChange={this.props.handleFormChange} type='text' name='cycles' placeholder={this.props.workout.cycles}/><br/>

                
          </ModalBody>
          <ModalFooter>
            <Button type='submit' color='primary' onClick={this.toggle}>Let's Go!</Button>
            <Button color='secondary' id='cancel' onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
          </form>
        </Modal>
        
      </div>
    );
  }
}

export default EditWorkout;