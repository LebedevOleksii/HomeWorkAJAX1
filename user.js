
(function request(){
    let params = new URL(window.location.href).searchParams;
    const id = params.get('id');
    
    fetch(`https://test-users-api.herokuapp.com/users/${id}`)
    .then(response => response.json())
    .then(response => render(response.data))
    .catch(err => console.log(err));
})();

function render(user){
    const info = document.querySelector('#user-info');
    info.innerHTML = 
    `
        <span>Імя: ${user.name}</span> <br/>
        <span>Вік: ${user.age}</span> <br/>
        <span>ID: ${user.id}</span> <br/>
    `
}
