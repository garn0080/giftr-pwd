const app = {
    init: function(){
       
            let loginForm = document.querySelectorAll('.login-form');
            M.Sidenav.init(loginForm, {edge: 'right'});
            let registerForm = document.querySelectorAll('.register-form');
            M.Sidenav.init(registerForm, {edge: 'right'});
    }
}
document.addEventListener('DOMContentLoaded', app.init);