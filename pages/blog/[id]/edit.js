import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { database, storage } from "@/firebase.config";
import { ref as dbRef, onValue, update } from "firebase/database";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "@firebase/storage";
import { exportedDarkMode } from "@/pages";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  const router = useRouter();
  const [blog, setBlog] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isReplace, setIsReplace] = useState(false);
  const [isDiscardReplace, setIsDiscardReplace] = useState(true);
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [darkMode, setIsDarkMode] = useState(false);

  const [cat, setCat] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [blogPhoto, setIsBLogPhoto] = useState("");

  const { id } = router.query;

  const current = new Date();
  const now = `${current.getMonth() + 1}/${current.getDate()}/${current.getFullYear()}`;

  if (!router.isReady) {
    return <div>Loading...</div>
  }

  const getPost = () => {
    const userRef = dbRef(database, 'blog-posts/' + router.query.id);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setBlog(data);
      setCat(data.Category);
    });
    if (!isReplace) {
      getDownloadURL(storageRef(storage, `${router.query.id}/photo`)).then((url) => {
        setIsBLogPhoto(url);
      }).catch(e => {
        console.log('no logo')
      })
    }
  }
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 200 * 1024;
    if (file && file.size <= maxSizeInBytes) {
      setIsReplace(false);
      setSelectedImage(file);
      setIsSelectedImage(true)
    } else {
      alert('Please select an image with a size less than or equal to 200KB.');
      event.target.value = null;
    }
  };
  useEffect(() => {
    getPost();
    setIsDarkMode(exportedDarkMode);
  }, []);
  const handleDiscardReplace = () => {
    setIsDiscardReplace(true);
    setIsReplace(false);

  }
  const handleReplace = () => {
    setIsDiscardReplace(false);
    setIsSelectedImage(false)
    setIsReplace(true);

  }
  const saveChanges = (title, desc) => {
    try {
      const updatedPost = {
        Title: title,
        Description: desc,
        Date: now,
        Category: cat,
        PostID: id
      };
      const postRef = dbRef(database, `blog-posts/${id}`);
      update(postRef, updatedPost);
      if (selectedImage === null) {
        console.log("Please Upload Image")
      } else {
        const imageRef = storageRef(storage, `${id}/photo`)
        uploadBytes(imageRef, selectedImage).then(() => {
          getDownloadURL(imageRef).then((url) => {
            setIsBLogPhoto(url)
          });
        });
      }
      router.push(`/`);
    } catch (e) {
      console.log(e);
    }
  };
  const getValue = () => {
    setTitle(blog.Title);
    setDesc(blog.Description);

  }

  return (
    <>
      <div className={`w-full md:h-screen ${darkMode ? 'dark' : ''}`}>
        <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
          <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
              <header class="mb-4 lg:mb-6 not-format">
              <div class="mt-50">
                      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600" onClick={() => saveChanges(title, desc, { id }, cat)}>Save</button>
                      <button type="button" class="mr-5 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => router.push(`/blog/${id}`)}>Cancel Changes</button>
                    </div>
                <address class="flex items-center mb-6 not-italic">
                  <div class="text-sm text-gray-900 dark:text-white flex flex-row justify-between w-full">
                    <div>
                      <h1 href="#" rel="author" class="text-4xl font-bold text-gray-900 dark:text-white">{blog.Title}</h1>
                      <p class="text-gray-500 mt-5 dark:text-gray-400">{blog.Author} &nbsp; {blog.Date}</p>
                    </div>
                    
                  </div>
                </address>
              </header>
              <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={blog.Title} onFocus={getValue} value={title} onChange={(e) => setTitle(e.target.value)}></input>
              <div class="col-span-2 mt-5 sm:col-span-1">
                <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={cat} onFocus={getValue} onChange={(e) => setCat(e.target.value)}>
                  <option selected="">Select category</option>
                  <option value="Tech">Tech</option>
                  <option value="Travel">Travel</option>
                  <option value="Health">Health</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Finance">Finance</option>
                  <option value="Parenting">Parenting</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Love and Relationships">Love and Relationships</option>
                </select>
              </div>
              <textarea id="description" rows="10" class="mt-5 mb-5 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={blog.Description} onFocus={getValue} value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>

              {isDiscardReplace && (
                <>
                  <figure><img src={blogPhoto} alt="" class="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[360px] mb-5" />
                  </figure>
                  <button type="button" onClick={handleReplace} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Upload New Image</button>
                </>
              )}
              {isSelectedImage && (
                <>
                  <figure><img src={URL.createObjectURL(selectedImage)}
                    style={{ objectFit: 'cover' }}
                    class="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[360px] mb-5" />
                  </figure>
                  <button type="button" onClick={handleReplace} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Upload New Image</button>
                </>
              )}
              {isReplace && (
                <>
                  <label for="dropzone-file" class="mt-5 flex flex-col items-center justify-center w-full h-55 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg class="w-5 h-5 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" onChange={handleImageUpload} />

                  </label>
                  <button type="button" onClick={handleDiscardReplace} class="text-white mt-5 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Revert Image</button>
                </>
              )}
            </article>
          </div>
        </main >
      </div>
    </>
  );
}


