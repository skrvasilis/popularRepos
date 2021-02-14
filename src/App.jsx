import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.scss";

// created:${week}
export default function App() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("");
  const [bestRepos, setBesrRepos] = useState([]);
  const [apiError, setApiError] = useState(false);

  useEffect(async () => {
    try {
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=language:${input}&order=desc`
      );
      setBesrRepos(res.data.items);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(false);
    try {
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=language:${input}&sort=stars&order=desc`
      );
      setBesrRepos(res.data.items);
      setInput("");
    } catch (error) {
      setApiError(true);
      setBesrRepos([]);
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
            <h4> type the language that you are looking for</h4>
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
            sorry <span>{language}</span> is not a programming language please
            try again
          </h2>
        ) : null}

        {bestRepos.length ? (
          <h2 className="title">
            This are the most popular repositories for{" "}
            <span>{language === "" ? "all languages" : `${language}`}</span>
          </h2>
        ) : null}
        {bestRepos &&
          bestRepos.map((item) => {
            return (
              <>
                <ul>
                  <li>
                    <div className="result">
                      <div className="names">
                        <h2 className="repo">
                          <a href={item.html_url} target="_blank">
                            {item.name}
                          </a>
                        </h2>
                        <h5>
                          <a href={item.owner.html_url} target="_blank">
                            {item.owner.login}
                            <img src={item.owner.avatar_url} alt="Avatar" />
                          </a>
                        </h5>
                      </div>
                      <div className="infos">
                        <p>
                          <i class="fas fa-code-branch"></i> Forks: {item.forks}
                        </p>
                        <p>
                          <i class="fas fa-eye"></i> Watch : {item.watchers}
                        </p>
                      </div>
                    </div>

                    <p>{item.description}</p>
                  </li>
                </ul>
              </>
            );
          })}
      </section>
    </div>
  );
}