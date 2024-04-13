import React from 'react';
import PropTypes from 'prop-types';
import './PostView.scss';
import ImageView from './ImageView';
import { Divider } from 'antd';
import CommentView from './CommentView';
PostView.propTypes = {
  
};

function PostView({data}) {
  return (
    <div className='post-view-container'>
      <span dangerouslySetInnerHTML={{__html: data?.content}}></span>
      <ImageView data={data?.attachment}/>
      <Divider/>
      <CommentView data={data}/>
    </div>
  );
}

export default PostView;
