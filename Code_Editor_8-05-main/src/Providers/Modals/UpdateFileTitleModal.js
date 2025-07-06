import { useContext } from "react"
import "./createPlaygroundModal.scss"
import { ModalContext } from "../ModalProvider"
import { createFolderStyles } from "./CreateFolderModal";
import { PlaygroundContext } from "../PlaygroundProvider";

export const UpdateFileTitleModal = () => {
    const {closeModal, modalPayLoad} = useContext(ModalContext);
    const {editFileTitle} = useContext(PlaygroundContext);

    const onSubmitModal = (e) => {
        e.preventDefault();
        const fileName = e.target.fileName.value;
        editFileTitle(fileName, modalPayLoad.fileId, modalPayLoad.folderId);
        closeModal();
    }
    return <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span onClick={closeModal} className="material-icons close">close</span>
          <h1>Update File Title</h1>
          <div style={createFolderStyles.inputContainer}>
             <input required name="fileName" style={createFolderStyles.input} placeholder="Enter Folder Name"/>
            <button style={createFolderStyles.btn} type="submit">Create Folder</button>
        </div>
      </form> 

    </div>
}