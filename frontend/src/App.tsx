import axios from "axios";
//import "highlight.js/styles/github-dark.css";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Editor from "react-simple-code-editor";
//import reHypeHighlight from "rehype-highlight";
import "./App.css";
import headerImage from "./assets/JsToTs.png";

function App() {
  const [code, setCode] = useState(
    `//"Paste or Type Your JavaScript Code Here"


//For recruiters: down here is an example just remove the /* at the top an */ at the bottom
/* 
import cors from 'cors';
import express from 'express';
import aiRoute from './routes/ai.routes.js';

const app = express();

app.use(cors());

app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello from code reviewer");
})

app.use('/ai',aiRoute);

export default app;
*/`
  );

  const [review, setreview] = useState(
    `Waiting for user to Enter or Paste the Code and Press Review .....`
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    if (isLoading) return;

    setIsLoading(true);
    setreview("Waiting for Your Code Buddy to review the code .....");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/post-code`,
        { code }
      );
      setreview(response.data);
    } catch (error) {
      setreview("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <header className="top-header">
        <div className="header-content">
          <img src={headerImage} alt="JS to TS" className="header-image" />
        </div>
      </header>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                minHeight: "100%", //changed this from height to minHeight
                width: "100%",
                caretColor: "black",
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className={`review ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Reviewing..." : "Review"}
          </div>
        </div>
        <div className="right">
          <Markdown>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
