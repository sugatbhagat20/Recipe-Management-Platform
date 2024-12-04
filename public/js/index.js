document
  .getElementById("updateProfileForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      const response = await axios.post(
        "http://localhost:4000/user/profile",
        { name, email },
        {
          headers: { Authorization: token },
        }
      );
      alert(response.data.message);
      console.log(response.data.user);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  });
