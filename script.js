'use strict'

const wrap = [], 
    form = [],
    fileInput = [],
    progressArea = [],
    uplodedArea = [];

for(let i = 1; i < 7; i++){
    wrap.push(document.querySelector(`#wrap0${i}`))
    form.push(wrap[i-1].querySelector(`form`));
    fileInput.push(wrap[i-1].querySelector(".file-input"));
    progressArea.push(wrap[i-1].querySelector("section.progress-area"));
    uplodedArea.push(wrap[i-1].querySelector("section.uploaded-area"));
    form[i-1].addEventListener("click", () => {
        fileInput[i-1].click();
    })

    /** ao arrastar arquivos para frente do elemento */
    form[i-1].addEventListener("dragover", (e) => {
        e.preventDefault();
        form[i-1].style.borderStyle = 'solid';
    });

    /** ao arrastar para fora do elemento */
    ["dragleave", "dragend"].forEach((type) => {
        form[i-1].addEventListener(type, (e) => {
          form[i-1].style.borderStyle = 'dotted';
        });
    });

    /** ao soltar o aquivo no elemento (captura do arquivo) */
    form[i-1].addEventListener("drop", (e) => {
        e.preventDefault();
    
        if (e.dataTransfer.files.length) {
            let file = e.dataTransfer.files[0];
            updateThumbnail(form[i-1], file);
        
            form[i-1].style.borderStyle = 'solid';
            let fileName = file.name;
            if(fileName.length >= 12){
                let splitName = fileName.split('.');
                fileName = splitName[0].substring(0,12) + `... .${splitName[(parseInt(splitName.length) - 1)]}`;
            }
            fileName = fileName.replace(/(\/)/g,'');
            let identificador = fileInput[i-1].getAttribute('name');
            let nameUpload = `${identificador}`;
            uploadFile(fileName, nameUpload, file, progressArea[i-1], uplodedArea[i-1]);
        }
    });

    /** Ao selecionar um arquivo no input file */
    fileInput[i-1].onchange = ({target}) => {
        let file = target.files[0];
        if(file) {

            updateThumbnail(form[i-1], file);
            let fileName = file.name;
            if(fileName.length >= 12){
                let splitName = fileName.split('.');
                fileName = splitName[0].substring(0,12) + `... .${splitName[(parseInt(splitName.length) - 1)]}`;
            }
            fileName = fileName.replace(/(\/)/g,'');
            let identificador = fileInput[i-1].getAttribute('name');
            let nameUpload = `${identificador}`;
            uploadFile(fileName, nameUpload, file, progressArea[i-1], uplodedArea[i-1]);
        }
    }
}

/** Atualiza a Thumb para mostra uma miniatura da imagem ou indicar pdf */
function updateThumbnail(form,file){
    form.querySelector('.bi-cloud-arrow-up').style.display = 'none';
    form.style.borderStyle = 'solid';
    if(file.type !== 'application/pdf'){
        form.style.backgroundImage = `url('${URL.createObjectURL(file)}')`
    }else{
        form.style.backgroundImage = `url('php/files/pdf.webp')`;
        form.style.backgroundSize = `contain`;
    }
}

/** Upload de aquivo com a classe XMLHttpRequest */
function uploadFile(fileName, nameUpload, file, progressArea, uplodedArea){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
            let fileLoaded = Math.floor((loaded/total)*100);
            let fileTotal = Math.floor(total/1000);
            let fileSize;
            (fileSize < 1024**2) ? fileSize = `${fileTotal} KB` : fileSize = (loaded / (1024**2)).toFixed(2) + " MB";
            let progressHtml = `
            <li class="linha list-group-item border-0 d-flex align-items-center py-2 px-3 justify-content-between rounded bg-dark bg-opacity-10">
                <i class="bi-card-image fs-6 text-primary"></i>
                <div class="conteudo w-100 ms-3">
                    <div class="details d-flex align-items-center mb-2 justify-content-between">
                        <span class="name small">${fileName}</span>
                        <span class="percent small">${fileLoaded}%</span>
                    </div>
                    <div class="progress-bar w-100 bg-white mb-1 border-pill" style="height: 4px;">
                        <div class="progress height-100 w-50 bg-primary border-pill" style="width: ${fileLoaded}%;"></div>
                    </div>
                </div>
            </li>`;
            uplodedArea.innerHTML = '';
            uplodedArea.style.position = 'absolute';
            progressArea.style.position = 'static';
            progressArea.innerHTML = progressHtml;
            if(loaded === total){
                progressArea.innerHTML = '';
                progressArea.style.position = 'absolute';
                uplodedArea.style.position = 'static';
                let uploadedHtml = `
                <li class="linha list-group-item border-0 d-flex align-items-center py-2 px-3 justify-content-between rounded bg-dark bg-opacity-10">
                    <div class="conteudo d-flex align-items-center">
                        <i class="bi-card-image fs-6 text-primary"></i>
                        <div class="details d-flex ms-3 flex-column">
                            <span class="name small">${fileName}</span>
                            <span class="size text-dark text-opacity-75" style="font-size:.6rem;">${fileSize}</span>
                        </div>
                    </div>
                    <i class="fs-4 text-primary bi-cloud-check"></i>
                </li>
                `;
                uplodedArea.innerHTML = uploadedHtml;
            }
  });
  let formData = new FormData();
  formData.append('file',file, nameUpload);
  xhr.send(formData);
}


/** Upload de aquivo com o cliente Http Axios */
function uploadFile2(fileName, nameUpload, file, progressArea, uplodedArea){
    let formData = new FormData();
    formData.append('file',file, nameUpload);
    console.log(nameUpload);
    let config = {
        headers: {
            'Content-Type':'multipart/form-data',
        }
    }
    let result = axios.post("php/upload.php",formData, {
        onUploadProgress: ({loaded,total}) => {
            let fileLoaded = Math.floor((loaded/total)*100);
            let fileTotal = Math.floor(total/1000);
            let fileSize;
            (fileSize < 1024**2) ? fileSize = `${fileTotal} KB` : fileSize = (loaded / (1024**2)).toFixed(2) + " MB";
            let progressHtml = `
            <li class="linha list-group-item border-0 d-flex align-items-center justify-content-between rounded">
                <i class="fa fa-file-image-o" aria-hidden="true"></i>
                <div class="conteudo">
                    <div class="details">
                        <span class="name">${fileName}</span>
                        <span class="percent">${fileLoaded}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${fileLoaded}%;"></div>
                    </div>
                </div>
            </li>`;
            uplodedArea.innerHTML = '';
            uplodedArea.style.position = 'absolute';
            progressArea.style.position = 'static';
            progressArea.innerHTML = progressHtml;
            if(loaded === total){
                progressArea.innerHTML = '';
                progressArea.style.position = 'absolute';
                uplodedArea.style.position = 'static';
                let uploadedHtml = `
                <li class="linha list-group-item border-0 d-flex align-items-center justify-content-between rounded bg-dark py-2 px-3 text-dark bg-opacity-10">
                    <div class="conteudo">
                        <i class="fa fa-file-image-o fs-6 text-primary" aria-hidden="true"></i>
                        <div class="details">
                            <span class="name">${fileName}</span>
                            <span class="size">${fileSize}</span>
                        </div>
                    </div>
                    <i class="fa fa-check" aria-hidden="true"></i>
                </li>
                `;
                uplodedArea.innerHTML = uploadedHtml;
            }
        }
    },config)
    
}





