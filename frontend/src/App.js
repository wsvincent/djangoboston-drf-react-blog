import React, { Component } from 'react';

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/');
      const posts = await res.json();
      this.setState({
        posts
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
      return (
        <div>
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
}

export default App;
