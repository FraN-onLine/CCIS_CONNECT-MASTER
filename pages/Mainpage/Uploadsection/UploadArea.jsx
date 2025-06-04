import { useState, useRef, useEffect } from 'react';
import '../../../src/Css/Mainpage/Uploadsection/Uploadarea.css'
import { IoIosAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Filecontainer from '../../Component/Filecontainer'
import { CiSearch } from "react-icons/ci";


/**
 * UploadArea Component
 * 
 * This component provides a user interface for uploading documents. It includes a modal for adding documents,
 * a drag-and-drop area for file uploads, and a search bar for filtering modules.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered UploadArea component.
 * 
 * @example
 * <UploadArea />
 * 
 * @state {boolean} uploadModal - Controls the visibility of the upload modal.
 * @state {boolean} dragState - Indicates whether a file is being dragged over the drop area.
 * 
 * @ref {React.RefObject} fileInputRef - A reference to the hidden file input element.
 * 
 * @function handleUploadClick - Triggers the file input click event to open the file picker.
 * @param {React.MouseEvent} e - The click event.
 * 
 * @function onFileDrop - Handles the file drop event and processes the dropped files.
 * @param {React.DragEvent} e - The drag event.
 * 
 * @function handleDrag - Handles the drag event to update the drag state.
 * @param {React.DragEvent} e - The drag event.
 */

function UploadArea({ username, userId }) {
  const [uploadModal , setUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const [dragState , setDrag] = useState(false);
  const [files , setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch uploaded files from server
  const fetchUploadedFiles = async () => {
    try {
      const res = await fetch('http://localhost:3090/list-uploads');
      const data = await res.json();
      setUploadedFiles(data);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
     if(e.target.files && e.target.files.length > 0){
       setFiles(Array.from(e.target.files));
     }
  };

  // Open file picker
  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  // Upload files to server
const handleUpload = async (e) => {
  e.preventDefault();
  setUploading(true);
  setUploadError('');
  setUploadSuccess('');
  if (files.length === 0) {
    setUploadError('No files selected.');
    setUploading(false);
    return;
  }
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  formData.append('title', title);
  formData.append('user_id', userId);

  try {
    const res = await fetch('http://localhost:3090/uploads', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setUploadSuccess('Upload successful!');
      setFiles([]);
      setTitle('');
      fetchUploadedFiles();
    } else {
      setUploadError(data.error || 'Upload failed.');
    }
  } catch (err) {
    setUploadError('Upload failed: ' + err.message);
  }
  setUploading(false);
};

const handleDelete = async (fileId) => {
  if (!window.confirm('Are you sure you want to delete this file?')) return;
  try {
    const res = await fetch(`http://localhost:3090/uploads/${fileId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (res.ok) {
      setUploadedFiles(files => files.filter(f => f.id !== fileId));
    } else {
      alert(data.error || 'Failed to delete file.');
    }
  } catch (err) {
    alert('Failed to delete file: ' + err.message);
  }
};

  // Filtered files based on search term
  const filteredFiles = uploadedFiles.filter(file =>
    (file.title && file.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (file.username && file.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return(
   <>
      <div className="Uploadarea-content">
        <div className="Uploadarea-body">
          <div className="Uploadarea-body-header">
            <h1>Modules</h1>
            <br />
            <hr />
            <div className="Uploadarea-search">
              <div className="search-content">
                <input
                  type="text"
                  placeholder='Search by title or uploader'
                  name="Upload-search-box"
                  id="Upload-search-box"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <CiSearch className='search-button'/>
              </div>
              <IoIosAdd className='add-button' onClick={() => setUploadModal(true)} />
            </div>
            <div className="Uploadarea-data-area" style={{
              maxHeight: '500px',
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '10px'
            }}>
              {filteredFiles.map(file => (
                <div className='uploaded-file-container' key={file.id} style={{ }}>
                  <div title={file.title} style={{ fontWeight: 'bold', marginBottom: '4px', textAlign: "center", color: '#333' }}>
                    {file.title}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '4px', textAlign: "center" }}>
                    Uploaded by: <b>{file.username}</b>
                  </div>
                  <a
                    href={`http://localhost:3090/uploads/${encodeURIComponent(file.filename)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.85em',
                      color: '#1976d2',
                      textDecoration: 'underline'
                    }}
                  >
                    Download
                  </a>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(file.id)}
                    title="Delete file"
                  >
                    Delete
                  </button>
                </div>
              ))}   
        </div>
         </div>
           </div>
             </div>
         {uploadModal && 
         <dialog className='uploadModal' open>
           <div className="uploadModal-box">
           <div className="uploadModal-box-header">
             <p>Add Documents</p>
             <IoMdClose onClick={() => setUploadModal(false)} className='upload-exit-button'/>
           </div>
           <hr />
           <form className="uploadModal-box-body" onSubmit={handleUpload}>
             <label htmlFor="Module-name">Title</label>
             <br />
             <input
                type="text"
                name='Module-name'
                className='Document-title-input'
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              /> 
             <div className="Document-upload-box" onClick={openFilePicker} onDragOver={(e) => e.preventDefault()}>
                Browse Files
             </div>
             <div className="Files"  style={{display: files.length > 0 ? 'flex' : 'none',flexDirection: 'column'}}>
                 {files.map(file => <Filecontainer key={file.name + file.size} name={file.name} size={file.size} url={URL.createObjectURL(file)}/>)}
             </div>
             {uploadError && <div style={{color: 'red'}}>{uploadError}</div>}
             {uploadSuccess && <div style={{color: 'green'}}>{uploadSuccess}</div>}
             
             <div className="uploadButton-container">
                  <button className="upload-button" type="submit" disabled={uploading}>
                   {uploading ? 'Uploading...' : 'Upload'}
                  </button>
             </div>
 
             <input type="file" hidden ref={fileInputRef} multiple onChange={handleFileChange} />
           </form>
           </div>
         </dialog>
       }
    </>
  );
}
export default UploadArea;

