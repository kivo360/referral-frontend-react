// use localStorage to store the the user's info for the project
export function getUserEmail() {
    // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
    return localStorage.getItem('user-email') || undefined;
}
  
export function setUserEmail(email) {
    return localStorage.setItem('user-email', email);
}
  

export function removeUserEmail(){
    localStorage.removeItem('user-email');
}

export function setUserModal(modal){
    localStorage.setItem('user-modal', modal);
}

export function setUserPaymentInfo(payment){
    localStorage.setItem('user-payment', payment);
}

export function getUserModal(){
    return localStorage.getItem('user-modal');
}

export function getUserPaymentInfo(){
    return localStorage.getItem('user-payment');
}


export function logoutUser(){
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-payment');
    localStorage.removeItem('user-modal');
}