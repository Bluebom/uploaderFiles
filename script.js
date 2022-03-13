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
    fileInput[i-1].onchange = ({target}) => {
        let file = target.files[0];
        if(file) {
            
            updateThumbnail(form[i-1], file);
            let fileName = file.name;
            let identificador = form[i-1].getAttribute('identificador'); 
            if(fileName.length >= 12){
                let splitName = fileName.split('.');
                fileName = splitName[0].substring(0,12) + `... .${splitName[(parseInt(splitName.length) - 1)]}`;
            }            
            fileName = fileName.replace(/(\/)/g,'');
            let nameUpload = `${identificador}!${fileName}`;
            uploadFile(fileName, nameUpload, file, progressArea[i-1], uplodedArea[i-1]);
        }
    }
    form[i-1].addEventListener("dragover", (e) => {
        e.preventDefault();
        form[i-1].style.borderStyle = 'solid';
    });
    ["dragleave", "dragend"].forEach((type) => {
        form[i-1].addEventListener(type, (e) => {
          form[i-1].style.borderStyle = 'dotted';
        });
    });
    form[i-1].addEventListener("drop", (e) => {
        e.preventDefault();
    
        if (e.dataTransfer.files.length) {
            let file = e.dataTransfer.files[0];
            updateThumbnail(form[i-1], file);
        
            form[i-1].style.borderStyle = 'solid';
            let fileName = file.name;
            let identificador = form[i-1].getAttribute('identificador'); 
            if(fileName.length >= 12){
                let splitName = fileName.split('.');
                fileName = splitName[0].substring(0,12) + `... .${splitName[(parseInt(splitName.length) - 1)]}`;
            }            
            fileName = fileName.replace(/(\/)/g,'');
            let nameUpload = `${identificador}!${fileName}`;
            uploadFile(fileName, nameUpload, file, progressArea[i-1], uplodedArea[i-1]);
        }
    });
}

function updateThumbnail(form,file){
    form.querySelector('.fa-cloud-upload').style.display = 'none';
    if(file.type != 'application/pdf'){
        form.style.backgroundImage = `url('${URL.createObjectURL(file)}')`
    }else{
        form.style.backgroundImage = `url('php/files/pdf.webp')`;
        form.style.backgroundSize = `contain`;
    }
}



// Upload file
function uploadFile(fileName, nameUpload, file, progressArea, uplodedArea){
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
            console.log(loaded,total);
            let fileLoaded = Math.floor((loaded/total)*100);
            let fileTotal = Math.floor(total/1000);
            let fileSize;
            (fileSize < 1024**2) ? fileSize = `${fileTotal} KB` : fileSize = (loaded / (1024**2)).toFixed(2) + " MB";
            let progressHtml = `
            <li class="linha">
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
            if(loaded == total){
                progressArea.innerHTML = '';
                progressArea.style.position = 'absolute';
                uplodedArea.style.position = 'static';
                let uploadedHtml = `
                <li class="linha">
                    <div class="conteudo">
                        <i class="fa fa-file-image-o" aria-hidden="true"></i>
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





