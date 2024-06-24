import { Link, useLocation, useParams } from "@solidjs/router";
import { createMemo, createSignal, onMount } from "solid-js";

import { apiUrl } from "../../apiUrl";
import axios from "axios";
import useState from "../../hooks/state";

const ResetPasswordPage = ({}) => {
  const location = useLocation();
  const code = createMemo(() => location.query.code);

  const [authState, updateAuthState] = useState("authState");
  const [userState, updateUserState] = useState("userState");

  const [message, setMessage] = createSignal({});

  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");

  const resetPassword = () => {
    axios
      .post(apiUrl + "/api/auth/reset-password", {
        password: password(),
        passwordConfirmation: confirmPassword(),
        code: code(),
      })
      .then((response) => {
        setMessage({
          content: "Your password has been reset.",
          type: "success",
        });

        updateAuthState({ authenticationToken: response.data.jwt });
        updateUserState({ ...response.data.user });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      })
      .catch((error) => {
        setMessage({
          content: error.response.data.error.message,
          type: "error",
        });
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
        <div class="text-lime-700 font-bold uppercase">Reset Password</div>
        <div class="flex flex-col space-y-3">
          <input
            type="password"
            value={password()}
            onChange={(event) => setPassword(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword()}
            onChange={(event) => setConfirmPassword(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Confirm new password"
          />
        </div>
        <div class="flex flex-col w-full items-start space-y-3">
          <div class="flex items-center justify-between w-full">
            <Link href="/signIn" class="text-orange-600 underline">
              Cancel
            </Link>
            <button
              type="submit"
              class="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 hover:text-lime-100 cursor-pointer"
              onClick={() => resetPassword()}
            >
              Reset Password
            </button>
          </div>
        </div>
        {message().content && (
          <div class="flex flex-col items-center justify-center w-full h-auto">
            <div
              class={`${
                message().type === "success" ? "text-lime-700" : "text-red-500"
              }`}
            >
              {message().content}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
