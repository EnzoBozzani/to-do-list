const setTagAsDone = async (element, id) => {
    event.preventDefault();
    try {
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let body = JSON.stringify({ task : {done: element.checked }});
        let res = await fetch(`/tasks/${id}?_method=put`, {headers: headers, body: body, method: 'PUT'});
        let data = await res.json();
        let task = data.task;
        let parent = element.parentNode;
        if (task.done){
            element.checked = true;
            console.log('a');
            parent.classList.add('has-text-success', 'is-italic');
        } else {
            element.checked = false;
            parent.classList.remove('has-text-success', 'is-italic');
        }   
    } catch (error) {
        console.log(error);
        alert('Erro ao atualizar a tarefa');
    }
}
