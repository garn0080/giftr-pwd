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
        headers.append('X-Made-By-Mariana', 'true');
        headers.append('Content-Type', 'application/json');
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
            let giftsArray = person.data.gifts;
            if ( giftsArray.length == 0 ){

                main.setAttribute('data-status', 'noGiftsYet');
                let temp = document.getElementById('noGiftsYet');
                let div = temp.content.cloneNode(true);
                main.appendChild(div);

                app.addGift();

            }else{

                main.setAttribute('data-status', 'giftAlreadyStored');
                let temp = document.getElementById('giftsList');
                let div = temp.content.cloneNode(true);
                main.appendChild(div);

                app.addGift();
           
            }
        })
        .catch(console.error);
    },
    addGift: function(){

        //Open modal to create gift
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);

        let save = document.getElementById('savebtn');
        save.addEventListener('click', () => {

            let giftName = document.getElementById('giftName').value;
            let giftPrice = document.getElementById('price').value;
            let giftStore = document.getElementById('store').value;
            let giftWebSite = document.getElementById('webSite').value;

            
            let num = parseInt(giftPrice*100);
            
            
            let headers = new Headers();
            headers.append('X-Made-By-Mariana', 'true');
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${app.TOKEN}`);
            
            let url = `${app.url}api/people/${app.ID}/gifts`;
            debugger;

            let data = {
                name: giftName,
                price: num,
                imageUrl: "",
                store: {
                    name: giftStore,
                    productURL: giftWebSite
                }
            }
    
            let req = new Request(url, {
                headers: headers,
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(data)
            });
    
            fetch(req)
            .then(resp => resp.json())
            .then( gift => {
                console.log(gift);
            })
            .catch(console.error);

        })
        
    }





}
document.addEventListener('DOMContentLoaded', app.init());