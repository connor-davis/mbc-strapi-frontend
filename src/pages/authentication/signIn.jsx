import { Link, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

import { apiUrl } from "../../apiUrl";
import axios from "axios";
import useState from "../../hooks/state";

const SignInPage = ({ }) => {
  const navigate = useNavigate();

  const [authState, updateAuthState] = useState("authState");
  const [userState, updateUserState] = useState("userState");

  const [message, setMessage] = createSignal({});

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  onMount(() => {
    setTimeout(() => {
      if (authState.authenticationToken) {
        navigate("/", { replace: true });
      }
    }, 300);
  });

  const signIn = () => {
    axios
      .post(apiUrl + "/api/auth/local", {
        identifier: username(),
        password: password(),
      })
      .then((response) => {
        setMessage({
          content: "You have been authenticated.",
          type: "success",
        });

        updateAuthState({ authenticationToken: response.data.jwt });
        updateUserState({ ...response.data.user });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      })
      .catch((error) => {
        console.log(error);

        if (error.response.data.error.message.includes("identifier")) {
          setMessage({
            content: error.response.data.error.message.replace(
              "identifier",
              "username"
            ),
            type: "error",
          });
        } else {
          setMessage({
            content: "Your account is not valid. Please make sure you have verified. Or contact an administrator in case you have been blocked.",
            type: "error"
          });
        }
      });
  };

  return (
    <div class="flex flex-col items-center w-full h-full bg-lime-100">
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        class="flex flex-col w-full sm:w-96 h-full p-5 space-y-5"
      >
        <div class="text-lime-700 font-bold uppercase">Member Sign In</div>
        <div class="flex flex-col space-y-3">
          <input
            type="text"
            value={username()}
            onChange={(event) => setUsername(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member username"
          />
          <input
            type="password"
            value={password()}
            onChange={(event) => setPassword(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member password"
          />
        </div>
        <div class="flex flex-col w-full items-start space-y-3">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-2 cursor-pointer">
            </div>
            <button
              type="submit"
              class="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 hover:text-lime-100 cursor-pointer"
              onClick={() => signIn()}
            >
              Login
            </button>
          </div>

          {message().content && (
            <div class="flex flex-col items-center justify-center w-full h-auto">
              <div
                class={`${message().type === "success"
                    ? "text-lime-700"
                    : "text-red-500"
                  }`}
              >
                {message().content}
              </div>
            </div>
          )}

          <div class="flex flex-col w-full space-y-2 items-center">
            <Link href="/forgotPassword" class="text-orange-600 underline">
              Forgot password?
            </Link>
            <div>
              Not a member?{" "}
              <Link href="/signUp" class="text-orange-600 underline">
                Join
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
