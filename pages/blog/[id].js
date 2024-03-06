import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { database, storage } from "@/firebase.config";
import { ref as dbRef, onValue, remove, push } from "firebase/database";
import {
  ref as storageRef,
  getDownloadURL,
  deleteObject
} from "@firebase/storage";
import { exportedDarkMode } from "..";
const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  const router = useRouter();
  const [blog, setBlog] = useState({});
  const [blogPhoto, setIsBLogPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotLoading, setIsNotLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [darkMode, setIsDarkMode] = useState(false);

  const getPost = () => {
    if (router.query.id) {
      const userRef = dbRef(database, 'blog-posts/' + router.query.id);
      onValue(userRef, (snapshot) => {
        const blog = snapshot.val();
        setBlog(blog);

      });
      getDownloadURL(storageRef(storage, `${router.query.id}/photo`)).then((url) => {
        setIsBLogPhoto(url);
        setIsLoading(false)
        setIsNotLoading(true)
      }).catch(e => {
        console.log('no logo')
      })
    }
  }
  const deletePost = () => {
    try {
      const imageRef = storageRef(storage, `${router.query.id}/photo`);
      if (imageRef !== null) {
        // Path exists, delete the object
        deleteObject(imageRef)
          .then(() => {
            router.push('/');
          })
          .catch((error) => {
            router.push('/');
          });
      }
      const taskRef = dbRef(database, 'blog-posts/' + router.query.id);
      remove(taskRef);
      setBlog({})
      router.push('/');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  useEffect(() => {
    getPost();
    setIsDarkMode(exportedDarkMode)
  }, []);

  return (
    <>
      <div className={`w-full md:h-screen ${darkMode ? 'dark' : ''}`}>
        <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
          <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
              <button onClick={() => router.push('/')} class="flex items-center rounded px-2 pb-2 mb-5 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-gray-800 "> <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
              </svg>  Go back</button>
              <div class=" mt-50">
                  <button type="button" class="flex-end mt-5 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => router.push(`/blog/${router.query.id}/edit`)} >Edit</button>
                  <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => setIsDelete(true)}>Delete Post</button>
                </div>
              <header class="mb-4 lg:mb-6 not-format">
                <address class="flex items-center mb-6 not-italic">
                  <div class="text-sm text-gray-900 dark:text-white flex flex-row justify-between w-full">
                    {/* <img class="mr-4 w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Jese Leos" /> */}
                    <div>
                      <h1 href="#" rel="author" class="text-4xl font-bold text-gray-900 dark:text-white">{blog.Title}</h1>
                      <p class="text-gray-500 mt-5 dark:text-gray-400">{blog.Author} &nbsp; {blog.Date}</p>
                    </div>

                  </div>

                </address>
              </header>
              <p class="lead text-white mb-5">{blog.Description}</p>
              {isNotLoading && (
                <figure><img src={blogPhoto} alt="" class="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[360px] mb-5" />
                </figure>
              )}
              {isLoading && (
                <div class="animate-pulse h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[360px] mb-5">
                  <svg className="ml-20 w-[350px] h-[350px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.3 6m2.3-9h0M4 19h16c.6 0 1-.4 1-1V6c0-.6-.4-1-1-1H4a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z" />
                  </svg>
                </div>
              )}

            </article>
          </div>
        </main >
        {isDelete &&
          <div class="fixed inset-0 bg-black-500 bg-opacity-75 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-black-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-delete" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold leading-6 text-black" id="modal-title">Delete Post</h3>
                        <div class="mt-2">
                          <p class="text-sm text-black">Are you sure you want to delete this blog? This action cannot be undone. Confirm deletion to proceed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={deletePost}>Delete Post</button>
                    <button type="button" class="focus:outline-none text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-grey-600" onClick={() => setIsDelete(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
}


