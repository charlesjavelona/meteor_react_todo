/* Import files related to built in or third party libraries here*/
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

/* Import apis here */
import { Tasks } from '../api/tasks.js';

/* Import components here */
import Task from './Task.jsx';

/* App component - represents the whole app */
class App extends Component {
    constructor(props) {
       super(props);

       this.state = {
           hideCompleted: false,
       };
    }

    /*
     * Inserts the new task from user into DB
     * and displays the new task
     *
     * @param {event} 
     * */
    handleSubmit(e) {
       e.preventDefault();

       /* Find the text field via the React ref */
       const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

       Tasks.insert({
          text,
	  createdAt: new Date(), //current time
       });


       /* Clear form */
       ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

     toggleHideCompleted() {
         this.setState({
	     hideCompleted: !this.state.hideCompleted,
	 });       
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
	if (this.state.hideCompleted) {
	    filteredTasks = filteredTasks.filter(task => !task.checked);
	}
	return filteredTasks.map((task) => (
	    <Task key={task._id} task={task} />
	));
    }

    render() {
        return (
	   <div className="container">
	       <header>
	           <h1>Todo List</h1>

		  <label>
		      <input 
		        type="checkbox"
		        readOnly={this.state.hideCompleted}
			onClick={this.toggleHideCompleted.bind(this)}
		      />
		      Hide Completed Tasks
		  </label>
		  <form className="new-task" onSubmit={this.handleSubmit.bind(this)} > 
		     <input 
		        type="text"
			ref="textInput"
			placeholder="Type to add new tasks"
		      />
		   </form>
	       </header>

	       <ul>
	           {this.renderTasks()}
	       </ul>
	    </div>
	);
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
	    tasks: Tasks.find({}, { sort: {createdAt: -1 } }).fetch(),
    };
}, App);
