import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createpost,updatepost } from "../actions/posts";
import { bulkUpload, csvUpload, fetchsinglepost } from "../api";
import { useDropzone } from "react-dropzone";
import { IoCloseCircle } from "react-icons/io5";
import { RiFileExcel2Fill } from "react-icons/ri";
import toast from "react-hot-toast";

function PublishCheckbox({ isPublished, setIsPublished }) {
  const handleCheckboxChange = () => {
    setIsPublished(prevState => !prevState);
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id="publishCheckbox"
        checked={isPublished}
        onChange={handleCheckboxChange}
        className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded-md cursor-pointer"
      />
      <label htmlFor="publishCheckbox" className="text-lg font-semibold text-gray-700 cursor-pointer">
        {isPublished ? 'Publishing' : 'Not Publishing'}
      </label>
    </div>
  );
}


function Form({ setCurrentid,Currentid }) {
  const { user } = useSelector((state) => state.user_reducer);

const [imageUrl, setImageUrl] = useState(null);
const [File, setFile] = useState([]); // Changed to array for multiple files
const [csvFile, setcsvFile] = useState([]); // Changed to array for multiple files
const [isPublished, setIsPublished] = useState(false);
const [iscsv, setIsCsv] = useState(false);
const InputRef = useRef(null);
const [Postdata, setPostdata] = useState({ title: "", text: "", category: "" });
const [imageCount, setImageCount] = useState(0); // Track selected image count
const [csvRowCount, setCsvRowCount] = useState(0); // Track CSV row count
const csvRef = useRef(null);
  const dispatch = useDispatch();
  // Fetch single post data
  async function fetchSinglePostData(Current_id) {
    try {
      const { data } = await fetchsinglepost(Current_id);
      console.log(data,":::::")
      setPostdata({...data.post,category:data.post.category.join(",")});
      setIsPublished(data.post.ispublished)
      
    } catch (err) {
      console.log("Error fetching post data:", err);
    }
  }

  useEffect(() => {
    if (Currentid){
         console.log(Currentid,"lllll")
        fetchSinglePostData(Currentid);
      } 
      console.log("IPOIPo")
  }, [Currentid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!iscsv) {
      // Handle single post creation logic here
      if(!Currentid){

        if (imageUrl) {
          dispatch(
            createpost({
              ...Postdata,
              name: user?.name,
              creator: user?._id,
              // creator_img: user?.profile_img || "",
              file: File[0], // Assuming only one image for a single post
              ispublished: isPublished,
            })
          );
        }
        else {
          alert("Please upload an image");
        }
      }else{
       

       if(File[0]){

         dispatch(
           updatepost({
             ...Postdata,
             
             file: File[0], // Assuming only one image for a single post
             ispublished: isPublished,
            },Currentid)
          );
        }else{
          dispatch(
            updatepost({
              ...Postdata,
              ispublished: isPublished,
             },Currentid)
           );

        }
      }
      
    } else {
      
      const formData = new FormData();
      File.forEach((file) => {
        formData.append(`file`, file.file); // Attach each image
      });
      // console.log(File,"lklllkl")
      try{
       
        await bulkUpload(formData); 
        alert("uploaded successfully----")
        toast.success('Images Uploaded successfully')
      }catch(err){
          console.log("bulk image upload -- err",err)
      }
    }
    clear();
   
  };

  function clear() {
    setCurrentid(null);
    setPostdata({ title: "", text: "", tags: "" });
    setImageUrl(null);
    setFile([]);
    setImageCount(0); // Reset image count

  }

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
        
    const allowedTypes = [
      'text/csv', 
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    
    // Validate file type and extension
    const fileExtension = file ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : '';
    if (file && (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension))) {
      alert('Please upload only CSV or Excel files.');
      e.target.value = ''; // Clear the input
      return;
    }
    
    try{
      const {data}=await csvUpload({file})
      console.log(data,"lkjlkljk")
      e.target.value = '';
    }catch(err){
      console.log("csv upload err ---",err)
    }
  };

  const onDrop = (acceptedFiles) => {
    if (iscsv) {
      // Append new files to the existing files array
      const filesWithPreview = acceptedFiles.map((file) => ({
      file,
        preview: URL.createObjectURL(file),
      }));
      setFile((prevFiles) => [...prevFiles, ...filesWithPreview]); // Concatenate new files
  
      setImageCount((prevCount) => prevCount + acceptedFiles.length); // Update image count for bulk mode
    } else {
      const newFile = acceptedFiles[0];
      setFile([newFile]); // Store the single file for single post
      setImageUrl(URL.createObjectURL(newFile));
      setImageCount(1); // Update image count for single mode
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: iscsv, // Enable multiple file uploads for CSV mode
  });

  // Remove image from selection
  const removeImage = (index) => {
    setFile((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      setImageCount(newFiles.length); // Update the image count after removal
      return newFiles;
    });
  };

  return (
    <div className="flex flex-col p-3 rounded-md shadow-md gap-2">
      <div className="text-center text-lg font-bold">
        {Currentid ? "Update" : "Create"} post
      </div>

      {!iscsv ? (
        <>
          <input
            placeholder="title"
            className="border border-gray-700 px-2 py-1 rounded-md mb-2"
            value={Postdata.title}
            onChange={(e) =>
              setPostdata({ ...Postdata, title: e.target.value })
            }
          />
          <textarea
            placeholder="text"
            className="border border-gray-700 px-2 py-1 rounded-md mb-2"
            value={Postdata.text}
            onChange={(e) =>
              setPostdata({ ...Postdata, text: e.target.value })
            }
          />
          <input
            placeholder="tags"
            className="border border-gray-700 px-2 py-1 rounded-md mb-2"
            value={Postdata.category}
            onChange={(e) =>
              setPostdata({ ...Postdata, category: e.target.value.split(",") })
            }
          />

          <PublishCheckbox
            isPublished={isPublished}
            setIsPublished={setIsPublished}
          />

          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
            style={{
              border: "2px dashed #cccccc",
              padding: "20px",
              textAlign: "center",
              marginTop: "10px",
               borderRadius:"5px",
              cursor:"pointer"
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>Drag & drop images here, or click to select files</p>
            )}
          </div>

          <div
            className="image-previews"
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            {File.map((fileWrapper, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={imageUrl}
                  alt={`preview-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IoCloseCircle
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    cursor: "pointer",
                    color: "red",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                />
              </div>
            ))}
          </div>

{

   Currentid?
          <button
            className="bg-blue-500 rounded-md text-gray-50 mt-4 px-4 py-2"
            type="submit"
            onClick={handleSubmit}
          >
            update
          </button>:
          <>
          <button
            className="bg-blue-500 rounded-md text-gray-50 mt-4 px-4 py-2"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-[#DD5B5B] rounded-md text-gray-50 mt-2 px-4 py-2"
            onClick={clear}
          >
            Clear
          </button>
          <button
            className="mt-2 px-4 py-2 rounded-md bg-yellow-500"
            onClick={() => setIsCsv(true)}
          >
            Bulk Upload via CSV
          </button>
          </>
        }
         

        </>
      ) : (
        <>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleCSVUpload}
            className="mb-4"
            ref={csvRef}
            style={{display:'none'}}
          />
        
          <div
        className="bg-[#aaaaaa77] p-2 rounded-md cursor-pointer flex justify-center group"
        onClick={()=>{csvRef.current.click();}}
      >
        {/* Icon with scale effect on hover */}
        <RiFileExcel2Fill className="text-[55px] text-[#1b7119] transition-transform duration-200 transform group-hover:scale-110" />
      </div>
        
          <br/>
    
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
            style={{
              border: "2px  solid gray",
              padding: "20px",
              textAlign: "center",
              marginTop: "10px",
              borderRadius:"5px",
              cursor:"pointer"
            }}
          >
          
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>Drag & drop images here, or click to select files</p>
            )}
          </div>

          <div className="text-lg mt-4">Selected Images: {imageCount}</div>
          <div className="image-previews" style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}>
            {File.map((fileWrapper, index) => (
              <div key={index} className="image-preview bg-[#fcd2d2]"
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={fileWrapper.preview}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover"
                />
                <IoCloseCircle
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    cursor: "pointer",
                    color: "red",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    padding: "1px",
                    fontSize:"25px"
                  }}

                 />
              </div>
            ))}
          </div>

          <button
            className="bg-blue-500 rounded-md text-gray-50 mt-4 px-4 py-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-[#DD5B5B] rounded-md text-gray-50 mt-2 px-4 py-2"
            onClick={clear}
          >
            Clear
          </button>
          <button
            className="mt-2 px-4 py-2 rounded-md bg-yellow-500"
            onClick={() => setIsCsv(false)}
          >
           Single Post
          </button>
        </>
      )}
    </div>
  );
}

export default Form;
