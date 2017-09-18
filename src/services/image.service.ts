import { Injectable } from '@angular/core';

// Native
import { ActionSheet, 
         ActionSheetOptions } from '@ionic-native/action-sheet';
import { Camera, 
         CameraOptions } from '@ionic-native/camera';
import { ImagePicker,
         ImagePickerOptions } from '@ionic-native/image-picker';
import { File,
         FileEntry, Entry } from '@ionic-native/file';


@Injectable()
export class ImageService {
  cameraOptions: CameraOptions;
  destType: number;
  bucketName: string;
  control: any;

  constructor(
    private actionsheet: ActionSheet,
    private camera:      Camera,
    private gallery:     ImagePicker,
    private file:        File
  ) {
  }

  requestPicture( ) {
    let options: ActionSheetOptions = {
      androidTheme: this.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      buttonLabels: [
        'Take a Picture',
        'Select from Gallery',
      ],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton: true,
      destructiveButtonLast: true
    };

    this.actionsheet.show( options ).then(
      ( selection: number ) => {
        if ( selection == 1 ) {
          this.takePicture();
        } else if ( selection == 2 ) {
          this.openGallery();
        }
      }
    );
  }

  takePicture() {
    const cameraOptions = {
      quality: 50,
      encodingType: 0,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture( cameraOptions ).then(
      ( _url ) => {
        this.retrieveFile( _url );
      }
    );
  }

  openGallery() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 50
    }

    this.gallery.getPictures( options ).then(
      ( _url ) => {
        this.retrieveFile( _url[0] );
      }
    );
  }

  retrieveFile( _url: string ) {
    // Retrieve file from the file system
    this.file.resolveLocalFilesystemUrl( _url )
    .then( entry => {
      // Cast to FileEntry and get the file
      (<FileEntry>entry).file( file => {
        this.readFile( file );
      },
      error => {
        console.error('error getting file', error)
      });
    })
    .catch( error => {
      console.error('failed to resolve file', error)
    });
  }

  readFile( file ) {
    console.log('initial file', file)

    const reader = new FileReader();

    reader.onloadstart = function( e ) {
      console.log('starting read', e)
    }
    reader.onprogress = ( e ) => {
      console.log('read progress', e)
    }
    reader.onloadend = ( e ) => {
      console.log('read complete', e);
      const imgBlob = new Blob( [reader.result], { type: file.type }) ;
      console.log('read image', imgBlob)
    };
    reader.onerror = ( err ) => {
      console.error( err );
    }

    reader.readAsArrayBuffer(file);
  }

  fileError( err ) {
    console.error('error retrieving file', err)
  }
}