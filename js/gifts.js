const app = {

    url: "https://giftr.mad9124.rocks/",
    TOKEN: null,
    ID: null,

    init: function() {
        app.getToken();
        app.getId();
        app.getProfiles(); // GET the person data with gift arrays.
    },

    getToken: function() {

        let str = sessionStorage.getItem('TOKEN')
        let sessionToken = JSON.parse(str);
        app.TOKEN = sessionToken;

    },
    getId: function() {

        let str = sessionStorage.getItem('person-ID');
        let personId = JSON.parse(str);
        app.ID = personId;
    },



    getProfiles: function() {

        let headers = new Headers();
        headers.append('Authorization', `Bearer ${app.TOKEN}`);
        
        let url = `${app.url}api/people/${app.ID}`;

        let req = new Request(url, {
            headers: headers,
            mode: 'cors',
            method: 'GET'
        });

        fetch(req)
        .then(resp => resp.json())
        .then( person => {
            console.log(person)
            let main = document.querySelector('main');
            if (person.data.gifts.length == 0 ){

                main.setAttribute('data-status', 'noGiftsYet');
                let temp = document.getElementById('noGiftsYet');
                let div = temp.content.cloneNode(true);
                main.appendChild(div);
            }else{
                main.setAttribute('data-status', 'giftAlreadyStored');
            //     app.personAlreadyStored();
            //     app.paintList(people);

            //     app.addPerson(); 
            //     //hacer esto despues si hay personas creadas en la base de datos
            }
        })
        .catch(console.error);
    }





}
document.addEventListener('DOMContentLoaded', app.init());