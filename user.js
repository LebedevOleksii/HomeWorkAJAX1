let res;

(function request(){
    let params = new URL(window.location.href).searchParams;
    const id = params.get('id');
    
    fetch(`https://test-users-api.herokuapp.com/users/${id}`)
    .then(response => response.json())
    .then(response=> res = response.data)
    .then(res=>render(res))
    .catch(err=>console.log(err));
})();

function render(){
    const info = document.querySelector('#user-info');
    info.innerHTML = 
    `
        <span>Імя: ${res.name}</span> <br/>
        <span>Вік: ${res.age}</span> <br/>
        <span>ID: ${res.id}</span> <br/>
    `
}