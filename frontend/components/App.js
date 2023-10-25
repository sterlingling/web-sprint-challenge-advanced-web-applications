import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Function to set the selected article for editing
  const handleEditClick = (article) => {
    setSelectedArticle(article);
  };

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage("Goodbye!");
    navigate("/")
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios.post("http://localhost:9000/api/login", { username, password })
      .then(res => {
        setSpinnerOn(false)
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        navigate("/articles")

      })
      .catch(err => {
        console.log(err);
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true)
    axiosWithAuth().get("http://localhost:9000/api/articles")
      .then(res => {
        // console.log(res)
        setSpinnerOn(false)
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
        navigate("/");
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().post("http://localhost:9000/api/articles", article)
      .then(res => {
        setSpinnerOn(false)
        setMessage(res.data.message)
        setArticles([...articles, res.data.article])
        console.log(res);
      })
      .catch(err => {
        setSpinnerOn(false)
        console.log(err)
      })
  }

  const updateArticle = (article_id, article) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then(res => {
        setSpinnerOn(false);
        setMessage(res.data.message);
        setArticles([...articles, res.data.article])
        console.log(res);
      })
      .catch(err => {
        setSpinnerOn(false)
        console.log(err)
      })
  }



  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
      .then(res => {

        axiosWithAuth().get("http://localhost:9000/api/articles").then(res => {
          setArticles(res.data.articles)
        }).catch()
        setMessage(res.data.message)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm updateArticle={updateArticle} setSelectedArticle={setSelectedArticle} selectedArticle={selectedArticle} postArticle={postArticle} />

              <Articles handleEditClick={handleEditClick} updateArticle={updateArticle} deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
