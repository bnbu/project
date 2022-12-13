import React, { Component } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

class TextEditor extends Component{
  render(){
    const { onChange } = this.props // <- Dont mind this, just handling objects from props because Im using this as a shared component.

    const custom_config = {
      extraPlugins: [ MyCustomUploadAdapterPlugin ],
      mediaEmbed: {previewsInData: true},
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'blockQuote',
          'insertTable',
          '|',
          'ImageInsert',
          'ImageResize',
          "mediaEmbed",
          '|',
          'undo',
          'redo'
        ]
      },
      table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
      }
    }

    return(
        <CKEditor
        editor={ClassicEditor}
        data={this.props.value}
        name='p_content'
        onChange={(event, editor) => {
            const data = editor.getData()
              onChange(data)
            }}
            config={custom_config}
      />
    )
  }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = ( loader ) => {
      return new UploadAdapter(loader)
    }
  }

class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        } );
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/image/upload', true)
	// => POST시, api를 요청할 주소를 백엔드에 작성할 것.
        xhr.responseType = 'json';
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    }

    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = '파일을 업로드 할 수 없습니다.'

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.response)
            console.log(response);
            if(!response || response.error) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            resolve({
                default: response.url, //업로드된 파일에 대해 반환받은 주소 (3-4의 res로 보내주는 json데이터를 사용)
            })
        })

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    _sendRequest(file) {
        const data = new FormData()

        this.loader.file.then(result => {
            data.append('file', result);
            this.xhr.send(data)
        })
    }
}

export default TextEditor;