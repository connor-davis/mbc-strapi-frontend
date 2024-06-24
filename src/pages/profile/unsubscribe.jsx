import { createSignal, onMount } from "solid-js";

import { apiUrl } from "../../apiUrl";
import axios from "axios";
import { useNavigate } from "@solidjs/router";
import useState from "../../hooks/state";

const UnsubscribePage = ({ }) => {
    const navigate = useNavigate();

    const [authState, updateAuthState] = useState("authState");
    const [userState, updateUserState] = useState("userState");

    const [message, setMessage] = createSignal({});
    const [email, setEmail] = createSignal("");

    var qs = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    onMount(() => {
        setEmail(qs["email"]);
    });

    const unsubscribe = () => {
        axios.post(apiUrl + "/api/unsubscribed-emails", {
            data: {
                email: email(),
            }
        }).then((response) => {
            setMessage({
                content: "Your email has been unsubscribed.",
                type: "success"
            });
        }).catch((error) => {
            setMessage({
                content: "Failed to unsubscribe your email. Server error.",
                type: "error"
            });
        });
    }

    return (
        <div class="flex flex-col items-center">
            <div class="flex flex-col w-full sm:w-96 space-y-5 pt-10">
                <div class="text-xl text-orange-500 font-bold">
                    Unsubscribe From Emails
                </div>
                <div class="">Are you sure you would like to unsubscribe from MBC's emails?</div>
                <input
                    class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                    value={email()}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    placeholder="Your email"
                />
                <div
                    class="px-3 py-1 bg-gray-800 text-white text-center hover:bg-gray-700 hover:text-lime-100 cursor-pointer select-none"
                    onClick={() => unsubscribe()}
                >
                    Unsubscribe
                </div>
                {message().content && (
                    <div class="flex flex-col items-center justify-center w-full h-auto">
                        <div
                            class={`${message().type === "success" ? "text-lime-700" : "text-red-500"
                                }`}
                        >
                            {message().content}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default UnsubscribePage;