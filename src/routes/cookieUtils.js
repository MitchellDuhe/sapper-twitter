
async function handleCookie(cookieName) {
  let user = getCookie(cookieName);
  let newUser = false;
  if (user === false) {
    newUser = true;
    let cookieValue = await getNextId();
    setCookie("_id", cookieValue, 365);
    user = cookieValue;
  }

  return [user, newUser]

  async function getNextId(){
    let response = await fetch('/nextId');
    let nextId = await response.json()
    return nextId.max + 1;
  }
}

function getCookie(cookieName) {
  cookieName += "=";
  let cookies = document.cookie.split(';');
  let _id = cookies.find(cookie=>{
    return cookie.trim().indexOf(cookieName) === 0
  })
  
  if (_id === undefined ) return false 
  _id = _id.trim();
  return _id.substring(cookieName.length)
}

function setCookie(cookieName, cookieValue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let cookies = [
    `${cookieName}=${cookieValue}`,
    "expires="+d.toUTCString(),
    "path=/",
    "SameSite=Strict"
  ]
  cookies.forEach(cookie=>{
    document.cookie = cookie;
  })
}

// fetch('https://www.cloudflare.com/cdn-cgi/trace')
// .then(
//     response => { 
//         if (response.ok) {
//             return response.text(); 
//         }
//         throw new Error('Request failed!');
//         }, 
//     networkError => {
//         console.log(networkError.message);
//     })
// .then(response => {
//     searcherIP = response.split(/\r\n|\n|\r/).find(text=>text.slice(0,2) === "ip").slice(3);
//     console.log(searcherIP)
// });

export default handleCookie;