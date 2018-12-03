const SAVE_ICON = 'http://www.defaulticon.com/images/icons32x32/save.png?itok=sWHq42i3';
const DELETE_ICON = 'http://www.defaulticon.com/images/icons32x32/delete.png?itok=zIkyZPyc';
const ADD_ICON = 'http://www.defaulticon.com/images/icons32x32/add.png?itok=sIL2bSuC';
const URL = 'https://test-users-api.herokuapp.com';


class Icon {            // іконки кнопки
    constructor(options){            
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
        this.icon.src = source;                      
        this.icon.addEventListener('click',(event)=>{        
            this.animateIcon();                      
            onClick(event);
        })
        this.appendToElement(parentElement)               
    } 
    appendToElement(element){       
        element.append(this.icon);
    }

    animateIcon(){         
        this.icon.style.opacity = 0;  
        setTimeout(()=>{
            this.icon.style.opacity = 1;
        },300);
    }
}

const request = function (endpoint, method, data){    //  запит
    const body = method === 'GET'? void 0 : JSON.stringify(data);
    return fetch(`${URL}/${endpoint}`, {
        method,
        body,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
    })
    .then((res)=>res.json())
    .catch((err)=>console.log(err));
};

let usersList = [];

function renderUsers(){  // відображення юзерів
    function renderOneUser(user){
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
                <input id="edit-name" placeholder="${user.name}">
                </div>
                <div>  
                <span>Вік:</span></br>
                <input id="edit-age" placeholder="${user.age}">
                </div>
            </div>
        `;
        wrapperDiv.prepend(userCard);
        userCard.append(userButtons);
        const saveIcon = new Icon({                
            source: SAVE_ICON,                          
            width: 34,                                 
            heigt: 34,    
            parentElement: userButtons,                           
            onClick: function(event){                
                editUser(userCard, user.id)            
            }                                                                                         
        });    
        const deleteIcon = new Icon({                
            source: DELETE_ICON,                          
            width: 34,                                 
            heigt: 34,    
            parentElement: userButtons,                           
            onClick: function(event){          
                deleteUser(userCard, user.id)            
            }                                                                                         
        });   

    }

    const wrapperDiv = document.querySelector('#wrapper');    
    wrapperDiv.innerHTML = "";
    usersList.forEach((user)=>{
    renderOneUser(user);
    });
};

const getUsers = async ()=>{ // GET
    try{
        let response = await request('users/');
        usersList = response.data;
        renderUsers()
    } catch(err){
        console.log(err)
    }
}
const addUser = async ()=>{  // POST
    const name = document.querySelector('#add-name').value;
    const age = document.querySelector('#add-age').value;
    try{
        const userResponse = await request('users/', 'POST', {
            name,
            age
        })
        usersList.push(userResponse.data)
        renderUsers()
    } catch(err){
        console.log(err)
    }
}
const editUser = async (event, id)=>{ // PUT
    const name = document.querySelector('#edit-name').value;
    const age = document.querySelector('#edit-age').value;
    try{
        const response = await request (`users/${id}`, 'PUT', {
            name,
            age
        });
        renderUsers()
    } catch(err){
        console.log(err)
    }
}
const deleteUser = async (event, id)=>{   // DELETE
    try{
        const response = await request (`users/${id}`, 'DELETE');
        usersList = usersList.filter((user) => user.id !== id);
        renderUsers()
    } catch(err){
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
    width: 44,                                 
    heigt: 44,    
    parentElement: form,                           
    onClick: function(event){ 
        addUser()
        setTimeout(()=>{
            document.getElementById('wrapper-form').classList.add('open-form')
        },500);          
    }                                                                                         
});  

