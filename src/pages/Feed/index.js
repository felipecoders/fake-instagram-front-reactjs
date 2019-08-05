import React, { Component } from 'react';
import api from '../../services/api';
import io from 'socket.io-client';

import { PostList } from './styles';

import more from '../../assets/more.svg';
import like from '../../assets/like.svg';
import comment from '../../assets/comment.svg';
import send from '../../assets/send.svg';

class Feed extends Component {

  state = {
    feed: []
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get('posts');
    
    this.setState({ feed: response.data });
  }

  registerToSocket = () => {
    const socket = io('http://localhost:3333');

    socket.on('post', newPost => {
      this.setState({ feed: [ newPost, ...this.state.feed ] });
    });

    socket.on('like', newLike => {
      let { feed } = this.state;
      feed = feed.map(f => f._id === newLike._id ? newLike : f);

      this.setState({ feed });
    })
  }

  handleLike = async id => {
    api.post(`/posts/${id}/like`);
  }

  

  render() {
    return (
      <PostList>
        { this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{ post.author }</span>
                <span className="place">{ post.place }</span>
              </div>

              <img src={more} alt="Mais"/>
            </header>

            <img src={`http://localhost:3333/files/${post.image}`} alt="imagem"/>

            <footer>
              <div className="actions">
                <button type="button" onClick={ () => this.handleLike(post._id) }>
                  <img src={ like } alt="like"/>
                </button>
                <img src={ comment } alt="comment"/>
                <img src={ send } alt="send"/>
              </div>

              <strong>{ post.likes } curtidas</strong>

              <p>
                { post.description }
                <span>{ post.hashtags }</span>
              </p>
            </footer>

          </article>
          
        )) }
      </PostList>
    );
  }
}

export default Feed;