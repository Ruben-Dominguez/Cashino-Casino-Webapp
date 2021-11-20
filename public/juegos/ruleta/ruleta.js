document.addEventListener('DOMContentLoaded', () => {
  let user = sessionStorage.getItem('username');
  let wongbucksAmount = sessionStorage.getItem('wongbucks');

  let username = document.querySelector('#usernameLabel');
  let wongbucks = document.querySelector('#wongbucksLabel');

  username.innerHTML = `Username: ${user}`;
  wongbucks.innerHTML = `Wongbucks: $${wongbucksAmount}`;
});