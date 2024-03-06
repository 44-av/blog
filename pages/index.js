import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import {
  GoogleAuthProvider, signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged, inMemoryPersistence,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  UserCredential,

} from "firebase/auth";
import { auth } from "@/firebase.config";
import React, { useState, useEffect } from "react";
import { database, storage } from "@/firebase.config";
import { ref as dbRef, set, onValue } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
const inter = Inter({ subsets: ["latin"] });

const LoadingCards = () => {
  return (
    <>
      <div class="grid gap-8 lg:grid-cols-1">
        <article class=" animate-pulse h-40 mt-2 p-6 bg-white border w-[80vh] border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-5 text-gray-500">
            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-2"></div>
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-1"></div>
          </div>
          <div class="h-2 bg-slate-700 rounded"></div>
        </article>
      </div>
      <div class="grid gap-8 lg:grid-cols-1">
        <article class=" animate-pulse h-40 mt-2 p-6 bg-white border w-[80vh] border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-5 text-gray-500">
            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-2"></div>
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-1"></div>
          </div>
          <div class="h-2 bg-slate-700 rounded"></div>
        </article>
      </div>
      <div class="grid gap-8 lg:grid-cols-1">
        <article class=" animate-pulse h-40 mt-2 p-6 bg-white border w-[80vh] border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-5 text-gray-500">
            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-2"></div>
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-1"></div>
          </div>
          <div class="h-2 bg-slate-700 rounded"></div>
        </article>
      </div>
      <div class="grid gap-8 lg:grid-cols-1">
        <article class=" animate-pulse h-40 mt-2 p-6 bg-white border w-[80vh] border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-5 text-gray-500">
            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-2"></div>
            <div class="h-2 mb-5 bg-slate-700 rounded col-span-1"></div>
          </div>
          <div class="h-2 bg-slate-700 rounded"></div>
        </article>
      </div>
    </>

  )
}

const Posts = ({ Id, Title, Categ, Desc, DateCreated, Author, MyBlog }) => {
  const router = useRouter();
  const [blogPhoto, setIsBLogPhoto] = useState();

  useEffect(() => {
    getDownloadURL(storageRef(storage, `${Id}/photo`)).then((url) => {
      setIsBLogPhoto(url);
      setIsLoading(false);
      setIsNotLoading(true);
    }).catch(e => {
      console.log('no logo')
    })
  })
  return (
    <>
      <article class="p-6 mt-2 bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-5 text-gray-500">
          <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
            <svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
            {Categ}
          </span>
          <span class="text-sm">{DateCreated}</span>
        </div>
        <img class="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[360px] mb-5" src={blogPhoto} />
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{Title}</a></h2>
        <p class="mb-5 font-light text-gray-500 dark:text-gray-400">{Desc}</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <img class="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" />
            <span class="font-medium dark:text-white">
              {Author}
            </span>
          </div>
          {MyBlog ? (
            <button class="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline" onClick={() => router.push(`/blog/${Id}`)}> Read More
              <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          ) :
            <button class="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline" onClick={() => router.push(`/blog/${Id}/view`)}> Read More
              <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          }

        </div>
      </article>

    </>

  )

}
export let exportedDarkMode;
export default function Home() {
  const provider = new GoogleAuthProvider();
  const current = new Date();
  const router = useRouter();

  const formattedDate = current.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  const [darkMode, setDarkMode] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [isMsg, setIsMsg] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [isNoSelectedImage, setIsNoSelectedImage] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);

  const [title, setIsTitle] = useState("");
  const [categ, setIsCateg] = useState("");
  const [desc, setIsDesc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [msg, setMsg] = useState("");
  const [msgTitle, setMsgTitle] = useState("");

  const [isToLogin, setIsToLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(true);
  const [isAll, setIsAll] = useState(true);
  const [isMyBlog, setIsMyBlog] = useState(false);

  const [allPosts, setIsPosts] = useState([]);

  const [userName, setIsUserName] = useState("");

  const handleGoogleAuth = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
          const domain = user.email;
          setIsUserName(user.displayName);
          const emailDomain = domain.split('@')[1];
          const allowedDomain = ["goabroad.com", "gaplabs.ph", "impact-travel-group.com"]
          if (allowedDomain.includes(emailDomain)) {
            setIsToLogin(false)
            setIsNotLoggedIn(false)
            setIsLoggedIn(true)
          } else {
            user.delete().then(() => {
              console.log('User deleted successfully');
            }).catch((error) => {
              console.error('Error deleting user:', error);
            });
            alert('Access denied. Please contact support for assistance.');
          }
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
  }
  const getPosts = () => {
    setIsLoading(true);

    const tasksRef = dbRef(database, 'blog-posts');
    return onValue(tasksRef, (snapshot) => {
      const post = [];
      snapshot.forEach((childSnapshot) => {
        post.push(childSnapshot.val());
      });
      setIsLoading(false);
      setSelectedImage(null);
      return setIsPosts(post);
    });
  };
  const checkUserToWrite = () => {
    if (isLoggedIn) {
      setIsToLogin(false)
      setIsAdding(true);
    } else {
      setIsToLogin(true)
    }
  }
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 500 * 1024;
    if (file && file.size <= maxSizeInBytes) {
      setSelectedImage(file);
      setIsSelectedImage(true);
      setIsNoSelectedImage(false);
    } else {
      alert('Please select an image with a size less than or equal to 200KB.');
      event.target.value = null;
    }
  };
  const handleChangePhoto = (e) => {
    e.preventDefault();
    setIsNoSelectedImage(true)
    setIsSelectedImage(false)
    setSelectedImage(null);
  }
  const handleOkay = () => {
    setIsMsg(false);
    router.reload();

  }
  const handleClickMyBlog = () => {
    setIsMyBlog(true);
    setIsAll(false)
  }
  const handleClickAll = () => {
    setIsMyBlog(false);
    setIsAll(true)
  }
  const addPost = (title, cat, desc) => {
    const postID = "BP" + Math.floor(10000000 + Math.random() * 90000000);
    try {
      if (title === "" && cat === "" && desc === "" && selectedImage === null) {
        alert("Fill up all fields and Upload Image")
      } else {
        set(dbRef(database, 'blog-posts/' + postID), {
          PostID: postID,
          Title: title,
          Category: cat,
          Description: desc,
          Date: formattedDate,
          Author: userName
        });
        const imageRef = storageRef(storage, `${postID}/photo`)
        uploadBytes(imageRef, selectedImage).then(() => {
          getDownloadURL(imageRef)
        });
        setSelectedImage(null);
        setIsTitle("");
        setIsCateg("");
        setIsDesc("");
        setIsMsg(true);
        setMsg("Congratulations! Your blog has been successfully added. Start sharing your thoughts and ideas with the world!")
        setMsgTitle("Success!");
        setIsAdding(false);
      }
    } catch (e) {
      alert(e)
    }
  }
  useEffect(() => {
    getPosts();
    exportedDarkMode = darkMode;
  }, [])
  return (
    <div className={`w-full md:h-screen ${darkMode ? 'dark' : ''}`}>
      <nav class="bg-white border-gray-200 dark:bg-gray-900 ">
        {/* Left Side */}
        <div class="max-w-screen-xl mx-auto p-1 grid gap-1 grid-cols-4 grid-rows-1 h-[70px]">
          <div class="flex w-[30vh]">
            <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">GapBlog</span>
            </a>
          </div>
          {/* Right Side */}
          <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse pl-5">
            <div class="ml-10 mr-2 mt-2">
              {darkMode ? (
                <>
                  <button onClick={() => setDarkMode(false)}>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 0 1-.5-18v0A9 9 0 0 0 20 15h.5a9 9 0 0 1-8.5 6Z" />
                    </svg>
                  </button>
                </>
              ) :
                <>
                  <button onClick={() => setDarkMode(true)}>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.3 5A1 1 0 0 0 5 6.2l1.4 1.5a1 1 0 0 0 1.5-1.5L6.3 5Zm12.8 1.3A1 1 0 0 0 17.7 5l-1.5 1.4a1 1 0 0 0 1.5 1.5L19 6.3ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.8 17.7a1 1 0 1 0-1.5-1.5L5 17.7A1 1 0 1 0 6.3 19l1.5-1.4Zm9.9-1.5a1 1 0 0 0-1.5 1.5l1.5 1.4a1 1 0 0 0 1.4-1.4l-1.4-1.5ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" clip-rule="evenodd" />
                    </svg>

                  </button>
                </>
              }
            </div>
            <div class="ml-10">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5.4V3m0 2.4a5.3 5.3 0 0 1 5.1 5.3v1.8c0 2.4 1.9 3 1.9 4.2 0 .6 0 1.3-.5 1.3h-13c-.5 0-.5-.7-.5-1.3 0-1.2 1.9-1.8 1.9-4.2v-1.8A5.3 5.3 0 0 1 12 5.4ZM8.7 18c.1.9.3 1.5 1 2.1a3.5 3.5 0 0 0 4.6 0c.7-.6 1.3-1.2 1.4-2.1h-7Z" />
              </svg>
            </div>
            <div class="flex p-3 w-full">

              {isLoggedIn &&
                <span class="block text-sm font-semibold ml-2 mt-1 text-gray-900 dark:text-white">{userName}</span>
              }
              {isNotLoggedIn &&
                <button type="button" onClick={() => setIsToLogin(true)} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
              }
            </div>

            <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-blue-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          {/* Search */}
          <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 col-span-2" id="navbar-user">
            <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span class="sr-only">Search</span>
            </button>
            <div class="relative hidden w-full h-full md:block">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span class="sr-only">Search icon</span>
              </div>
              <input type="text" id="search-navbar" class="block w-full h-full p-2 ps-10 bg-white dark:bg-gray-900 text-sm focus:outline-0 text-gray-900 dark:placeholder-gray-400 dark:text-white " placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
      </nav>
      {/* Landing Page */}
      <section class="bg-white dark:bg-gray-800">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Your words ignite worlds</h1>
          <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Here at BlogSpace where stories like parenting, lifestyle, career are valued. <br></br>Start sharing your story today!</p>
          <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">

            <button onClick={checkUserToWrite} class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-blue-700 dark:focus:ring-gray-800">
              <svg class="w-6 h-6 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M8 15h7v0h0-7Zm12-9H4a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1ZM6 9h0v0h0v0Zm0 3h0v0h0v0Zm0 3h0v0h0v0Zm3-6h0v0h0v0Zm0 3h0v0h0v0Zm3-3h0v0h0v0Zm0 3h0v0h0v0Zm3 0h0v0h0v0Zm3 0h0v0h0v0Zm0 3h0v0h0v0Zm-3-6h0v0h0v0Zm3 0h0v0h0v0Z" />
              </svg>
              Write Blog
            </button>

          </div>
        </div>
      </section>

      {/* Content */}
      <div class="bg-white border-gray-200 dark:bg-gray-900 ">
        <div class="max-w-screen-xl mx-auto p-1 grid gap-1 grid-cols-4 grid-rows-1 h-full">
          {/* side bar */}
          <div class="relative h-full rounded-lg w-[30vh]">
            <div class="h-full px-3 py-4 overflow-y-auto">
              <ul class="space-y-2 font-medium">
                <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700 group">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v13H7a2 2 0 0 0-2 2Zm0 0c0 1.1.9 2 2 2h12M9 3v14m7 0v4" />
                    </svg>
                    <span class="ms-3">Blogs</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700 group">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <span class="flex-1 ms-3 whitespace-nowrap">Leaderboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700 group">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd" />
                    </svg>

                    <span class="flex-1 ms-3 whitespace-nowrap">Profile</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700 group">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M17 10v1.1l1 .5.8-.8 1.4 1.4-.8.8.5 1H21v2h-1.1l-.5 1 .8.8-1.4 1.4-.8-.8a4 4 0 0 1-1 .5V20h-2v-1.1a4 4 0 0 1-1-.5l-.8.8-1.4-1.4.8-.8a4 4 0 0 1-.5-1H11v-2h1.1l.5-1-.8-.8 1.4-1.4.8.8a4 4 0 0 1 1-.5V10h2Zm.4 3.6c.4.4.6.8.6 1.4a2 2 0 0 1-3.4 1.4A2 2 0 0 1 16 13c.5 0 1 .2 1.4.6ZM5 8a4 4 0 1 1 8 .7 7 7 0 0 0-3.3 3.2A4 4 0 0 1 5 8Zm4.3 5H7a4 4 0 0 0-4 4v1c0 1.1.9 2 2 2h6.1a7 7 0 0 1-1.8-7Z" clip-rule="evenodd" />
                    </svg>
                    <span class="flex-1 ms-3 whitespace-nowrap">Preferences</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Blog Posts */}
          <div class="dark:bg-gray-900 h-full w-[80vh] col-span-2">
            <div class="bg-pink w-full h-full">
              {/* Tab Bar*/}
              <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul class="flex flex-wrap -mb-px">
                  <li class="me-2">
                    <button class={`${isAll ? "inline-block p-4 border-b-2 border-blue-600 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}`} onClick={handleClickAll}>All</button>
                  </li>
                  {isLoggedIn &&
                    <li class="me-2">
                      <button class={`${isMyBlog ? "inline-block p-4 border-b-2 border-blue-600 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}`} onClick={handleClickMyBlog}>My Blog</button>

                    </li>
                  }
                </ul>
              </div>
              {isLoading && (
                <LoadingCards />
              )}

              {isAll && allPosts
                .filter((post) => {
                  return searchTerm.toLowerCase() === "" ? post : post.Title.toLowerCase().includes(searchTerm) ? post : post.Description.toLowerCase().includes(searchTerm)
                })
                .sort((a, b) => new Date(b.Date) - new Date(a.Date))
                .map((post, index) => (
                  <Posts
                    key={index}
                    Id={post.PostID}
                    Title={post.Title}
                    Categ={post.Category}
                    DateCreated={post.Date}
                    Desc={post.Description}
                    Author={post.Author}
                    MyBlog={false}

                  />
                ))}
              {isMyBlog && allPosts

                .filter((post) => {
                  return post.Author === userName
                })
                .filter((post) => {
                  return searchTerm.toLowerCase() === "" ? post : post.Title.toLowerCase().includes(searchTerm) ? post : post.Description.toLowerCase().includes(searchTerm)
                })

                .sort((a, b) => new Date(b.Date) - new Date(a.Date))
                .map((post, index) => (
                  <Posts
                    key={index}
                    Id={post.PostID}
                    Title={post.Title}
                    Categ={post.Category}
                    DateCreated={post.Date}
                    Desc={post.Description}
                    Author={post.Author}
                    MyBlog={true}

                  />
                ))}
            </div>
          </div>

          {/* Top Topics */}
          <div class="relative h-full rounded-lg w-[30vh]">
            <div class="h-full px-3 py-4 overflow-y-auto">
              <div>
                <h1 class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-4xl dark:text-white">Top Tags</h1>
                <h1 class="font-semibold mb-2">lorem ipsum</h1>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">#NextJs</button>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">#Tailwind</button>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">#Firebase</button>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">#React</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      {isToLogin &&
        <div class="relative z-1 w-full" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
          <div class="fixed inset-0 z-10 w-full overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative p-4 max-w-full max-h-fit m-90">
                <div class="relative bg-white rounded-lg shadow max-w-full dark:bg-gray-700 w-[30vw]">
                  <div class="flex items-center justify-end p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal" onClick={() => setIsToLogin(false)}>
                      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div class="p-8">
                    <div class="space-y-4">
                      <h2 class="mb-8 text-2xl ml-10 text-cyan-900 dark:text-white font-bold">Log in to BlogSite
                      </h2>
                    </div>
                    <div class="mt-10 grid space-y-4">
                      <button type="button" onClick={handleGoogleAuth}
                        class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
                        <div class="relative flex items-center space-x-4 justify-center">
                          <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                            class="absolute left-0 w-5" alt="google logo" />
                          <span
                            class="block w-max font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue
                            with Google
                          </span>
                        </div>
                      </button>
                    </div>
                    <div class="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
                      <p class="text-xs">By proceeding, you agree to our
                        <a href="/privacy-policy/" class="underline">Terms of Use</a>
                        and confirm you have read our
                        <a href="/privacy-policy/" class="underline">Privacy and Cookie Statement</a>.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      }
      {/* Add Modal */}
      {isAdding &&
        <div class="relative z-1 w-full" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
          <div class="fixed inset-0 z-10 w-full overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative p-4 max-w-full max-h-fit m-90">
                <div class="relative bg-white rounded-lg shadow max-w-full dark:bg-gray-700">
                  <div class="flex items-center justify-end p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      New Blog Post
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal" onClick={() => setIsAdding(false)}>
                      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                  </div>
                  <form class="p-4 md:p-6">
                    <div class="grid gap-4 mb-4 grid-cols-40">
                      <div class="flex items-center justify-center w-full col-span-10">
                        {isSelectedImage && (
                          <>
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Profile Preview"
                              class="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[360px]"
                              style={{ objectFit: 'cover' }}
                            />
                          </>

                        )}
                        {isNoSelectedImage && (
                          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-55 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg class="w-5 h-5 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                              </svg>
                              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" onChange={handleImageUpload} />

                          </label>
                        )}

                      </div>
                      <div class="col-span-10">
                        <button type="button" class="h-10 w-50 mt-2 ml-2 p-2.5 text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={handleChangePhoto} >Change Photo</button>
                        <label for="price" class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input type="text" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Title" required="" value={title} onChange={(e) => setIsTitle(e.target.value)} />
                      </div>
                      <div class="col-span-10">
                        <label for="category" class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={categ} onChange={(e) => setIsCateg(e.target.value)}>
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
                      <div class="col-span-10">
                        <label for="description" class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea type="content" id="description" rows="6" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write description here" value={desc} onChange={(e) => setIsDesc(e.target.value)}></textarea>
                      </div>
                    </div>
                    <button type="button" class="h-10 text-white flex text-center items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full" onClick={() => addPost(title, categ, desc)}>
                      <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                      Add new Post
                    </button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {isMsg &&
        <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green  -100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm9.4-5.5a1 1 0 1 0 0 2 1 1 0 1 0 0-2ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4c0-.6-.4-1-1-1h-2Z" clip-rule="evenodd" />
                      </svg>

                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 class="text-base font-semibold leading-6 text-black" id="modal-title">{msgTitle}</h3>
                      <div class="mt-2">
                        <p class="text-sm text-black">{msg}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-red-900" onClick={handleOkay}>Okay</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

  );
}
