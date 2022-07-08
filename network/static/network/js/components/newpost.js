class NewPost extends React.Component {
	
	constructor(props) {
	super(props);
    this.state = {

	value: '',
    
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
	  this.setState({value: event.target.value});
	}

	handleSubmit(event) {

	event.preventDefault();
	   
	fetch('api/newPost', { 
        method: "POST", 
        body: JSON.stringify({ 
            content: this.state.value, 
        }), 

        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 

    }) 
    .then(response => response.json()) 
    .then(json => location.reload()); 
  }

  render() {

    return (
        <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            <textarea placeholder="Write a new post..." id="exampleFormControlTextarea1" className="form-control" rows="3" value={this.state.value} onChange={this.handleChange} />
            <button value="Submit"  type="submit" className="btn btn-dark mt-1">New Post</button>
        </div>
        </form>
      );
    }
}