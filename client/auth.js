// Get current page filename
const currentPage = window.location.pathname.split("/").pop();

// List of restricted pages (should only be accessible if the profile is complete)
const restrictedPages = ["profile.html", "dashboard.html"];

// Initialize Firebase Auth and check access immediately on page load
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(user.uid);

    // Check if the user's profile is complete
    userRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();

        // If the profile is incomplete, redirect them only if they're not on profile-completion.html
        if (!userData.username && currentPage !== "profile-completion.html") {
          alert("Please complete your profile.");
          window.location.href = "profile-completion.html";
        } else if (restrictedPages.includes(currentPage) && !userData.username) {
          // Prevent restricted page access if profile is not complete
          alert("You need to complete your profile before accessing this page.");
          window.location.href = "profile-completion.html";
        }
      } else {
        // If user data doesn't exist, create a placeholder without a username
        userRef.set({
          name: user.displayName || "No Name Provided",
          email: user.email,
          username: "", // Placeholder until provided by user
        }).then(() => {
          if (currentPage !== "profile-completion.html") {
            alert("Please complete your profile.");
            window.location.href = "profile-completion.html";
          }
        }).catch((error) => {
          console.error("Error adding basic user details to Firestore: ", error);
        });
      }
    });
  } else {
    // If not authenticated, restrict access to specific pages
    if (restrictedPages.includes(currentPage)) {
      alert("You need to log in to access this page.");
      window.location.href = "signin.html";
    }
  }
});

// Document Ready Actions
document.addEventListener("DOMContentLoaded", () => {
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
                alert("Please complete your profile.");
                window.location.href = "profile-completion.html";
              });
            } else {
              alert("Sign-in successful! Redirecting to dashboard...");
              window.location.href = "dashboard.html";
            }
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
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
          // Redirect to profile completion page
          alert("User registration successful. Redirecting to profile completion...");
          window.location.href = "profile-completion.html";
        });
      })
      .catch((error) => {
        // Handle errors during user creation or profile update process
        const errorMessage = error.message;
        document.getElementById("signInError").innerText = `Error: ${errorMessage}`;
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
            alert("Profile updated successfully!");
            window.location.href = "dashboard.html";
          })
          .catch((error) => {
            if (error !== "Username already exists") {
              console.error("Error updating profile: ", error);
              document.getElementById("signInError").innerText = `Error: ${error.message}`;
            }
          });
      }
    });
  }

  // Sign-Out Button Logic
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      firebase.auth().signOut()
        .then(() => {
          alert("Sign-out successful!");
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    });
  }
});
