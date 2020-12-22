const fileInput = document.getElementById('file');
const form = document.getElementsByTagName('form')[0];
const p = document.getElementById('response');

form.addEventListener('submit', (e) => {
    e.preventDefault()
    for (let i = 0; i < fileInput.files.length; i++) {
        var data = new FormData();
        data.append("name", fileInput.files[i].name);
        data.append("file", fileInput.files[i], fileInput.files[i].name);
        
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            p.innerText = this.responseText;
        }
        });

        xhr.open("POST", "http://192.168.1.125/api/upload");

        xhr.send(data);
    }
    form.reset();
})