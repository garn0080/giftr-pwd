const app = {

    url: "https://giftr.mad9124.rocks/",
    TOKEN: null,
    ID: null,

    init: function() {
        app.getToken();
        app.getId();
        app.getPerson(); // GET the person data with gift arrays.
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



    getPerson: function() {

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

                app.addGift(); // trigger add button

            }else{

                main.setAttribute('data-status', 'giftAlreadyStored');
                let temp = document.getElementById('giftsList');
                let div = temp.content.cloneNode(true);
                main.appendChild(div);

                app.paintList(giftsArray);
                app.addGift(); // trigger add button
           
            }
        })
        .catch(console.error);
    },


    addGift: function(){

        //Open modal to create gift
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);

        let save = document.getElementById('savebtn'); // cuando clickee en el boton de guardar
        save.addEventListener('click', sendGiftData);
        
        
        function sendGiftData(){

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
            .then( element => {
                console.log(element);

                let main = document.querySelector('main');
                let prop = main.getAttribute('data-status');
                if (prop == 'noGiftsYet')
                { 
                    main.textContent = "";
                    main.setAttribute('data-status', 'giftsAlreadyStored')
                    // app.personAlreadyStored();
                    
                }
                
                let data = element.data;
                let giftsArray = data.gifts;
                let gift = giftsArray[giftsArray.length - 1]
                paintGift(gift);

                })
            .catch(console.error);

        }

        function paintGift(gift) { // Paint gift from float button request
 
            console.log(gift);
            let price = gift.price; // formatting Number  //  cambia el formato del numero a precio agregandole signo y decimales.
            let precio = price/100;
            let opts = { style: 'currency', currency: 'CAD' };
            let money = new Intl.NumberFormat('en-CA', opts).format(precio);

             // elementos html creados para guardar la idea de regalo
             let li = document.createElement('li'); //Create li to store gift details.
             let div = document.createElement('div');
             let giftName = document.createElement('h6');
             let giftPrice = document.createElement('p');
             let giftStore = document.createElement('p');
             giftStore.setAttribute('class', 'storeP')
             let temp = document.getElementById('listIcons');
             let listIcons = temp.content.cloneNode(true);

              // assigna los valores de la base de datos a los elementos html
            li.setAttribute("class", "collection-item"); 
            li.setAttribute('id', 'giftContainer');
            li.setAttribute('data-id', `${gift._id}`);
            giftName.textContent = gift.name;
            giftPrice.textContent = money;
            giftStore.textContent = gift.store.name;

            // guarda en el div contenedor
            let giftList = document.getElementById('giftsList'); 
            div.appendChild(giftName);
            div.appendChild(giftPrice);
            div.appendChild(giftStore);
            li.appendChild(div);
            li.appendChild(listIcons);
            giftList.appendChild(li); 

            app.deleteGift();

        }

    },


    paintList: function(giftsArray){ // Paint gift list from database array

        let giftList = document.getElementById('giftsList'); 
        giftsArray.forEach(element => {

           // data traida de la base de datos
            let price = element.price; // formatting Number  //  cambia el formato del numero a precio agregandole signo y decimales.
            let precio = price/100;
            let opts = { style: 'currency', currency: 'CAD' };
            let money = new Intl.NumberFormat('en-CA', opts).format(precio);


           // elementos html creados para guardar regalos
            let li = document.createElement('li'); //Create li to store gift details.
            let div = document.createElement('div');
            let giftName = document.createElement('h6');
            let giftPrice = document.createElement('p');
            let giftStore = document.createElement('p');
            giftStore.setAttribute('class', 'storeP')
            let temp = document.getElementById('listIcon');
            let listIcons = temp.content.cloneNode(true);


            // assigna los valores de la base de datos a los elementos html
            li.setAttribute("class", "collection-item"); 
            li.setAttribute('id', 'giftContainer');
            li.setAttribute('data-id', `${element._id}`);
            giftName.textContent = element.name;
            giftPrice.textContent = money;
            giftStore.textContent = element.store.name;

            // guarda en el div contenedor
            div.appendChild(giftName);
            div.appendChild(giftPrice);
            div.appendChild(giftStore);
            li.appendChild(div);
            li.appendChild(listIcons);
            giftList.appendChild(li); 
  
            app.deleteGift();

        });
    },

    deleteGift: function() {
        
        let icons = document.querySelectorAll('#deleteGift');
        console.log(icons)
        
    },

   


}
document.addEventListener('DOMContentLoaded', app.init());