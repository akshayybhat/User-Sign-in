const container = document.getElementById("dump");
document.addEventListener("DOMContentLoaded", async () => {

  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    window.location.href = "index.html";
    return;
  };

  const response = await fetch("http://localhost:3000/feed", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authorization": jwtToken
    }
  });
  const result = await response.json();

  let userList = document.createElement("pre");
  userList.textContent = JSON.stringify(result.users, null, 2);
  container.appendChild(userList);


})
