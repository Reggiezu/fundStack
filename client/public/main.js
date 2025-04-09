document.addEventListener("DOMContentLoaded", function () {
  // Fetch the Navbar HTML first
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Firebase Auth State Listener
      firebase.auth().onAuthStateChanged((user) => {
        const logInButton = document.getElementById("logInBtn");
        const signUpButton = document.getElementById("signUpBtn");
        const profileBtn = document.getElementById("profileBtn");
        const dashboardBtn = document.getElementById("dashBtn");

        if (user) {
          // User is logged in
          logInButton.style.display = "none";
          signUpButton.style.display = "none";
          profileBtn.style.display = "block";
          dashboardBtn.style.display = "block";

          // Set profile initials if available
          const initials = user.displayName
            ? user.displayName
                .split(" ")
                .map((name) => name[0])
                .join("")
            : "U";
          document.getElementById("profilePic").innerText = initials;
        } else {
          // User is not logged in
          logInButton.style.display = "block";
          signUpButton.style.display = "block";
          profileBtn.style.display = "none";
          dashboardBtn.style.display = "none";
        }   
      });
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});
