const gallery = document.getElementsByClassName('gallery')[0];
let result;

const getImages = async () => {
    result = await fetch('http://192.168.1.125/api/get-image-urls')
        .then(response => response.json())
        .then(data => result = data);

    result.forEach(item => {
        let img = document.createElement('img');
        img.src = item;
        gallery.appendChild(img)
    })
}

getImages();