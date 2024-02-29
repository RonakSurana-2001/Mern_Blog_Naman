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

  const [contentEditVerify,setcontentEditVerify]=useState("false");

  useEffect(()=>{
    contentToEdit();
  },[])

  let contentToEdit=async()=>{
    let data=id;
    const response1=await fetch(`http://localhost:4000/post/${id}`,{
      method:'GET'
    });
    const json1=await response1.json();

    const response2=await fetch(`http://localhost:4000/profile`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({"token":localStorage.getItem('token')})
    });
    const json2=await response2.json();
    console.log(json2.userId,json1.author._id)
    if(json2.userId==json1.author._id){
      setcontentEditVerify("true");
    }
    console.log(contentEditVerify)
  }

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

  function postTitleEdit() {
    let btn = document.getElementById("h1-title");
    if(contentEditVerify=="true"){
      btn.addEventListener("click", function () {
        this.contentEditable = "true";
        this.focus();
      });
    
      btn.addEventListener("blur", async function() {
        this.contentEditable = "false";
        let data = {
          "toEdit": "title",
          "value": this.innerText,
          "id": id
        };
        try {
          const response = await fetch('http://localhost:4000/post/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          const json = await response.json();
        } catch (error) {
          //console.error(error);
        }
      });  
    }
  }


  function postContentEdit() {
    if(contentEditVerify=="true")
    {
      let btn = document.getElementById("content");
      btn.addEventListener("click", function () {
        this.contentEditable = "true";
        this.focus();
      });
    
      btn.addEventListener("blur", async function() {
        this.contentEditable = "false";
        let data = {
          "toEdit": "content",
          "value": this.innerText,
          "id": id
        };
        try {
          const response = await fetch('http://localhost:4000/post/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          const json = await response.json();
        } catch (error) {
          //console.error(error);
        }
      });  
    }
  }

  return (
    <div className='post-page'>
      <h1 id="h1-title" onClick={postTitleEdit} contentEditable={contentEditVerify}>{postInfo.title}</h1>
      <time>{formatISO9075(postInfo.createdAt)}</time>
      <div className='author'>By {postInfo.author.username}</div>
      <div className='image'>
        <img src={`http://localhost:4000/${postInfo.cover}`} alt='Image Cannot be Displayed' id="image"/>
      </div>
      <div
        className='content' id='content'
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
        onClick={postContentEdit} contenteditable={contentEditVerify}/>
    </div>
  );
};

export default PostPage;
