class UserPage extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			user : null
		};
		this.getUser();
	}	

	getUser(){
		let url = `/api/user/${this.props.user_id}`;
		fetch(url)
		.then(res => res.json())
		.then(
			data => {
				this.setState({ user: data })
			}
		);
	}

	postFollow(){
		let url = `/api/follow/${this.props.user_id}`;
		fetch(url)
		.then(res => res.json())
		.then(
			data => {
				this.getUser();
			}
		);
	}

	followButton(){

		if (this.state.user.own_profile){
			return (<NewPost/>); 
		}

		return (<a className="btn btn-primary text-light" onClick={()=> this.postFollow()}>            
	        {this.state.user.following_user
			? <div>Unfollow</div>
	        : <div>Follow</div>
			}     
    	</a>);	
	}

	render(){

		let user_data = this.state.user;

		if (user_data == null) 
			return <div>Loading...</div>;

		return(
			<div>
			<div className="card text-center">
			  <div className="card-header">
			  </div>
			  <div className="card-body">
			    <h1 className="card-title">{user_data.username}</h1>
			    <h5 className="card-text">Followers: {user_data.followers}</h5>
			    <h5 className="card-text">Following: {user_data.following}</h5>
			    {this.followButton()}
			  </div>
			  <div className="card-footer text-muted">
			  </div>
			</div>
			{user_data.own_profile
				?<h2 className="mt-4">Your Posts</h2>
				:<h2 className="mt-4">{user_data.username} Posts</h2>
			}
			<PaginatePosts user_id={this.props.user_id}/>
			</div>
		);
	}
}