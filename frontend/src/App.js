import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    posts: []
  };

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    axios
      .get('http://127.0.0.1:8000/api/v1/')
      .then(res => {
        console.log(res);
        this.setState({ posts: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h1>DRF + React</h1>
        {this.state.posts.map(post => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <span>{post.body}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
