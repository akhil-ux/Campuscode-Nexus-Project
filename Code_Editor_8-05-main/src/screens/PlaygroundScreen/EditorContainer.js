import { useContext, useRef, useState } from "react";
import "./EditorContainer.scss";
import Editor from "@monaco-editor/react";
import { PlaygroundContext } from "../../Providers/PlaygroundProvider";
import { makesubmission } from "./service";

const editorOptions = {
  fontSize: 16,
  wordWrap: 'on'
}

const fileExtensionMapping = {
  cpp: 'cpp',
  javascript: 'js',
  python: 'py',
  java: 'java'
}

export const EditorContainer = ({ fileId, folderId, runCode }) => {
  const { getDefaultCode, getLanguage, updateLanguage, saveCode } = useContext(PlaygroundContext);
  const [code, setCode] = useState(() => getDefaultCode(fileId, folderId));
  const [language, setLanguage] = useState(() => getLanguage(fileId, folderId));
  const [theme, setTheme] = useState('vs-dark');
  const codeRef = useRef(code);
  const [isFullscreen, setIsFullScreen] = useState(false);

  const onChangeCode = (newCode) => {
    codeRef.current = newCode;
  }

  const onUploadCode = (event) => {
    const file = event.target.files[0];
    const fileType = file.type.includes("text")
    if (fileType) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (value) {
        const importedCode = value.target.result;
        setCode(importedCode);
        codeRef.current = importedCode;
      }
    } else {
      alert("Please select a program file");
    }
  }

  const exportCode = () => {
    const codeValue = codeRef.current?.trim();
    if (!codeValue) {
      alert("Please type some code in the editor before Exporting")
    }
    const codeBlob = new Blob([codeValue], { type: "text/plain" })
    const downloadUrl = URL.createObjectURL(codeBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `code.${fileExtensionMapping[language]}`;
    link.click();
  }

  const onChangeLanguage = (e) => {
    updateLanguage(fileId, folderId, e.target.value);
    setCode(getDefaultCode(fileId, folderId));
    setLanguage(e.target.value);
  }

  const onChangeTheme = (e) => {
    setTheme(e.target.value);
  }

  const onSaveCode = () => {
    saveCode(fileId, folderId, codeRef.current);
    alert("Code Saved Successfully");
  }

  const fullScreen = () => {
    setIsFullScreen(!isFullscreen);
  }

  const onRunCode = () => {
    runCode({ code: codeRef.current, language });
  }

  return (
    <div className={`root-editor-container ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="editor-header">
        <div className="editor-left-container">
          <b className="title">{"Title of the Card"}</b>
          <span className="material-icons">edit</span>
          <button onClick={onSaveCode}>Save Code</button>
        </div>
        <div className="editor-right-container">
          <select onChange={onChangeLanguage} value={language}>
            <option value="cpp">CPP</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
          <select onChange={onChangeTheme} value={theme}>
            <option value="vs-dark">Vs-Dark</option>
            <option value="vs-light">Vs-Light</option>
          </select>
        </div>
      </div>
      <div className="editor-body">
        <Editor
          width={900}
          height={600}
          language={language}
          options={editorOptions}
          theme={theme}
          onChange={onChangeCode}
          value={code}
        />
      </div>
      <div className="editor-footer">
        <button className="btn" onClick={fullScreen}>
          <span className="material-icons">fullscreen</span>
          <span>{isFullscreen ? "Minimize" : "Full Screen"}</span>
        </button>
        <label htmlFor="import-code" className="btn">
          <span className="material-icons">cloud_download</span>
          <span>Import Code</span>
        </label>
        <input type="file" id="import-code" style={{ display: "none" }} onChange={onUploadCode} />
        <button className="btn" onClick={exportCode}>
          <span className="material-icons">cloud_upload</span>
          <span>Export Code</span>
        </button>
        <button className="btn" onClick={onRunCode}>
          <span className="material-icons">play_arrow</span>
          <span>Run Code</span>
        </button>
      </div>
    </div>
  );
};
