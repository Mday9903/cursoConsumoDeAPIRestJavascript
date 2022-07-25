
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});

api.defaults.headers.common['x-api-key'] = '5c389f08-7e2b-4677-86fe-d750a6dfda12';


const API_URL_RAMDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites?limit=100';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload?limit=100';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?limit=100`;


const spanError = document.getElementById('error');

const button = document.querySelector('#button-reload');

 loadRandomMichis();
 loadFavouritesMichis();
 button.onclick = loadRandomMichis;
// --------------------------Previsualización------------

const inputFile = document.getElementById('file');
const preview = document.getElementById('imgPreview');
inputFile.addEventListener("change", () =>{
    const files = inputFile.files;
    if (!files || !files.length){
        preview.src = "";
        return;
    }

    console.log(files)
    console.log(files[0])
    const objectURL = URL.createObjectURL(files[0]);
    addPreview(objectURL);
// for (let index = 0; index < files.length; index++) {
//     const file = files[index];
//     const objectURL = URL.createObjectURL(file);
//     addPreview(objectURL);
//     }
// preview.src = objectURL;
})


function addPreview(src){
    document.querySelector('#divImg').insertAdjacentHTML('beforeend',
    `<img src=${src} id="imgPreview">`
    )};





// --------------------------Previsualización--------------------------




async function loadRandomMichis() {
    const res = await fetch(API_URL_RAMDOM);
    const data = await res.json();

    
    console.log(res.status);
    console.log('Random');
    console.log(data);
    
    if(res.status !==200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        const img1 = document.querySelector('#img1');
        const img2 = document.querySelector('#img2');
        const btn1 = document.querySelector('#btn1');
        const btn2 = document.querySelector('#btn2');

        img1.src=data[0].url;
        img2.src=data[1].url;

        btn1.onclick = () => saveFavouriteMichi(data[0].id);
        btn2.onclick = () => saveFavouriteMichi(data[1].id);
    }
}

async function loadFavouritesMichis() {
    const res = await fetch(API_URL_FAVOURITES,{
        method: 'GET',
        headers: {
            'x-api-key': '5c389f08-7e2b-4677-86fe-d750a6dfda12',
        }
    });
    const data = await res.json();
    console.log(res.status);
    console.log('Favourites');
    console.log(data);

    if(res.status !==200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        const section = document.getElementById('favouriteMichis');
        section.innerHTML= "";
        const h2 = document.createElement('h2');        
        const h2Text = document.createTextNode('Michis favoritos');
        h2.appendChild(h2Text);  
        section.appendChild(h2Text);

        data.forEach(michi =>{
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');

            btn.appendChild(btnText);
            img.src = michi.image.url;

            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
            btn.onclick = () => deleteFavouriteMichi(michi.id);
        })
    }
    
}

async function saveFavouriteMichi(id){

    //En esta función vamos a utilizar a axios en lugar de fetch:

    const {data, status} = await api.post('/favourites',{
        image_id: id,
    });
    
    // const res = await fetch(API_URL_FAVOURITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'x-api-key': '5c389f08-7e2b-4677-86fe-d750a6dfda12',
    //     },
    //     body:JSON.stringify({
    //         image_id: id
    //     }),
    // });
    // const data = await res.json();

    console.log('Save')
    console.log(data)

    if (status !== 200) {
        spanError.innerHTML = "Hubo un error: " + status + data.message;
    } else {
        console.log('Michi guardado en favoritos')
        loadFavouritesMichis()
    }
}

async function deleteFavouriteMichi(id){
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': '5c389f08-7e2b-4677-86fe-d750a6dfda12',
        },
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos')
        loadFavouritesMichis()
    } 
}  


async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD,{
        method: 'POST',
        headers:{
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': '5c389f08-7e2b-4677-86fe-d750a6dfda12',
        },
        body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
        console.log({data})
    } else {
        console.log('Foto de michi subida');
        console.log({data});
        console.log(data.url);
        saveFavouriteMichi(data.id);
    }
}