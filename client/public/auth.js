// Get current page filename
const currentPage = window.location.pathname.split("/").pop();

// List of restricted pages (should only be accessible if the profile is complete)
const restrictedPages = ["profile.html", "dashboard.html"];

// Ensure these are at the top level of the auth.js file, not nested inside any function

function signIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(`Signed in successfully: ${user.email}`);
      // Add any additional actions like redirecting
    })
    .catch((error) => {
      console.error(`Error during sign-in: ${error.message}`);
    });
}

function signUp(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(`Sign up successful: ${user.email}`);
      // Add any additional actions like redirecting
    })
    .catch((error) => {
      console.error(`Error during sign-up: ${error.message}`);
    });
}

function signOut() {
  firebase.auth().signOut()
    .then(() => {
      console.log("Sign-out successful");
    })
    .catch((error) => {
      console.error("Error during sign-out:", error);
    });
}



// Initialize Firebase Auth and check access immediately on page load
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(user.uid);

    // Check if the user's profile is complete
    userRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();

         // If the profile is incomplete, redirect them
         if (!userData.username && currentPage !== "profile-completion.html") {
          toast({
            title: "Complete Your Profile",
            description: "Please complete your profile.",
            type: "warning",
          });
          setTimeout(() => {
            window.location.href = "profile-completion.html";
          }, 2500);
        } else if (restrictedPages.includes(currentPage) && !userData.username) {
          toast({
            title: "Access Denied",
            description: "You need to complete your profile before accessing this page.",
            type: "error",
          });
          setTimeout(() => {
            window.location.href = "profile-completion.html";
          }, 2500);
        }
      } else {
        // No user doc yet, create one
        userRef.set({
          name: user.displayName || "No Name Provided",
          email: user.email,
          username: "", // Placeholder until completed
        }).then(() => {
          if (currentPage !== "profile-completion.html") {
            toast({
              title: "Welcome!",
              description: "Please complete your profile.",
              type: "info",
            });
            setTimeout(() => {
              window.location.href = "profile-completion.html";
            }, 2500);
          }
        }).catch((error) => {
          console.error("Error creating user doc:", error);
        });
      }
    });
  } else {
    // Not signed in
    if (restrictedPages.includes(currentPage)) {
      toast({
        title: "Login Required",
        description: "You need to log in to access this page.",
        type: "warning",
      });
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 2500);
    }
  }
});

// Document Ready Actions
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const signOutBtn = document.getElementById("signOutBtn");
    if (signOutBtn) {
      console.log("SignOut Button now exists. Adding event listener.");
      signOutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        firebase.auth().signOut()
          .then(() => {
            toast({
              title: "Signed Out",
              description: "Redirecting to homepage...",
              type: "success",
            });
            setTimeout(() => {
              window.location.href = "index.html";
            }, 2000);
          })
          .catch((error) => {
            console.error("Sign-out error:", error);
            toast({
              title: "Sign Out Failed",
              description: error.message,
              type: "error",
            });
          });
      });
  
      // Stop observing after we've added it
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Reference to the Google Sign-In Button
  const googleBtn = document.getElementById("googleSignInBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          const db = firebase.firestore();
          const userRef = db.collection("users").doc(user.uid);

          userRef.get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
              // Add the user details except username
              userRef.set({
                name: user.displayName || "No Name Provided",
                email: user.email,
                username: "", // Placeholder until provided by user
              }).then(() => {
                toast({
                  title: "Almost There!",
                  description: "Please complete your profile.",
                  type: "info",
                });
                setTimeout(() => {
                  window.location.href = "profile-completion.html";
                }, 2500);
              });
            }else {
              toast({
                title: "Welcome Back!",
                description: "Sign-in successful! Redirecting to dashboard...",
                type: "success",
              });
              setTimeout(() => {
                window.location.href = "dashboard.html";
              }, 2000);
            }
          })
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast({
            title: "Sign-In Error",
            description: errorMessage,
            type: "error",
          });
          document.getElementById("signInError").innerText = `Error: ${errorMessage}`;
        });
    });
  }

  // Reference to the sign-up form
const signUpForm = document.getElementById("signUpForm");
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get user input values
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Create the user using Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Successfully created user, get the user ID
        const user = userCredential.user;

        // Update the user's display name
        return user.updateProfile({
          displayName: `${firstName} ${lastName}`
        }).then(() => {
          toast({
            title: "Registration Successful!",
            description: "Redirecting to profile completion...",
            type: "success",
          });
          setTimeout(() => {
            window.location.href = "profile-completion.html";
          }, 2500);
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast({
          title: "Registration Error",
          description: errorMessage,
          type: "error",
        });
        document.getElementById("signInError").innerText = `Error: ${errorMessage}`;
      });
  });
}
  // Reference to the sign-in form
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Get user input values
      const email = document.getElementById("emailInput").value;
      const password = document.getElementById("passwordInput").value;
  
      // Create the user using Firebase Authentication
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Successfully sign in user, get the user ID
          const user = userCredential.user;
  
          // Update the user's display name
          return user.updateProfile({
          }).then(() => {
            // Redirect to dashboard page
            window.location.href = "dashboard.html";
          });
        })
        .catch((error) => {
          // Handle errors during user creation or profile update process
          const errorMessage = error.message;
          document.getElementById("signInError").innerText = `Error: ${errorMessage}`;
          console.log(errorMessage)
        });
    });
  }


  // Reference to the profile form
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = firebase.auth().currentUser;
      const username = document.getElementById("username").value;

      if (user) {
        const db = firebase.firestore();

        // Check if the username is already taken
        db.collection("users").where("username", "==", username).get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // Username already exists
              document.getElementById("signInError").innerText = `Error: Username "${username}" is already taken.`;
              toast({
                title: "Username Taken",
                description: `The username "${username}" is already in use.`,
                type: "warning",
              });
              return Promise.reject("Username already exists");
            }

            // Update the user profile in Firestore with the username
            const userRef = db.collection("users").doc(user.uid);
            return userRef.update({
              username: username,
            });
          })
          .then(() => {
            // Update Firebase user profile with the username
            return user.updateProfile({
              displayName: username,
            });
          })
          .then(() => {
            toast({
              title: "Profile Saved!",
              description: "Profile updated successfully. Redirecting to dashboard...",
              type: "success",
            });
        
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 2000);
          })
          .catch((error) => {
            if (error !== "Username already exists") {
              console.error("Error updating profile: ", error);
              toast({
                title: "Update Error",
                description: error.message || "Something went wrong while updating your profile.",
                type: "error",
              });
              document.getElementById("signInError").innerText = `Error: ${error.message}`;
            }
          });
      }
    });
  }
})
