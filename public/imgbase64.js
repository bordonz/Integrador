const fileInput = document.getElementById('img');

const errores = document.getElementById('errores');
const contenedorImgs = document.getElementById('imgsBase64');
const contenedorPreviews = document.getElementById('imgsPreview');

const form = document.forms[0];

const arregloImgs = [];


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const bodyToSend = {
    imgs: arregloImgs,
    fecha: new Date().toLocaleTimeString(),
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    // etiquetas: Array.from(document.querySelectorAll('input[name="etiquetas[]"]')).map(e => e.value)
  }
  fetch(form.action, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyToSend)
  }).then(() => {
    //redirigir a GET /gallery
    window.location.assign('gallery')
  }).catch((err) => {
    console.log(err)
  })
})

fileInput.addEventListener('change', (e) => {

  const file = e.target.files[0];
  console.log(e.target.files);

  for(let i=0; i<e.target.files.length; i++){
    const file = e.target.files[i]
    const resultado = validarFile(file);
    if(!resultado){
      const li = document.createElement('li');
      li.innerText = `Error imagen ${file.name}`;
      errores.appendChild(li)
      continue;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const imagen = {
        src: reader.result,
        name: file.name
      }

      arregloImgs.push(imagen)

      // const textArea = document.createElement('textarea');
      // textArea.hidden = true;
      // textArea.value = reader.result;
      // textArea.name = `imgsBase64-${i}`
      // contenedorImgs.appendChild(textArea);

      createImgPreview(reader.result);   
    };
    reader.readAsDataURL(file);
  }
});

function createImgPreview(value) {
  const imgPreview = document.createElement('img');
  imgPreview.src = value;
  imgPreview.style.width = '300px';
  console.log('Preview generado:', imgPreview); // debug
  contenedorPreviews.appendChild(imgPreview);  
}

function validarFile(file) {
  if (!file) return false;

  if(file.size > 3000000){
    console.error('No podes subir mas de 3mb')
    return false;
  }

  return true;
}

//- Manejo de etiquetas dinámicas 
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-etiqueta');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const container = document.getElementById('etiquetas-container');
      if (container) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'etiquetas[]';
        input.placeholder = 'Nueva etiqueta';
        container.appendChild(input);
      }
    });
  }
});

