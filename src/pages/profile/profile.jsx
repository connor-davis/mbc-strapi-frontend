import { createSignal, onMount } from "solid-js";

import Tabs from "../../components/tabs/tabs";
import { apiUrl } from "../../apiUrl";
import axios from "axios";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import useState from "../../hooks/state";

const ProfilePage = ({}) => {
  const navigate = useNavigate();

  const [authState, updateAuthState] = useState("authState");
  const [userState, updateUserState] = useState("userState");

  const [message, setMessage] = createSignal({});
  const membershipTypes = ["Single", "Family", "Principal Family"];

  const [tabNames, setTabNames] = createStore(
    ["Basic", "Contact", "Membership"],
    { name: "tab-names" }
  );

  const [isEditingProfile, setIsEditingProfile] = createSignal(false);

  onMount(() => {
    setTimeout(() => {
      if (!authState.authenticationToken) {
        navigate("/signIn", { replace: true });
      }

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
    }, 300);
  });

  const updateProfile = () => {
    axios
      .put(
        apiUrl + "/api/users/" + userState.id,
        {
          memberTitle: userState.memberTitle,
          username: userState.username,
          firstName: userState.firstName,
          lastName: userState.lastName,
          email: userState.email,
          addressLineOne: userState.addressLineOne,
          addressLineTwo: userState.addressLineTwo,
          addressLineThree: userState.addressLineThree,
          postalCode: userState.postalCode,
          residentialArea: userState.residentialArea,
          homePhone: userState.homePhone,
          cellPhone: userState.cellPhone,
          workPhone: userState.workPhone,
          interestedInDayHikes: userState.interestedInDayHikes,
          interestedInBackpacking: userState.interestedInBackpacking,
          membershipType:
            membershipTypes[membershipTypes.indexOf(userState.membershipType)],
          idPassportNumber: userState.idPassportNumber,
          nextOfKin: userState.nextOfKin,
          nextOfKinContact: userState.nextOfKinContact,
          nextOfKinAddress: userState.nextOfKinAddress,
          medicalIssues: userState.medicalIssues,
          medicalAid: userState.medicalAid,
          medicalAidNumber: userState.medicalAidNumber,
        },
        {
          headers: { Authorization: "Bearer " + authState.authenticationToken },
        }
      )
      .then((response) => {
        setMessage({
          content: "Your profile has been updated.",
          type: "success",
        });

        setTimeout(() => {
          setMessage({});
          window.location.href = window.location.href;
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
  };

  const updateUser = (key, value) => {
    const userBase = {}; // Create an empty object for the users details
    const userRoleBase = {}; // Create an empty object for the users role details

    for (let key in userState) {
      // Loop through the users details keys
      userBase[key] = userState[key]; // Set the value based on key in the empty growing object
    }

    for (let key in userState["role"]) {
      // Loop through the users details role keys
      userRoleBase[key] = userState["role"][key]; // Set the value based on key in the empty growing object
    }

    userBase[key] = value; // Update one of the users details values

    updateUserState({ ...userBase, role: userRoleBase }); // Update the entire userState
  };

  return (
    <div class="flex flex-col w-full h-full px-5 lg:px-64 xl:px-96">
      <div class="flex flex-col items-start w-full h-full p-2 gap-2">
        <div class="flex flex-wrap gap-2 items-center justify-between w-full">
          <div class="text-xl text-orange-500 font-bold">
            {userState.firstName + " " + userState.lastName}' Profile Page
          </div>
          <div
            class="px-3 w-full md:w-auto py-1 bg-gray-800 text-white hover:bg-gray-700 hover:text-lime-100 cursor-pointer select-none"
            onClick={() => {
              if (isEditingProfile()) {
                setTabNames(["Basic", "Contact", "Membership"]);
                updateProfile();
                setIsEditingProfile(false);
              } else {
                setIsEditingProfile(true);
                setTabNames(["Basic", "Contact", "Membership", "Safety"]);
              }
            }}
          >
            {isEditingProfile() ? "Update Profile" : "Edit Profile"}
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

        <Tabs names={tabNames}>
          {/* Basic Info */}
          <div
            class={`flex flex-col space-y-3 ${
              isEditingProfile()
                ? ""
                : "bg-lime-50 border-l border-t border-r border-b border-orange-500 p-2"
            }`}
          >
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Title:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.memberTitle}
                  onChange={(event) =>
                    updateUser("memberTitle", event.target.value)
                  }
                  placeholder="Member title"
                />
              ) : (
                <div>{userState.memberTitle || "--"}</div>
              )}
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">First Name:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.firstName}
                  onChange={(event) =>
                    updateUser("firstName", event.target.value)
                  }
                  placeholder="Member first name"
                />
              ) : (
                <div>{userState.firstName || "--"}</div>
              )}
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Last Name:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.lastName}
                  onChange={(event) =>
                    updateUser("lastName", event.target.value)
                  }
                  placeholder="Member last name"
                />
              ) : (
                <div>{userState.lastName || "--"}</div>
              )}
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Username:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.username}
                  onChange={(event) =>
                    updateUser("username", event.target.value)
                  }
                  placeholder="Member username"
                />
              ) : (
                <div>{userState.username || "--"}</div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div
            class={`flex flex-col space-y-3 ${
              isEditingProfile()
                ? ""
                : "bg-lime-50 border-l border-t border-r border-b border-orange-500 p-2"
            }`}
          >
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Residential Area:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.residentialArea}
                  onChange={(event) =>
                    updateUser("residentialArea", event.target.value)
                  }
                  placeholder="Residential Area"
                />
              ) : (
                <div>{userState.residentialArea || "--"}</div>
              )}
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">
                {isEditingProfile() ? "Address Line One:" : "Address:"}
              </div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.addressLineOne}
                  onChange={(event) =>
                    updateUser("addressLineOne", event.target.value)
                  }
                  placeholder="Address Line One"
                />
              ) : (
                <div>
                  {userState.addressLineOne || "--"}
                  {(userState.addressLineTwo &&
                    ", " + userState.addressLineTwo) ||
                    ""}
                  {(userState.addressLineThree &&
                    ", " + userState.addressLineThree) ||
                    ""}
                </div>
              )}
            </div>
            {isEditingProfile() && (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Address Line Two:</div>
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.addressLineTwo}
                  onChange={(event) =>
                    updateUser("addressLineTwo", event.target.value)
                  }
                  placeholder="Address Line Two"
                />
              </div>
            )}
            {isEditingProfile() && (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Address Line Three:</div>
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.addressLineThree}
                  onChange={(event) =>
                    updateUser("addressLineThree", event.target.value)
                  }
                  placeholder="Address Line Three"
                />
              </div>
            )}
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Area Code:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.postalCode}
                  onChange={(event) =>
                    updateUser("postalCode", event.target.value)
                  }
                  placeholder="Postal Code"
                />
              ) : (
                <div>{userState.postalCode || "--"}</div>
              )}
            </div>
            {isEditingProfile() && (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Home Phone:</div>
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.homePhone}
                  onChange={(event) =>
                    updateUser("homePhone", event.target.value)
                  }
                  placeholder="Home phone"
                />
              </div>
            )}
            {isEditingProfile() && (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Cell Phone:</div>
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.cellPhone}
                  onChange={(event) =>
                    updateUser("cellPhone", event.target.value)
                  }
                  placeholder="Cell phone"
                />
              </div>
            )}
            {isEditingProfile() && (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Work Phone:</div>
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.workPhone}
                  onChange={(event) =>
                    updateUser("workPhone", event.target.value)
                  }
                  placeholder="Work phone"
                />
              </div>
            )}
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Email:</div>
              {isEditingProfile() ? (
                <input
                  class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                  value={userState.email}
                  onChange={(event) => updateUser("email", event.target.value)}
                  placeholder="Member email"
                />
              ) : (
                <div>{userState.email || "--"}</div>
              )}
            </div>
          </div>

          {/* Membership Info */}
          <div
            class={`flex flex-col space-y-3 ${
              isEditingProfile()
                ? ""
                : "bg-lime-50 border-l border-t border-r border-b border-orange-500 p-2"
            }`}
          >
            {isEditingProfile() ? (
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="interestedInDayHikes"
                  name="interestedInDayHikes"
                  checked={userState.interestedInDayHikes}
                  onClick={() =>
                    updateUser(
                      "interestedInDayHikes",
                      !userState.interestedInDayHikes
                    )
                  }
                  class="cursor-pointer border-l border-t border-r border-b border-orange-600 checked:bg-orange-600 checked:text-white bg-lime-50 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-600 active:text-white focus:bg-orange-500 focus:text-white focus:ring-0 p-2"
                />
                <label
                  for="vehicle1"
                  class="cursor-pointer"
                  onClick={() =>
                    updateUser(
                      "interestedInDayHikes",
                      !userState.interestedInDayHikes
                    )
                  }
                >
                  Interested in day hikes?
                </label>
              </div>
            ) : (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Interested in day hikes:</div>
                <div>{userState.interestedInDayHikes ? "Yes" : "No"}</div>
              </div>
            )}

            {isEditingProfile() ? (
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="interestedInBackpacking"
                  name="interestedInBackpacking"
                  checked={userState.interestedInBackpacking}
                  onClick={() =>
                    updateUser(
                      "interestedInBackpacking",
                      !userState.interestedInBackpacking
                    )
                  }
                  class="cursor-pointer border-l border-t border-r border-b border-orange-600 checked:bg-orange-600 checked:text-white bg-lime-50 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-600 active:text-white focus:bg-orange-500 focus:text-white focus:ring-0 p-2"
                />
                <label
                  for="vehicle1"
                  class="cursor-pointer"
                  onClick={() =>
                    updateUser(
                      "interestedInBackpacking",
                      !userState.interestedInBackpacking
                    )
                  }
                >
                  Interested in backpacking?
                </label>
              </div>
            ) : (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Interested in backpacking:</div>
                <div>{userState.interestedInBackpacking ? "Yes" : "No"}</div>
              </div>
            )}

            {isEditingProfile() && (
              <input
                required
                type="text"
                value={userState.idPassportNumber}
                onChange={(event) =>
                  updateUser("idPassportNumber", event.target.value)
                }
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                placeholder="ID/Passport Number *"
              />
            )}

            {!isEditingProfile() && (
              <div class="flex flex-col space-y-2">
                <div class="font-bold">Leader:</div>
                <div>
                  {userState.role && userState.role.name === "Leader"
                    ? "Yes"
                    : "No"}
                </div>
              </div>
            )}
          </div>

          {/* Safety Info */}
          <div class={`flex flex-col space-y-3`}>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Next Of Kin:</div>
              <input
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                value={userState.nextOfKin}
                onChange={(event) =>
                  updateUser("nextOfKin", event.target.value)
                }
                placeholder="Next Of Kin"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Next Of Kin Contact:</div>
              <input
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                value={userState.nextOfKinContact}
                onChange={(event) =>
                  updateUser("nextOfKinContact", event.target.value)
                }
                placeholder="Next Of Kin Contact"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Next Of Kin Address:</div>
              <input
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                value={userState.nextOfKinAddress}
                onChange={(event) =>
                  updateUser("nextOfKinAddress", event.target.value)
                }
                placeholder="Next Of Kin Address"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Medical Issues:</div>
              <textarea
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                value={userState.medicalIssues}
                onChange={(event) =>
                  updateUser("medicalIssues", event.target.value)
                }
                placeholder="Medical Issues"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Medical Aid:</div>
              <input
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                value={userState.medicalAid}
                onChange={(event) =>
                  updateUser("medicalAid", event.target.value)
                }
                placeholder="Medical Aid"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="font-bold">Medical Aid Number:</div>
              <input
                class="w-full h-auto px-3 py-2 bg-lime-50 border-l border-t border-r border-b border-orange-600 outline-none"
                value={userState.medicalAidNumber}
                onChange={(event) =>
                  updateUser("medicalAidNumber", event.target.value)
                }
                placeholder="Medical Aid Number"
              />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
