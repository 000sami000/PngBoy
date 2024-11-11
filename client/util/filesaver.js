import FileSaver from 'file-saver'

function downloadFile(_id,photo){
    console.log(photo,"KJLKJLHL")
    FileSaver.saveAs(photo,`img_${_id}.jpg`)
}

export {downloadFile}