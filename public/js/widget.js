function saveApp(){
    alert('ajax');
    new Ajax.Request("http://localhost:9080/widget",{
        method: "post",
        parameters: {memo: 'hihi ajax is good'}
    });
}