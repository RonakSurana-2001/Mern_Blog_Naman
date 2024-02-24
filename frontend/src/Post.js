import React from 'react';
import { formatISO9075 } from 'date-fns';
const Post = ({ title, summary, cover, content, createdAt }) => {
  return (
    <div className="post">
      <div className="image">
        <img src={cover} alt={title} />
      </div>
      <div className="texts">
        <h2>{title}</h2>
        <p className="info">
          <a className="author">naman surana</a>
          <time className="">{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Post;
