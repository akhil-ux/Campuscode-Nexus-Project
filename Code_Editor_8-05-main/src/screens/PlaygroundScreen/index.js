import { useParams } from "react-router-dom"
import "./index.scss"
import { EditorContainer } from "./EditorContainer";
import { useCallback, useState } from "react";
import { makesubmission } from "./service";
import { Pass } from "codemirror";
export const PlaygroundScreen = () => {

  const params = useParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showLoader, setshowLoader] = useState(false);

  const{fileId, folderId} = params;

  const importInput = (e) => {
      const file=e.target.files[0]
      const fileType = file.type.includes("text")
      if(fileType){
          const fileReader = new FileReader();
          fileReader.readAsText(file);
          fileReader.onload = (e) => {
            setInput(e.target.result)
          }
      } else {
          alert("Please select a program file");
      }
  }

  const exportOutput = () => {
      const outputValue = output.trim();
      if(!outputValue){
        alert("Output is Empty");
        return;
      }
      const blob = new Blob([outputValue], {type: "text/plain"})
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;
      link.download=`output.txt`;
      link.click();
  }
  const callback =({apiStatus,data,message})=>
  {
    if (apiStatus ==='loading')
    {
      setshowLoader(true)
    }
    else if(apiStatus==='error')
    {
      setshowLoader(false);
      setOutput("Something Went Wrong");
    }
    else
    {
      if(data.status.id===3)
      {
        setshowLoader(false);
        setOutput(atob(data.stdout))
      }
      else
      {
        setshowLoader(false);
        setOutput(atob(data.stderr))
      }
    }
  }
  const runCode=useCallback(({code,language})=>
  {
    makesubmission({ code, language, stdin: input, callback });


  },[input])
  return (
    <div className="playground-container">
        <div className="header-container">
            <img src="/logo.png" className="logo"/>
        </div>
        <div className="content-container">
            <div className="editor-container">
              <EditorContainer fileId={fileId} folderId={folderId} runCode={runCode}/>
            </div>
            <div className="input-output-container">
                <div className="input-header">
                  <b>Input:</b>
                  <label htmlFor="input" className="icon-container">
                      <span className="material-icons">cloud_upload</span>
                      <b className="">Import Input</b>
                  </label>
                  <input type="file" id="input" style={{display: 'none'}} onChange={importInput}/>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
            </div>
            <div className="input-output-container">
            <div className="input-header">
                  <b>Output:</b>
                  <button className="icon-container" onClick={exportOutput}>
                    <span className="material-icons">cloud_download</span>
                    <b>Export Output</b>
                  </button>
                </div>
                <textarea readOnly value={output} onChange={(e) => setOutput(e.target.value)}></textarea>
            </div>
        </div>
        {showLoader && <div className="fullpage-loader">
        <div className="loader">

        </div>

      </div>}
    </div>
  );
}