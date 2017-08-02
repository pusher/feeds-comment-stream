import React, { Component } from 'react';

import CommentItem from './comment-item';
import Textarea from './textarea';
import LoadMoreButton from './load-more-button';

export default class CommentsBlock extends Component {
  
  state = {
    textareaValue: '',
    selectedItemToReply: '',
    sendByEnter: false
  };

  componentDidMount () {
    setInterval(() => this.forceUpdate(), 10000);
  }

  onTextareaChange = e => {
    this.setState({ textareaValue: e.target.value });
  };

  onReplyClick = (id) => {
    this.setState({ selectedItemToReply: id });
  };

  onLoadMoreClick = (e, commentId, parentCommentId) => {
    e.preventDefault();
    this.props.onLoadMoreClick(commentId, parentCommentId);
  };

  onCancelClick = (e) => {
    e.preventDefault();
    this.setState({ selectedItemToReply: '' });
  };

  onCommentSubmit = (e, parentCommentId) => {
    e.preventDefault();

    if (!this.state.textareaValue) {
      return;
    }

    this.props.onCommentSubmit(this.state.textareaValue, parentCommentId);
    this.setState({ textareaValue: '' });
  };

  onSendByEnterChange = () => {
    this.setState({ sendByEnter: !this.state.sendByEnter });
  };

  getTextarea (onCommentSubmit, isNested = false) {
    return (
      <Textarea
        user={this.props.user}
        commentText={this.state.textareaValue}
        sendByEnter={this.state.sendByEnter}
        isNested={isNested}
        onCommentSubmit={onCommentSubmit}
        onCancelClick={this.onCancelClick}
        onTextareaChange={this.onTextareaChange}
        onSendByEnterChange={this.onSendByEnterChange}
      />
    );
  }

  render() {
    const { comments, subComments } = this.props;

    return (
      <div>
        {
          // Render textarea if any certain comment is selected to reply
          !this.state.selectedItemToReply ?
            this.getTextarea((e) => this.onCommentSubmit(e, false)) :
            null
        }
        {comments.map((comment, i) => (
          <CommentItem
            key={comment.id}
            onReplyClick={this.onReplyClick}
            onLoadMoreClick={this.onLoadMoreClick}
            subComments={
              // Filter all subcomments for current comment
              subComments
                .filter(subComment => subComment.parentCommentId === comment.id)
            }
            {...comment}
          >
            {
              this.state.selectedItemToReply === comment.id ?
                this.getTextarea((e) => this.onCommentSubmit(e, comment.id), true) :
                null
            }
          </CommentItem>
        ))}
        {
          // Render "load more button" if last item has "hasNextItem" property
          comments.length > 4 && comments[comments.length-1].hasNextItem !== false ? 
            <LoadMoreButton onButtonClick={(e) => this.onLoadMoreClick(e, comments[comments.length-1].id, false)} />
            : null
        }
      </div>
    );
  }
}
