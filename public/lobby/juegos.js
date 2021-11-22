document.addEventListener('DOMContentLoaded', () => {
  let user = sessionStorage.getItem('username');
  let wongbucksAmount = sessionStorage.getItem('wongbucks');

  let username = document.querySelector('#usernameLabel');
  let wongbucks = document.querySelector('#wongbucksLabel');

  username.innerHTML = `Username: ${user}`;
  wongbucks.innerHTML = `Wongbucks: $${wongbucksAmount}`;

   // logout que borre la sesion y te regrese al menu principal
   logout.addEventListener("click", ()=>{
    sessionStorage.setItem("username", null);
    sessionStorage.setItem("wongbucks", null);
  });

  if(sessionStorage.getItem("username") == "null" || sessionStorage.getItem("username") == null) {
    window.location.href = "./error.html";
  }
});

