const app = {

    url: "https://giftr.mad9124.rocks/",
    tokenKey: "TOKEN",
    TOKEN: null,
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

        let token = JSON.parse(sessionStorage.getItem(app.tokenKey)); // get user token
        app.TOKEN = token;
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${app.TOKEN}`);
        
        let url = `${app.url}api/people`;

        let req = new Request(url, {
            headers: headers,
            mode: 'cors',
            method: 'GET'
        });

        fetch(req)
        .then(resp => resp.json())
        .then( people => {
            let main = document.querySelector('main');
            if (people.data.length == 0 ){
                main.setAttribute('data-status', 'noPeopleYet');
                app.noPeopleYet();
            }else{
                main.setAttribute('data-status', 'personAlreadyStored');
                app.personAlreadyStored();
                app.paintList(people);
                app.addPerson(); 
                //hacer esto despues si hay personas creadas en la base de datos
            }
        })
        .catch(err => console.log(err))
        
    },

    noPeopleYet: function() {
        let main = document.querySelector('main');
        let temp = document.getElementById('noPeopleYet');
        let div = temp.content.cloneNode(true);
        main.appendChild(div);

        app.addPerson();  
    },

    personAlreadyStored: function() {
        let main = document.querySelector('main');
        let temp = document.getElementById('personList');
        let div = temp.content.cloneNode(true);
        main.appendChild(div);
    },

    
    paintList: function(people) { // Paint people existing in database

        let peopleArray = people.data;
        console.log(peopleArray);

        let birthdayList = document.getElementById("birthdayList");
        peopleArray.forEach(element => {

            // set  and format Time
            let day = new Date(element.birthDate);
            let formatted = new Intl.DateTimeFormat('en-CA', { timeZone:'UTC', month: 'long',day: 'numeric'}).format(day);

            let li = document.createElement('li'); //Create li to store name and birthday.
            let div = document.createElement('div');
            let name = document.createElement('h6');
            let birthday = document.createElement('p');
            let temp = document.getElementById('listIcons');
            let listIcons = temp.content.cloneNode(true);

            li.setAttribute("class", "collection-item"); 
            li.setAttribute('id', 'personContainer');
            li.setAttribute('data-id', `${element._id}`);
            name.textContent = element.name;
            birthday.textContent = formatted;

            div.appendChild(name);
            div.appendChild(birthday);
            li.appendChild(div);
            li.appendChild(listIcons);
            birthdayList.appendChild(li); // append to html div
        });

        app.deletePerson();

    },


    addPerson: function() {                  // floating button post person
         // float button initialization
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);

        let saveBtn = document.getElementById("savebtn");
        saveBtn.addEventListener("click", sendPersonData);

        function sendPersonData() {

            let fullName = document.getElementById('fullName').value;
            let birthday = document.getElementById('birthday').value;

            let headers = new Headers();
            headers.append('X-Made-By-Mariana', 'true');
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${app.TOKEN}`);
    
            let url = `${app.url}api/people`;
    
            let data = {
                name: fullName,
                birthDate: birthday
            };
    
            let req = new Request(url, {
            headers: headers,
            body: JSON.stringify(data),
            mode: 'cors',
            method: 'POST'
            });

            fetch(req)
            .then(resp => resp.json())
            .then( person => {
            console.log(person)

            let main = document.querySelector('main');
            let prop = main.getAttribute('data-status');
            if (prop == 'noPeopleYet')
            { 
                main.textContent = "";
                main.setAttribute('data-status', 'personAlreadyStored')
                app.personAlreadyStored();
                
            }

            let data = person.data;
            paintPerson(data);

            })
            .catch(err => console.log(err))

        }

        function paintPerson(data) {        //Paint person from float button request
               // set  and format Time
               let birthdayList = document.getElementById("birthdayList");
               let day = new Date(data.birthDate);
               let formatted = new Intl.DateTimeFormat('en-CA', { timeZone:'UTC', month: 'long',day: 'numeric'}).format(day);
   
               let li = document.createElement('li'); //Create li to store name and birthday.
               let div = document.createElement('div');
               let name = document.createElement('h6');
               let birthday = document.createElement('p');
               let temp = document.getElementById('listIcons');
               let listIcons = temp.content.cloneNode(true);
   
               li.setAttribute("class", "collection-item"); 
               li.setAttribute('id', 'personContainer');
               li.setAttribute('data-id', `${data._id}`);
               name.textContent = data.name;
               birthday.textContent = formatted;
   
               div.appendChild(name);
               div.appendChild(birthday);
               li.appendChild(div);
               li.appendChild(listIcons);
               birthdayList.appendChild(li); // append to html div

               app.deletePerson();
        }
     
    },

    deletePerson: function() {

        let deletebtn = document.querySelectorAll('#trash');
        deletebtn.forEach( icon => {
            icon.addEventListener('click', deletePerson);
        })
        

        function deletePerson(){

            let headers = new Headers();
            headers.append('X-Made-By-Mariana', 'true');
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${app.TOKEN}`);
    
            let url = `${app.url}api/people`;
    
            let req = new Request(url, {
            headers: headers,
            mode: 'cors',
            method: 'DELETE'
            });

            fetch(req)
            .then(resp => resp.json())
            .then( person => {
            console.log(person)})
            .catch(console.error)

        }







    }







    
}
document.addEventListener('DOMContentLoaded', app.init);