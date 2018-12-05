const SAVE_ICON = 'http://www.defaulticon.com/images/icons32x32/save.png?itok=sWHq42i3';
const DELETE_ICON = 'http://www.defaulticon.com/images/icons32x32/delete.png?itok=zIkyZPyc';
const USERPAGE_ICON = 'http://www.defaulticon.com/images/icons32x32/user.png?itok=e7PMoF4Z';
const ADD_ICON = 'http://www.defaulticon.com/images/icons32x32/add.png?itok=sIL2bSuC';
const URL = 'https://test-users-api.herokuapp.com';

class Icon {            // іконки кнопки
    constructor(options) {            
        var {
            source, 
            width, 
            height, 
            parentElement, 
            onClick = () => {}, 
        } = options;  
        this.icon = document.createElement('img');   
        this.icon.style.width = `${width}px`;        
        this.icon.style.height = `${height}px`;
        this.icon.style.transition = `opacity .5s`; 
        this.icon.style.cursor = 'pointer';   
        this.icon.src = source;                      
        this.icon.addEventListener('click',(event) => {        
            this.animateIcon();                      
            onClick(event);
        })
        this.appendToElement(parentElement)               
    } 
    appendToElement(element) {       
        element.append(this.icon);
    }

    animateIcon() {         
        this.icon.style.opacity = 0;  
        setTimeout(() => {
            this.icon.style.opacity = 1;
        },300);
    }
}


const request = (endpoint, method, data) => {    //  запит
    const body = method === 'GET'? void 0 : JSON.stringify(data);
    return fetch(`${URL}/${endpoint}`, {
        method,
        body,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
    })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

let usersList = [];

const renderUsers = () => {  // відображення юзерів
    function renderOneUser(user, index) {
        const wrapperDiv = document.querySelector('#wrapper');
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        const userButtons = document.createElement('div');
        userButtons.className = 'user-buttons';
        userCard.innerHTML += 
        `
            <img id="avatar" src="http://agency-diamanti.com/wp-content/uploads/2015/04/empty-avatar.gif" width="150" height="173">
            <div class ="inf">
                <span>ID:<span id="card-id">${user.id}</span></span>
                <div>
                <span>Ім'я:</span></br>
                <input id="edit-name${index}" placeholder="${user.name}">
                </div>
                <div>  
                <span>Вік:</span></br>
                <input id="edit-age${index}" placeholder="${user.age}">
                </div>
            </div>
        `;
        if(index < (usersList.length - 3) && index % 2 == 0) {
            userCard.innerHTML += `<a id="go-up" href=#>На початок списку</a>`
        };
        wrapperDiv.prepend(userCard);
        userCard.append(userButtons);
        const userPageIcon = new Icon({                
            source: USERPAGE_ICON,                          
            width: 34,                                 
            heigt: 34,    
            parentElement: userButtons,                           
            onClick: function() {              
                window.location.href=`user.html?id=${user.id}`;            
            }                                                                                         
        });   
        const saveIcon = new Icon({                
            source: SAVE_ICON,                          
            width: 34,                                 
            heigt: 34,    
            parentElement: userButtons,                           
            onClick: function() {              
                editUser(userCard, user.id, index)            
            }                                                                                         
        });    
        const deleteIcon = new Icon({                
            source: DELETE_ICON,                          
            width: 34,                                 
            heigt: 34,    
            parentElement: userButtons,                           
            onClick: function() {          
                deleteUser(userCard, user.id)            
            }                                                                                         
        });   

    }

    const wrapperDiv = document.querySelector('#wrapper');    
    wrapperDiv.innerHTML = "";
    
    usersList.forEach((user, index) => {
    renderOneUser(user, index);
    });
};

const getUsers = async () => { // GET
    try {
        const response = await request('users/');
        usersList = response.data;
        renderUsers()
    } catch(err) {
        console.log(err)
    }
}
const addUser = async () => {  // POST
    const name = document.querySelector('#add-name').value;
    const age = document.querySelector('#add-age').value;
    try {
        await request('users/', 'POST', {
            name,
            age,
        });
        const response = await request('users/');
        usersList = response.data;
        renderUsers()
    } catch(err) {
        console.log(err)
    }
}
const editUser = async (event, id, index) => { // PUT
    let name = document.querySelector(`#edit-name${index}`).value;
    let age = document.querySelector(`#edit-age${index}`).value;
    try {
        const response = await request (`users/${id}`, 'PUT', {
            name,
            age
        });
        usersList[index] = response.data;
        renderUsers()
    } catch(err) {
        console.log(err)
    }
}
const deleteUser = async (event, id) => {   // DELETE
    try {
        const response = await request (`users/${id}`, 'DELETE');
        usersList = usersList.filter((user) => user.id !== id);
        renderUsers()
    } catch(err) {
        console.log(err)
    }
}

const getButton = document.getElementById('get-users');
getButton.addEventListener('click', getUsers);

const openFormButton = document.getElementById('open-form');
openFormButton.addEventListener('click', function(){
    document.getElementById('wrapper-form').classList.toggle('open-form')
})

const form = document.querySelector('#form')
const addIcon = new Icon({                
    source: ADD_ICON,                          
    width: 50,                                 
    heigt: 50,    
    parentElement: form,                           
    onClick: function() { 
        addUser()
        setTimeout(() => {
            document.getElementById('wrapper-form').classList.add('open-form')
        },500);          
    }                                                                                         
});  

