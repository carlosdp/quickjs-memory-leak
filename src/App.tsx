import React, { useEffect } from "react";
import "./App.css";
import { getQuickJS } from "quickjs-emscripten";
import packageJson from "./package.json";
import packageLockJson from "./package-lock.json";

function stringify(val: unknown) {
  if (typeof val === "undefined") {
    return "undefined";
  }

  return JSON.stringify(val, undefined, 2);
}

function App() {
  const [evalResult, setEvalResult] = React.useState<unknown>(undefined);
  const handleEval = React.useCallback(async () => {
    const QuickJS = await getQuickJS();
    try {
      const response = await fetch("/clientCode.js");
      const js = await response.text();
      const result = QuickJS.evalCode(js);
      console.log("eval result:", result);
      setEvalResult(result);
    } catch (err) {
      console.log("eval error:", err);
      setEvalResult(err);
    }
  }, [setEvalResult]);
  useEffect(() => {
    handleEval();
  }, [handleEval, setEvalResult]);

  const specified = packageJson.dependencies["quickjs-emscripten"];
  const resolved = packageLockJson.dependencies["quickjs-emscripten"].version;

  return (
    <div className="App">
      <div>
        <h1>
          quickjs-emscripten {specified} locked {resolved}
        </h1>
        <p>
          Javascript/Typescript bindings for{" "}
          <a href="https://bellard.org/quickjs/">QuickJS</a>, a modern
          Javascript interpreter written in C by Fabrice Bellard and Charlie
          Gordon.
        </p>
        <ul>
          <li>Safely evaluate untrusted Javascript (up to ES2020).</li>
          <li>Create and manipulate values inside the QuickJS runtime.</li>
          <li>Expose host functions to the QuickJS runtime.</li>
        </ul>
        <p>
          <a href="https://github.com/justjake/quickjs-emscripten">Github</a> -{' '}
          <a href="https://github.com/justjake/quickjs-emscripten/blob/master/doc/globals.md">
            Documentation
          </a>{' '}
          - <a href="https://www.npmjs.com/package/quickjs-emscripten">NPM</a>
        </p>
        <h2>Testing code that causes memory leak without any externally created objects</h2>
        <label htmlFor="js">
          This code is evaluated in a QuickJS virtual machine, using QuickJS.evalCode(), so there are no external objects referenced.
          In console, you will see failed assertions for memory not cleaned up.
        </label>
        <h3>Eval result:</h3>
        <pre>{stringify(evalResult)}</pre>
        <button onClick={handleEval}>Run Again</button>
      </div>
    </div>
  )
}

export default App
