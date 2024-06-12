function checkCookie(key) {
    const cookie = document.cookie.split("; ").find((e)=> {
        return e.startsWith(key + '=');
    })

    if (cookie) {
        return cookie.split("=")[1];
    }
    else {
        return undefined;
    }
}

function setCookie(key, value) {
    document.cookie = `${key}=${value}; expires=` + new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toUTCString() + '; path=/';
}

function clearAllCookies() {
    const cookies = document.cookie.split('; ');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const cookieParts = cookie.split('=');
      const cookieName = cookieParts.shift();
  
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}
  

export {checkCookie, setCookie, clearAllCookies};