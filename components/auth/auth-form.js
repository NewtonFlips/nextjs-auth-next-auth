import { useRef, useState } from "react";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

// this function will create new users
async function createNewUser(email, password) {
  // sending http request to create a new user, the new user will return in the respose object
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);

  // converting the returned resposne into json for further use.
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "something went wrong");
  }

  return data;
}

function AuthForm() {
  // Capturing data from form
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    // capturing values from input fields which are linked as above
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // console.log(enteredEmail, enteredPassword);

    // Optionally we can set up some frontend validation. This is recommended.

    if (isLogin) {
      // If there is an error this result variable will be an error object and if not, it will contain user information
      const result = await signIn("credentials", {
        redirect: false,

        email: enteredEmail,
        password: enteredPassword,
      });

      // console.log(result);

      if (!result.error) {
        // set some state
        router.replace("/profile");
      }
    } else {
      try {
        const result = await createNewUser(enteredEmail, enteredPassword);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
