import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";

import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  // Redirect away if NOT auth
  // 2
  // const [isLoading, setIsLoading] = useState(true);
  // 3
  // const [loadedSession, setLoadedSession] = useState();
  // 1
  // const [session, loading] = useSession();

  // 4
  /*
  useEffect(() => {
    // it can be used on server side as well
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/auth";
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <p className={classes.profile}>Loading...</p>;
  }
  */

  async function changePasswordHandler(passwordData) {
    const response = await fetch("/api/user/changePassword", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
