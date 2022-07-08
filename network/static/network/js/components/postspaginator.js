class PaginatePosts extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			num_pages: 0,
			cur_page: 1,
			posts: [],
		};
		this.getPage(1);
	}	

	getPage(page){
		let url = `/api/page/${page}`;
		if (this.props.following)
			url = url + `?following=True`;
		if (this.props.user_id)
			url = url + `?user_id=${this.props.user_id}`;

		fetch(url)
		.then(res => res.json())
		.then(
			data => {
 				this.setState({ num_pages: data.num_pages , 
 					posts: data.posts_id,
 					cur_page: page });
			}
		);
	}

	setPaginationBar(){
		let items = [];
		for (let i = 1; i < this.state.num_pages + 1; i++) {

			let active = (i == this.state.cur_page)
			?'page-item active'
			:'page-item';

			items.push(
				<li className={active} key={i}>
				<a className="page-link" onClick={()=> this.getPage(i)}>{i}</a>
				</li>
			);
		}


		return(
			<nav aria-label="...">
			  <ul className="pagination">
			    { items }
			  </ul>
			</nav>
		);
	}

	setPosts(){

		if (this.state.posts.length == 0)
			return <h3>There's no posts yet!</h3>;

		return this.state.posts.map((id) => <Post post_id={id} key={id}/>)
	}

	render(){
		return(
			<div>
			{ this.setPosts() }
			{ this.setPaginationBar() }
			</div>
		);
	}
}