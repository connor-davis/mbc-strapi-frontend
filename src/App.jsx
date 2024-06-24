import { Link, Route, Routes } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

import Footer from "./components/footer/footer";
import ForgotPasswordPage from "./pages/authentication/forgotPassword";
import HeaderImage from "./assets/header.jpg";
import LogoImage from "./assets/logo.jpg";
import PageTextToHtml from "./components/pageContentToHtml";
import ProfilePage from "./pages/profile/profile";
import ResetPasswordPage from "./pages/authentication/resetPassword";
import SignInPage from "./pages/authentication/signIn";
import SignUpPage from "./pages/authentication/signUp";
import { apiUrl } from "./apiUrl";
import axios from "axios";
import { createStore } from "solid-js/store";
import useState from "./hooks/state";
import UnsubscribePage from "./pages/profile/unsubscribe";

function App() {
  const [authState, updateAuthState, clearAuthState] = useState("authState");
  const [userState, updateUserState, clearUserState] = useState("userState");

  // Create a navbar pages store object that will have the pages
  // created in the backend dynamically visible including if they
  // are dropdown items.
  const [navbarPages, setNavbarPages] = createStore([], {
    name: "navbar-pages",
  });

  const [navbarOpen, setNavbarOpen] = createSignal(false);

  // Create the pages store that will store all pages that the
  // router needs to show.
  const [pages, setPages] = createStore([], {
    name: "pages-list",
  });

  onMount(() => {
    setTimeout(() => {
      if (authState.authenticationToken) {
        axios
          .get(apiUrl + "/api/users/me?populate=*", {
            headers: {
              Authorization: "Bearer " + authState.authenticationToken,
            },
          })
          .then((response) => {
            updateUserState(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }

      document.addEventListener("resize", (event) => {
        if (navbarOpen()) setNavbarOpen(false);
      });
    }, 300);

    axios.get(apiUrl + "/api/pages?populate=*").then((response) => {
      setNavbarPages([
        ...response.data.data.map((page) => {
          // Map the pages data that the backend returns in the response.
          return page.attributes.IsDropDown // Check if the page must be a dropdown item.
            ? {
              // If it is.
              name: page.attributes.name,
              slug: page.attributes.slug,
              isDropdown: page.attributes.IsDropDown,
              hideFromNavbar: page.attributes.hideFromNavbar,
              dropdownPages: [
                ...page.attributes.page_contents.data.map(
                  // Map the pages that are related to the page.
                  (page_content) => {
                    return {
                      name: page_content.attributes.title,
                      slug: page_content.attributes.slug,
                    };
                  }
                ),
              ],
            }
            : {
              // If it isn't.
              name: page.attributes.name,
              slug: page.attributes.slug,
              isDropdown: page.attributes.IsDropDown,
              hideFromNavbar: page.attributes.hideFromNavbar,
            };
        }),
      ]);

      response.data.data.map((page) => {
        // Map the pages data returned in the response.
        if (!page.attributes.IsDropDown) {
          // If the page isn't a dropdown item.
          const single = page.attributes.page_contents.data[0]; // Get the page as a single object.

          setPages([
            // Add it to the pages store.
            ...pages,
            {
              slug: single.attributes.slug,
              content: single.attributes.content,
            },
          ]);
        } else {
          setPages([
            // Add all the pages related to the page to the pages store.
            ...pages,
            ...page.attributes.page_contents.data.map((single) => {
              return {
                slug: single.attributes.slug,
                content: single.attributes.content,
              };
            }),
          ]);
        }
      });
    });
  });

  return (
    <div class="flex flex-col w-screen h-screen overflow-y-auto overflow-x-hidden bg-lime-100">
      <div class="flex flex-col w-full h-auto bg-white">
        <div class="flex w-full lg:h-auto justify-center px-96">
          <img src={LogoImage} class="shrink-0 h-full" />
          <img src={HeaderImage} class="hidden lg:block lg:w-full" />
        </div>
        <div class="flex lg:hidden w-full h-auto justify-end text-white bg-gray-800">
          <div
            class="p-2 hover:text-lime-100 hover:bg-gray-700"
            onClick={() => setNavbarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>

          {navbarOpen() && (
            <div class="absolute top-0 left-0 w-screen h-screen bg-gray-800 flex flex-col">
              <div
                class="self-end p-2 hover:text-lime-100 hover:bg-gray-700"
                onClick={() => setNavbarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              {navbarPages.map((page) =>
                !page.isDropdown && !page.hideFromNavbar ? (
                  <Link
                    href={page.slug}
                    class={`${page.isDropdown ? "group relative" : ""}`}
                    onClick={() => setNavbarOpen(false)}
                  >
                    <p class="p-2 hover:text-lime-100 hover:bg-gray-700">
                      {page.name}
                    </p>
                  </Link>
                ) : (
                  !page.hideFromNavbar && (
                    <div class={`${page.isDropdown ? "group relative" : ""}`}>
                      <p class="p-2 hover:text-lime-100 hover:bg-gray-700">
                        {page.name}
                      </p>

                      {page.isDropdown && (
                        <div class="absolute hidden group-hover:flex group-hover:flex-col mt-auto w-64 h-auto p-2 bg-gray-800 shadow">
                          {page.dropdownPages.map((droplet) => (
                            <Link
                              href={droplet.slug}
                              class="p-2 hover:text-lime-100 hover:bg-gray-700 shrink-0"
                              onClick={() => setNavbarOpen(false)}
                            >
                              {droplet.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )
              )}
              {authState.authenticationToken ? (
                <>
                  <Link
                    href="/profile"
                    class={``}
                    onClick={() => setNavbarOpen(false)}
                  >
                    <p class="p-2 hover:text-lime-100 hover:bg-gray-700">
                      Profile
                    </p>
                  </Link>

                  <p
                    class="p-2 hover:text-lime-100 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      clearAuthState();
                      clearUserState();

                      setNavbarOpen(false);

                      setTimeout(() => {
                        window.location.href = window.location.href;
                      });
                    }}
                  >
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href="/signIn"
                    class={``}
                    onClick={() => setNavbarOpen(false)}
                  >
                    <p class="p-2 hover:text-lime-100 hover:bg-gray-700">
                      Login
                    </p>
                  </Link>

                  <Link
                    href="/code-of-conduct"
                    class={``}
                    onClick={() => setNavbarOpen(false)}
                  >
                    <p class="p-2 hover:text-lime-100 hover:bg-gray-700">
                      Join The Club
                    </p>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        <div class="hidden lg:flex w-full h-auto justify-between px-96 text-white bg-gray-800">
          <div class="flex">
            {navbarPages.map(
              (page) =>
                !page.hideFromNavbar && (
                  <Link
                    href={page.slug}
                    class={`${page.isDropdown ? "group relative" : ""}`}
                  >
                    <p class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700">
                      {page.name}
                    </p>

                    {page.isDropdown && (
                      <div class="absolute hidden group-hover:flex group-hover:flex-col mt-auto w-64 h-auto p-2 bg-gray-800">
                        {page.dropdownPages.map((droplet) => (
                          <Link
                            href={droplet.slug}
                            class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700 shrink-0"
                          >
                            {droplet.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </Link>
                )
            )}
          </div>

          <div class="flex">
            {authState.authenticationToken ? (
              <div
                class="group relative"
              >
                <p class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700">
                  Membership
                </p>

                <div class="absolute hidden group-hover:flex group-hover:flex-col mt-auto w-64 h-auto p-2 bg-gray-800">
                  <Link
                    href="/profile"
                    class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700 shrink-0"
                  >
                    Profile
                  </Link>

                  <div
                    class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700 shrink-0"
                    onClick={() => {
                      clearAuthState();
                      clearUserState();

                      setTimeout(() => {
                        window.location.href = window.location.href;
                      });
                    }}
                  >
                    Logout
                  </div>
                </div>
              </div>
            ) : (
              <div
                class="group relative"
              >
                <p class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700">
                  Membership
                </p>

                <div class="absolute hidden group-hover:flex group-hover:flex-col mt-auto w-64 h-auto p-2 bg-gray-800">
                  <Link
                    href="/join-the-club"
                    class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700 shrink-0"
                  >
                    Join
                  </Link>
                  <Link
                    href="/signIn"
                    class="py-2 px-4 hover:text-lime-100 hover:bg-gray-700 shrink-0"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div class="flex flex-col w-full bg-lime-100 mb-auto">
        <Routes>
          {pages.map((page) => (
            <Route
              path={page.slug}
              element={
                <div class="w-full prose max-w-none m-0 prose-p:m-0 prose-h1:m-0 p-5 prose-a:text-orange-600 marker:text-orange-600 prose-headings:p-0 prose-headings:m-0 prose-headings:mt-10 prose-headings:font-medium prose-headings:text-orange-600 rounded-md animate-fade-in duration-50 ease-in-out px-5 md:px-32 bg-lime-100">
                  <PageTextToHtml content={page.content} />
                </div>
              }
            />
          ))}
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
