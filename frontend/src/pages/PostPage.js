// PostPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';
import { UserContext } from '../UserContext';

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        return response.json();
      })
      .then(postData => {
        if (postData && postData.createdAt) {
          setPostInfo({
            ...postData,
            createdAt: new Date(postData.createdAt),
          });
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!postInfo) {
    return <div>Error loading post</div>;
  }

  console.log('userInfo:', userInfo);

  return (
    <div className='post-page'>
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(postInfo.createdAt)}</time>
      <div className='author'>By {postInfo.author.username}</div>
      {/* Add a check for userInfo before accessing id */}
      {userInfo && userInfo.id && userInfo.id === postInfo.author._id && (
        <div className='edit-row'>
          <Link to={`/edit-post/${id}`} className='edit'>
            Edit this post
          </Link>
        </div>
      )}
      <div className='image'>
        <img src={`http://localhost:4000/${postInfo.cover}`} alt='' />
      </div>
      <div
        className='content'
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
