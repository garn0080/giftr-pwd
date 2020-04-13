const app = {

    url: "https://giftr.mad9124.rocks/",
    tokenKey: "TOKEN",

    init: function(){
        app.welcomePage();
        app.authenticationForms(); 
        app.listeners();
           
    },
    welcomePage: function() {

        let header = document.getElementById("header");
        let loginRegisterPage = document.getElementById("loginRegister");
        let main = document.getElementById("main");
        let welcome = document.getElementById("welcome"); 

        let div1 = loginRegisterPage.content.cloneNode(true);
        let div2 = welcome.content.cloneNode(true);
        header.appendChild(div1);
        main.appendChild(div2);

    },

    authenticationForms: function() { // trigger login and register forms

    let loginForm = document.querySelectorAll('.login-form');
    M.Sidenav.init(loginForm, {edge: 'right'});
    let registerForm = document.querySelectorAll('.register-form');
    M.Sidenav.init(registerForm, {edge: 'right'});

    },

    listeners: function() {

        document.getElementById('registerbtn').addEventListener('click', app.registerUser); // Register
        document.getElementById('loginbtn').addEventListener('click', app.loginUser); // Login

    },

    registerUser: function() {

        let name = document.getElementById('name').value;
        let familyName = document.getElementById('lastName').value;
        let emailAddress = document.getElementById('registerEmail').value;
        let registerPassword = document.getElementById('registerPassword').value;

        let headers = new Headers();
        headers.append('X-Made-By-Mariana', 'true');
        headers.append('Content-Type', 'application/json');

        let url = `${app.url}auth/users`;

        let data = {
            firstName: name,
            lastName: familyName,
            email: emailAddress,
            password: registerPassword
        };

        let req = new Request(url, {
        headers: headers,
        body: JSON.stringify(data),
        mode: 'cors',
        method: 'POST'
        });
        console.log(data)
        
        fetch(req)
        .then(resp => resp.json())
        .then(console.log)
        .catch(console.error);

    },

    loginUser: function() {

        let emailAddress = document.getElementById('loginEmail').value;
        let registerPassword = document.getElementById('loginPassword').value;

        let headers = new Headers();
        headers.append('X-Made-By-Mariana', 'true');
        headers.append('Content-Type', 'application/json');

        let url = `${app.url}auth/tokens`;

        let data = {
            email: emailAddress,
            password: registerPassword
        };

        let req = new Request(url, {
        headers: headers,
        body: JSON.stringify(data),
        mode: 'cors',
        method: 'POST'
        });
        
        // loading animation
        let loading = document.getElementById('loading');
        let loginForm = document.getElementById('login-form');
        let div = loading.content.cloneNode(true);
        loginForm.appendChild(div);

        fetch(req)
        .then(resp => resp.json())
        .then( data => {
            let stringValue = JSON.stringify(data["data"].token);
            sessionStorage.setItem(app.tokenKey, stringValue);

            app.hiddeWelcome();
        })
        .catch( () =>{
            console.error
            alert("incorrect Email or Password")
            // let loginForm = document.getElementById('login-form');
            // let message = document.createElement('p');
            // message.textContent = "Incorrect Email or Password";
            // loginForm.appendChild(message);
        });
        
        
    },

    hiddeWelcome: function() {

        let body = document.querySelector('body');
        let header = document.querySelector('header');
        let main = document.querySelector('main');
        let overlay = document.querySelector('.sidenav-overlay');
        body.removeChild(overlay);
        header.textContent = "";
        main.textContent = "";
       
        app.peoplePage();
        
    },

    peoplePage: function() {

        let header = document.querySelector('header');
        let temp = document.getElementById('logoutUser');
        let div = temp.content.cloneNode(true);

        header.appendChild(div); // logOut navigation

        let token = JSON.parse(sessionStorage.getItem(app.tokenKey)); // get people data
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        
        let url = `${app.url}api/people`;

        let req = new Request(url, {
            headers: headers,
            mode: 'cors',
            method: 'GET'
        });

        fetch(req)
        .then(resp => resp.json())
        .then( people => {
            console.log(people)
            if (people.data.length == 0 ){
                app.noPeopleYet();
            }else{
                //hacer esto despues
            }
        })
        .catch(err => console.log(err))
        
    },

    noPeopleYet: function() {
        let main = document.querySelector('main');
        let temp = document.getElementById('noPeopleYet');
        let div = temp.content.cloneNode(true);
        main.appendChild(div);

    }








    
}
document.addEventListener('DOMContentLoaded', app.init);