// use localStorage to store the the user's info for the project
export function getUserEmail() {
    // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
    return localStorage.getItem('user-email') || undefined;
}
  
export function setUserEmail(email) {
    return localStorage.setItem('user-email', email);
}
  