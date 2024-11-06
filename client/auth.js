// Get current page filename
const currentPage = window.location.pathname.split("/").pop();

// List of restricted pages
const restrictedPages = ["profile.html", "dashboard.html"];

// Initialize Firebase Auth and check access immediately on page load
firebase.auth().onAuthStateChanged((user) => {
  if (restrictedPages.includes(currentPage) && !user) {
    alert("You need to log in to access this page.");
    window.location.href = "signin.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Firebase Auth State Listener to manage UI based on auth state
  firebase.auth().onAuthStateChanged((user) => {
    handleAuthStateChange(user);
  });

  // Reference to the Google Sign-In Button
  const googleBtn = document.getElementById("googleSignInBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const provider = new firebase.auth.GoogleAuthProvider(); // Create a Google Auth provider

      // Sign in using a popup and Google authentication
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          alert("Sign-in successful! Redirecting to dashboard...");
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          const errorMessage = error.message;
          document.getElementById("signInError").innerText = `Error: ${errorMessage}`;
        });
    });
  }

  // Reference to the sign-in form
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent form from submitting the traditional way
      const email = document.getElementById("emailInput").value;
      const password = document.getElementById("passwordInput").value;

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("Sign-in successful! Redirecting to dashboard...");
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          const errorMessage = error.message;
          document.getElementById("signInError").innerText = `Error: ${errorMessage}`;
        });
    });
  }

  // Reference to the profile form (used for profile updates, e.g., username)
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent form from submitting the traditional way
      const user = firebase.auth().currentUser;
      const username = document.getElementById("usernameInput").value;

      if (user) {
        user.updateProfile({ displayName: username })
          .then(() => {
            alert('Profile updated successfully!');
            window.location.href = 'dashboard.html';
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
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
          window.location.href = "index.html"; // Redirect to login or home page
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    });
  }
});

// Function to handle authentication state changes
function handleAuthStateChange(user) {
  const logInButton = document.getElementById("logInBtn");
  const signUpButton = document.getElementById("signUpBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (user) {
    // User is logged in
    if (logInButton) logInButton.style.display = "none";
    if (signUpButton) signUpButton.style.display = "none";
    if (profileBtn) profileBtn.style.display = "block";

    // Set profile initials if available
    if (user.displayName && document.getElementById("profilePic")) {
      const initials = user.displayName.split(" ").map(name => name[0]).join("");
      document.getElementById("profilePic").innerText = initials;
    }
  } else {
    // User is not logged in
    if (logInButton) logInButton.style.display = "block";
    if (signUpButton) signUpButton.style.display = "block";
    if (profileBtn) profileBtn.style.display = "none";
  }
}
