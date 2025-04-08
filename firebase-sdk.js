<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.6.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore-compat.js"></script>

<script>
  // Firebase config
  const firebaseConfig = {
      apiKey: "AIzaSyBj6QysY8iakOIolvgxdVIQFISrkWKLSls",
      authDomain: "user-data-ff2ef.firebaseapp.com",
      projectId: "user-data-ff2ef",
      storageBucket: "user-data-ff2ef.firebasestorage.app",
      messagingSenderId: "256585563027",
      appId: "1:256585563027:web:002cbebe818faf9ebec666",
      measurementId: "G-V3BQPCTJGG"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  let currentUser = null; // Store logged-in user

  // 🔹 Handle Google Sign-in
  document.addEventListener("DOMContentLoaded", function () {
    const googleBtn = document.querySelector(".google-login-btn");
    
    // Check if the user is already signed in
    auth.onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
        // Hide Google Sign-In button after login
        if (googleBtn) {
          googleBtn.style.display = 'none';
        }
        // Optional: Show the user's email on screen
        document.getElementById("user-email").textContent = "Logged in as: " + currentUser.email;
      } else {
        // If no user is signed in, show the Google login button
        if (googleBtn) {
          googleBtn.style.display = 'block';
        }
      }
    });

    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
          .then((result) => {
            currentUser = result.user;
            alert("✅ Signed in as " + currentUser.email);
            // Hide the Google login button after successful login
            googleBtn.style.display = 'none';
            // Optional: Show user's email on screen
            document.getElementById("user-email").textContent = "Logged in as: " + currentUser.email;
          })
          .catch((error) => {
            console.error("❌ Sign-in error:", error);
            alert("❌ Sign-in failed.");
          });
      });
    }
  });

  // 🔹 Add Another Product Link Field
  document.getElementById("add-link-btn").addEventListener("click", function () {
      const linkContainer = document.getElementById("link-container");
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.className = "product-link";
      newInput.placeholder = "Enter additional product link";
      linkContainer.appendChild(newInput);
  });

  // 🔹 Form Submission
  document.getElementById("request-form").addEventListener("submit", async function (e) {
      e.preventDefault();

      // ❌ Block if not signed in
      if (!auth.currentUser) {
          alert("⚠️ You must be signed in with Google to submit the form.");
          return;
      }

      // Grab values from form
      const productName = document.getElementById("product_name").value.trim();
      const productDescription = document.getElementById("Product-description").value.trim();
      const quantity = document.getElementById("Quantity-input").value.trim();
      const customerName = document.getElementById("Customer-name").value.trim();
      const address = document.getElementById("address").value.trim();

      const linkInputs = document.querySelectorAll(".product-link");
      let productLinks = [];
      linkInputs.forEach(input => {
          const link = input.value.trim();
          if (link) productLinks.push(link);
      });

      if (!productName || !productDescription || !quantity || !customerName || !address || productLinks.length === 0) {
          alert("❌ Please fill in all fields and include at least one product link.");
          return;
      }

      try {
          await db.collection("user_request").add({
              "Address": address,
              "Customer-Name": customerName,
              "Description": productDescription,
              "Product-Links": productLinks,
              "Quantity": quantity,
              "User-Email": auth.currentUser.email,
              "Time": firebase.firestore.FieldValue.serverTimestamp()
          });

          alert("✅ Product request sent successfully!");
          document.getElementById("request-form").reset();
          document.getElementById("link-container").innerHTML = '<input type="text" class="product-link" placeholder="Enter product link">';
      } catch (error) {
          console.error("❌ Error sending request:", error);
          alert("❌ Failed to send request. Please try again.");
      }
  });
</script>
