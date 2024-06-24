import { Link, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

import { apiUrl } from "../../apiUrl";
import axios from "axios";
import useState from "../../hooks/state";

const SignUpPage = ({ }) => {
  const navigate = useNavigate();

  const [authState, updateAuthState] = useState("authState");
  const [userState, updateUserState] = useState("userState");

  const [message, setMessage] = createSignal({});
  const membershipTypes = ["Single", "Family", "Principal Family"];

  // Member Info
  const [memberTitle, setMemberTitle] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");

  // Member Contact
  const [addressLineOne, setAddressLineOne] = createSignal("");
  const [addressLineTwo, setAddressLineTwo] = createSignal("");
  const [addressLineThree, setAddressLineThree] = createSignal("");
  const [postalCode, setPostalCode] = createSignal("");
  const [residentialArea, setResidentialArea] = createSignal("");
  const [preferredContactNumber, setPreferredContactNumber] = createSignal("");

  // Membership Info
  const [interestedInDayHikes, setInterestedInDayHikes] = createSignal(false);
  const [interestedInBackpacking, setInterestedInBackpacking] =
    createSignal(false);
  const [membershipType, setMembershipType] = createSignal(0);
  const [idPassportNumber, setIdPassportNumber] = createSignal("");

  // Safety Info
  const [nextOfKin, setNextOfKin] = createSignal("");
  const [nextOfKinContact, setNextOfKinContact] = createSignal("");
  const [nextOfKinAddress, setNextOfKinAddress] = createSignal("");
  const [medicalIssues, setMedicalIssues] = createSignal("");
  const [medicalAid, setMedicalAid] = createSignal("");
  const [medicalAidNumber, setMedicalAidNumber] = createSignal("");

  const [agreeToCodeOfConduct, setAgreeToCodeOfConduct] = createSignal(false);

  onMount(() => {
    setTimeout(() => {
      if (authState.authenticationToken) {
        navigate("/", { replace: true });
      }
    }, 300);
  });

  const signUp = () => {
    if (password() !== confirmPassword())
      setMessage({ content: "Passwords do not match.", type: "error" });
    else
      if (agreeToCodeOfConduct()) {
        axios
          .post(apiUrl + "/api/auth/local/register", {
            memberTitle: memberTitle(),
            username: username(),
            firstName: firstName(),
            lastName: lastName(),
            email: email(),
            password: password(),
            addressLineOne: addressLineOne() || "None",
            addressLineTwo: addressLineTwo() || "None",
            addressLineThree: addressLineThree() || "None",
            postalCode: postalCode() || "None",
            residentialArea: residentialArea() || "None",
            preferredContactNumber: preferredContactNumber() || "None",
            membershipType: membershipTypes[membershipType()] || "None",
            idPassportNumber: idPassportNumber() || "None",
            nextOfKin: nextOfKin() || "None",
            nextOfKinContact: nextOfKinContact() || "None",
            nextOfKinAddress: nextOfKinAddress() || "None",
            medicalIssues: medicalIssues() || "None",
            medicalAid: medicalAid() || "None",
            medicalAidNumber: medicalAidNumber() || 0,
          })
          .then((response) => {
            setMessage({
              content: "You have been registered.",
              type: "success",
            });

            updateUserState({ ...response.data.user });

            setTimeout(() => {
              navigate("/signIn", { replace: true });
            }, 1500);
          })
          .catch((error) => {
            setMessage({
              content: error.response.data.error.message.replace(
                "identifier",
                "username"
              ),
              type: "error",
            });
          });
      } else {
        setMessage({
          content: "You need to agree to the Code of Conduct before you can create an account.",
          type: "error"
        });
      }
  };

  return (
    <div class="flex flex-col items-center w-full h-full">
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        class="flex flex-col w-full sm:w-96 h-full p-5 space-y-5"
      >
        <div class="text-lime-700 font-bold uppercase text-lg">
          Join The Club
        </div>
        <div>Fields with a * are required fields.</div>
        <div class="flex flex-col space-y-3">
          <div class="font-bold">Member Info</div>
          <input
            type="text"
            id="memberTitle"
            name="memberTitle"
            value={memberTitle()}
            onChange={(event) => setMemberTitle(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member title"
          />
          <input
            required
            type="text"
            id="firstName"
            name="firstName"
            value={firstName()}
            onChange={(event) => setFirstName(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member first name *"
          />
          <input
            required
            type="text"
            id="lastName"
            name="lastName"
            value={lastName()}
            onChange={(event) => setLastName(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member last name *"
          />
          <input
            required
            type="email"
            id="email"
            name="email"
            value={email()}
            onChange={(event) => setEmail(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member email *"
          />
          <input
            required
            type="text"
            id="username"
            name="username"
            value={username()}
            onChange={(event) => setUsername(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member username *"
          />
          <input
            required
            type="password"
            id="password"
            name="password"
            value={password()}
            onChange={(event) => setPassword(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member password *"
          />
          <input
            required
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword()}
            onChange={(event) => setConfirmPassword(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Member confirm password *"
          />
        </div>
        <div class="flex flex-col space-y-3">
          <div class="font-bold">Member Contact</div>
          <input
            required
            type="text"
            value={addressLineOne()}
            onChange={(event) => setAddressLineOne(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Address Line 1 *"
          />
          <input
            type="text"
            value={addressLineTwo()}
            onChange={(event) => setAddressLineTwo(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Address Line 2"
          />
          <input
            type="text"
            value={addressLineThree()}
            onChange={(event) => setAddressLineThree(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Address Line 3"
          />
          <input
            required
            type="text"
            value={postalCode()}
            onChange={(event) => setPostalCode(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Postal Code *"
          />
          <input
            type="text"
            value={residentialArea()}
            onChange={(event) => setResidentialArea(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Residential Area"
          />
          <input
            type="tel"
            value={preferredContactNumber()}
            onChange={(event) => setPreferredContactNumber(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Preferred Contact Number *"
          />
        </div>
        <div class="flex flex-col space-y-3">
          <div class="font-bold">Membership Info</div>
          <label for="cars">Membership type: *</label>

          <select
            required
            name="membershipType"
            id="membershipType"
            onChange={(event) => setMembershipType(event.target.selectedIndex)}
            class="appearance-none w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
          >
            <option value="single">Single</option>
            <option value="family">Family</option>
            <option value="principleFamily">Principle Family</option>
          </select>

          <input
            required
            type="text"
            value={idPassportNumber()}
            onChange={(event) => setIdPassportNumber(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="ID/Passport Number *"
          />
        </div>

        <div class="flex flex-col space-y-3">
          <div class="font-bold">Safety Info</div>
          <input
            required
            type="text"
            value={nextOfKin()}
            onChange={(event) => setNextOfKin(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Next Of Kin *"
          />
          <input
            type="tel"
            value={nextOfKinContact()}
            onChange={(event) => setNextOfKinContact(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Next Of Kin Contact Number *"
          />
          <input
            required
            type="text"
            value={nextOfKinAddress()}
            onChange={(event) => setNextOfKinAddress(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Next of Kin Address *"
          />
          <textarea
            type="text"
            value={medicalIssues()}
            onChange={(event) => setMedicalIssues(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Medical Issues/Allergies"
          />
          <input
            type="text"
            value={medicalAid()}
            onChange={(event) => setMedicalAid(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Medical Aid"
          />
          <input
            type="number"
            value={medicalAidNumber()}
            onChange={(event) => setMedicalAidNumber(event.target.value)}
            class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
            placeholder="Medical Aid Number"
          />
        </div>

        <div class="flex flex-col w-full items-start space-y-3">
          <div class="flex items-center justify-between w-full">
            <div class="flex w-full items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="agreeToCodeOfConduct"
                name="agreeToCodeOfConduct"
                value="agreeToCodeOfConduct"
                class="cursor-pointer border-l border-t border-r border-b border-orange-600 checked:bg-orange-600 checked:text-white bg-lime-50 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-600 active:text-white focus:bg-orange-500 focus:text-white focus:ring-0 p-2"
                onClick={() => setAgreeToCodeOfConduct(!agreeToCodeOfConduct())}
              />
              <Link
                for="vehicle1"
                class="cursor-pointer"
                href="/code-of-conduct"
              >
                I Agree to the Code of Conduct
              </Link>
            </div>
            <button
              type="submit"
              class="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 hover:text-lime-100 cursor-pointer"
              onClick={() => signUp()}
            >
              Join
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
            <div>
              Already a member?{" "}
              <Link href="/signIn" class="text-orange-600 underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
