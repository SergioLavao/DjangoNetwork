class Post extends React.Component{

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      cur_post_id : 1,
    };
    this.getData()
  }

  getData = () =>{
    fetch(`api/post/${this.props.post_id}`)
    .then((data)=>{
      return data.json();
    })
    .then((json)=>{
      this.setState({ data: json, cur_post_id: this.props.post_id });
    });
  }

  postLike = () =>{
    fetch(`api/like/${this.props.post_id}`)
    .then((data)=>{
      return data.json();
    })
    .then((json)=>{
      this.getData()
    });
  }

  render() {

    const post_data = this.state.data;

    if (post_data == null )
      return(<div></div>);

    let user_url = `/${post_data.user_id}`; 

    return(
        <div className="card m-4">
          <div className="card-header">

          {post_data.created_at}
          
          </div>
          <div className="card-body">
              <a href={user_url}>
              <h5 className="card-title">{post_data.username}</h5>
              </a>
          {post_data.editable
            ?<EditableContent post_id={this.props.post_id} content={post_data.content}/>
            :<p>{post_data.content}</p>
          }

          <a onClick={this.postLike}>            
            {post_data.liked
              ? <img src='static/network/svg/like1.svg' height="20px"></img>
              : <img src='static/network/svg/like0.svg' height="20px"></img>
            }     

            {post_data.likes} Likes
          </a>

          </div>
        </div>
    );
  }
}

class EditableContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.content,
      edit: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

    event.preventDefault();
   
    fetch('api/edit', { 
        method: "POST", 
        body: JSON.stringify({ 
            post_id: this.props.post_id , 
            content: this.state.value, 
        }), 

        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 

    }) 
    .then(response => response.json()) 
    .then(json => this.handleState()); 
  }

  handleState = () =>{
    this.setState({ edit: !this.state.edit });
  }

  render() {

    if (this.state.edit) {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <textarea className="form-control" rows="3" value={this.state.value} onChange={this.handleChange} />
            <button value="Submit"  type="submit" className="btn btn-dark mt-1">Save Post</button>
          </label>
        </form>
      );
    }

    return(
      <div>
        <p>{this.state.value}</p>
        <button onClick={this.handleState} className="btn btn-dark">Edit Post</button>
      </div>
    );
  }
}