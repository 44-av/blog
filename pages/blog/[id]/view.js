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
import { exportedDarkMode } from "@/pages";
const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  const router = useRouter();
  const [blog, setBlog] = useState({});
  const [blogPhoto, setIsBLogPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotLoading, setIsNotLoading] = useState(false);
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

  useEffect(() => {
    getPost();
    setIsDarkMode(exportedDarkMode);
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
    </div>
    </>
  );
}


