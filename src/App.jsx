import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.scss";

export default function App() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("");
  const [bestRepos, setBestRepos] = useState([]);
  const [apiError, setApiError] = useState(false);

  useEffect( () => {
      (async function () {
    try {
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=language:&sort=stars&order=desc&type=Repositories`
      );
      setBestRepos(res.data.items);
    } catch (error) {
      console.log(error); 
    }
  })();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(false);
    try {
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=language:${input}&sort=stars&order=desc&type=Repositories`
      );
      setBestRepos(res.data.items);
      setInput("");
    } catch (error) {
      setApiError(true);
      setBestRepos([]);
      console.log(error);
      setInput("");
    }
    setLanguage(input);
  };
  return (
    <div className="main">
      <div className="search">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="language">
            <h4>Type the language that you are looking for</h4>
            <input
              type="text"
              name="language"
              onChange={(e) => setInput(e.target.value)}
              placeholder="language"
              className="input-field"
              value={input}
            />
            <input type="submit" value="Submit" className="sub-button"></input>
          </label>
        </form>
      </div>
      <section>
        {apiError === true ? (
          <h2 className="title">
            Sorry, <span>{language}</span> is not a programming language please
            try again
          </h2>
        ) : null}

        {bestRepos.length ? (
          <h2 className="title">
            This are the most popular repositories for{" "}
            <span>{language === "" ? "all languages" : `${language}`}</span>
          </h2>
        ) : null}
        <ul>
          {bestRepos &&
            bestRepos.map((item) => {
              return (
                <li key={item.id}>
                  <div className="result">
                    <div className="names">
                      <h2 className="repo">
                        <a href={item.html_url} target="_blank">
                          {item.name}
                        </a>
                      </h2>
                      <div className="owner">
                        {" "}
                        <h5>
                          <a href={item.owner.html_url} target="_blank">
                            {item.owner.login}
                          </a>
                        </h5>
                        <img src={item.owner.avatar_url} alt="Avatar" />
                      </div>
                    </div>
                    <div className="infos">
                      <p>
                        <i className="fas fa-code-branch"></i> Forks: {item.forks}
                      </p>
                      <p>
                        <i className="fas fa-eye"></i> Watch : {item.watchers}
                      </p>
                    </div>
                  </div>
                  <p>{item.description}</p>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
