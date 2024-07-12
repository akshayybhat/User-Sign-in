const username = document.getElementById("username");
const password = document.getElementById("password");


const resetMessageStrip = () => {
  messageStrip.style.display = 'none';
  messageStrip.classList.remove('error', 'success');
}

const signInUser = async (route) => {
  if (!username.value || !password.value) {
    messageStrip.textContent = 'Username and password are required.';
    messageStrip.classList.add('error');
    messageStrip.style.display = 'block';
    return;
  }
  const payload = {
    "username": username.value,
    "password": password.value
  }
  const response = await fetch("http://localhost:3000/" + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  resetMessageStrip();
  if (result.token) {
    localStorage.setItem("token", result.token);
    messageStrip.textContent = result.msg;
    messageStrip.classList.add('success');
    messageStrip.style.display = 'block';
    setTimeout(resetMessageStrip, 5000);
  } else {
    messageStrip.textContent = result.msg;
    messageStrip.classList.add('error');
    messageStrip.style.display = 'block';
    setTimeout(resetMessageStrip, 5000);

  }
  return response.status;
}


// create account
document.getElementById("createAccount").addEventListener("click", async () => {
  signInUser("welcome");
})

//login
document.getElementById("signIn").addEventListener("click", async () => {
  const status = await signInUser("login");
  if (status == 200) {
    window.location.href = "feeds.html";
  }

})