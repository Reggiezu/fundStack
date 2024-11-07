document.addEventListener("DOMContentLoaded", function() {
  // Firebase Auth State Listener
  firebase.auth().onAuthStateChanged((user) => {
    const logInButton = document.getElementById("logInBtn");
    const signUpButton = document.getElementById("signUpBtn");
    const profileBtn = document.getElementById("profileBtn");

    if (user) {
      // User is logged in
      logInButton.style.display = "none";
      signUpButton.style.display = "none";
      profileBtn.style.display = "block";

      // Set profile initials if available
      const initials = user.displayName ? user.displayName.split(" ").map(name => name[0]).join("") : "U";
      document.getElementById("profilePic").innerText = initials;
    } else {
      // User is not logged in
      logInButton.style.display = "block";
      signUpButton.style.display = "block";
      profileBtn.style.display = "none";
    }
  });

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
