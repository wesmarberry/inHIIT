import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody} from 'reactstrap';

/*
*****************************************************************

Front End React Develoment by Adam Wolfman
Original GitHub Repository - https://github.com/awolfden/inHIIT

Refactored by Wes Marberry to accept a Java back end on 5/28/2019

*****************************************************************
*/

class UserLogin extends Component {
    constructor(){
        super();
        this.state = {
            
            username: '',
            password: '',
            
            modal: false
        }
        this.toggle = this.toggle.bind(this);
    }

    updateState = (e) => {
        e.preventDefault();
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    
    toggle() {
        this.setState(prevState => ({
        modal: !prevState.modal
        }));
    }

    render() {
        

        return (
        <div className='flex-container'>
            <Button className='newButton loginModalButton' onClick={this.toggle}>{this.props.buttonLabel}</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Login / Register</ModalHeader>
            
            <ModalBody>
                <form onSubmit={this.props.createUser.bind(null, this.state)}>
                    <div>
                        <p>Register New User</p>
                        Name: <input onChange={this.updateState} type='text' name='username'/><br/>
                        Password: <input onChange={this.updateState} type='password' name='password'/><br/>
                        <button id='loginSubmit' onClick={this.toggle} type='submit'>Submit</button>
                    </div>
                </form>
                <form onSubmit={this.props.loginUser.bind(null, this.state)}>
                    <div>
                        <p>Login Existing User</p>
                        Name: <input onChange={this.updateState} type='text' name='username'/><br/>
                        Password: <input onChange={this.updateState} type='password' name='password'/><br/> 
                        <button id='loginCancel' onClick={this.toggle} type='submit'>Submit</button>                   
                    </div>
                </form>
                    

            </ModalBody>

            </Modal>
        </div>
        );
        }
    }

    export default UserLogin;

