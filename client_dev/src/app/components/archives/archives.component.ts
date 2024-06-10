import { Component, OnInit} from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Proveedor } from 'src/app/models/vendor';
import { Global } from 'src/app/services/global';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { Archivo } from 'src/app/models/archive';
import { UploadService } from 'src/app/services/upload.service';
import { UpperCasePipe } from '@angular/common';
import { empty } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { error } from 'console';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css'],
  providers: [ProjectService, UploadService]
})
export class ArchivesComponent implements OnInit {
  public vendor: Proveedor;
  public identity:any;
  public archivos: Archivo;
  public url:string;
  public  rfc : any;
  public charge: boolean;
  public changeDataEmail: boolean;



  public filesToUpload: Array<File[]>;


  constructor(private _projectService: ProjectService,
    private _uploadService: UploadService,
    private _router:Router,
    private _route: ActivatedRoute) {
      this.vendor = new Proveedor('','','','','','','','',0,'',false,[''],'',false);
      this.archivos = new Archivo('','','','','','','','','','','','','','','','','',false,false);
      this.identity =this._projectService.getIdentity();
      this.filesToUpload=[];
      this.url = Global.url;
      this.charge = false;
      this.changeDataEmail = false;



    }


  ngOnInit(): void {
      localStorage.setItem('rfc', '');
    if(this.identity['rol'] === "proveedor" || this.identity['rol']=== undefined ){
      var rfc = <HTMLInputElement>document.getElementById('rfc');
      var regP =<HTMLInputElement>document.getElementById('regP');
      var razonS= <HTMLInputElement>document.getElementById('razonS');
      rfc.disabled= true;
      regP.disabled = true;
      razonS.disabled = true;

      var botones = document.querySelectorAll('.bton');
      for(var i = 0; i < botones.length;i++){
          var boton = <HTMLInputElement> botones[i];
          boton.style.display= 'none';
      }
    }
    if(this.identity['rol'] === "proveedor" ){
      this.getVendorRfc(this.identity['rfc']);

    }

    if(this.identity['rol'] != "proveedor" ){
      this._route.params.subscribe(params =>{
        let id = params.id;

        this.getVendor(id);
      })
    }




  }
  getAllArchives(rfc:any){

    this._projectService.getAllArchives(localStorage.getItem("rfc")).subscribe(
      response=>{

      },error =>{
        console.log(<any>error);

      }
    )

  }

  getVendor(id:any){
    this._projectService.getVendor(id).subscribe(
      response=>{

       this.vendor = response.vendor;
       this.vendor.rfc =this.vendor.rfc.toUpperCase();
       this.vendor.registroPatronal = this.vendor.registroPatronal.toUpperCase();
       this.vendor.razonSocial = this.vendor.razonSocial.toUpperCase();
       this.vendor.nombreContacto = this.vendor.nombreContacto.toUpperCase();
       if(this.vendor.observaciones){
        this.vendor.observaciones = this.vendor.observaciones.toUpperCase();
       }

       this.vendor.correo = this.vendor.correo.toLowerCase();



       localStorage.setItem('rfc', this.vendor.rfc);
       this.getArchives(this.vendor.rfc);
       this.getAllArchives(this.vendor.rfc);
       if(this.vendor.regimenFiscal == 'fisica'){
        var ocultos = document.querySelectorAll('.ocultar');
        for(var i = 0; i < ocultos.length;i++){
          var oculto = <HTMLInputElement> ocultos[i];
          oculto.style.display= 'none';
      }
       }
      }, error=>{
        console.log(<any>error);
      }
    )
  }
  getVendorRfc(rfc:string){

    this._projectService.getVendorRfc(rfc).subscribe(
      response =>{
        this.vendor = response.vendor;

        this.vendor.rfc = this.vendor.rfc.toUpperCase();
        this.vendor.registroPatronal = this.vendor.registroPatronal.toUpperCase();
        this.vendor.razonSocial = this.vendor.razonSocial.toUpperCase();

        this.vendor.nombreContacto = this.vendor.nombreContacto.toUpperCase();
        if(this.vendor.observaciones){
         this.vendor.observaciones = this.vendor.observaciones.toUpperCase();
        }

        this.vendor.correo = this.vendor.correo.toLowerCase();

        localStorage.setItem('rfc', this.vendor.rfc);
        this.getArchives(this.vendor.rfc);
        this.getAllArchives(this.vendor.rfc);
        if(this.vendor.regimenFiscal == 'fisica'){
          var ocultos = document.querySelectorAll('.ocultar');
          for(var i = 0; i < ocultos.length;i++){
            var oculto = <HTMLInputElement> ocultos[i];
            oculto.style.display= 'none';
        }
         }

        }, error=>{
        console.log(<any>error);
      }
    )
  }
  getArchives(rfc:string){
    var files = document.querySelectorAll('.file');
    this._projectService.getArchives(rfc).subscribe(
      response=>{


        this.archivos = response.archives;


      for(var i = 0; i < files.length;i++){
        var file = <HTMLInputElement> files[i];
        file.style.display= 'none';
    }


      },error=>{
        console.log(<any>error);

      })
  }
  obtenerArchivo(archivo:string){
    this._projectService.getArchive(archivo).subscribe(
      response=>{
      }, error=>{
        console.log(<any>error);
      }
    )
  }

  onSubmit1(){
    if (this.filesToUpload[0].length != 0 && this.filesToUpload[1].length != 0){
      var opcion = confirm("¿Estás seguro de enviar la información?");
      if(opcion == true){
        this.charge = true;
        this._uploadService.makeFileRequest(Global.url+"subir-archivos/"+ localStorage.getItem('rfc'),[],this.filesToUpload).then((result:any)=>{
          this.refresh();
          this.charge = false;
          alert('Los archivos fueron enviados exitosamente');

        }, error=>{
          console.log(error);
          alert('Ocurrió un error ' + error);
          this.charge =false;
        })
      }
    }
  }
  onSubmit() {
    // Verificar si los archivos obligatorios están presentes
    if (this.filesToUpload[0].length) {

      var opcion = confirm("¿Estás seguro de enviar la información?");
      if (opcion) {
        this.charge = true;
        this._uploadService.makeFileRequest(Global.url+"subir-archivos/"+ localStorage.getItem('rfc'), [], this.filesToUpload)
          .then((result:any) => {
            this.refresh();
            this.charge = false;
            alert('Los archivos fueron enviados exitosamente');
          })
          .catch(error => {
            console.log(error);
            alert('Ocurrió un error ' + error);
            this.charge = false;
          });
      }
    } else {
      alert('Recuerda llenar los campos obligatorios');
    }
  }

  fileChangeEvent1(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[0] = [];
    }else{
      this.filesToUpload[0]=<Array<File>>fileInput.target.files;

    }
  }
  fileChangeEvent2(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[1] = [];
    }else{
      this.filesToUpload[1]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent3(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[2] = [];
    }else{
      this.filesToUpload[2]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent4(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[3] = [];
    }else{
      this.filesToUpload[3]=<Array<File>>fileInput.target.files;
    }



  }
  fileChangeEvent5(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[4] = [];
    }else{
      this.filesToUpload[4]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent6(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[5] = [];
    }else{
      this.filesToUpload[5]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent7(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[6] = [];
    }else{
      this.filesToUpload[6]=<Array<File>>fileInput.target.files;
    }

  }
  fileChangeEvent8(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[7] = [];
    }else{
      this.filesToUpload[7]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent9(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[8] = [];
    }else{
      this.filesToUpload[8]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent10(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[9] = [];
    }else{
      this.filesToUpload[9]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent11(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[10] = [];
    }else{
      this.filesToUpload[10]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent12(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[11] = [];
    }else{
      this.filesToUpload[11]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent13(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[12] = [];
    }else{
      this.filesToUpload[12]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent14(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[13] = [];
    }else{
      this.filesToUpload[13]=<Array<File>>fileInput.target.files;
    }


  }
  fileChangeEvent15(fileInput: any){
    if(fileInput.target.files[0].size > 2000000){
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[14] = [];
    }else{
      this.filesToUpload[14]=<Array<File>>fileInput.target.files;
    }


  }

  habilitar(){
    var opcion = confirm("¿Estás seguro de modificar la información?");
    if(opcion == true){
      var files = document.querySelectorAll('.file');
    for(var i = 0; i < files.length;i++){
      var file = <HTMLInputElement> files[i];
      file.style.display= 'block';
  }
    }


  }
  rechazar(){
    var mensaje  = prompt("Redactar motivo por el rechazo de archivos?");
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
    this._projectService.refuseArchives(this.vendor.rfc, mensaje).subscribe(
      response=>{
        alert('Los archivos fueron rechazados exitosamente');
        this.refresh();

      },
      error=>{
        alert('Ocurrió un error: ' +error.error.message);

      }
    )
  }
  }
  validar(){
    if(this.identity['rol'] === "administrador" || this.identity['rol'] === "usuario"){
      var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
    this._projectService.validateArchives(this.vendor.rfc).subscribe(
      response=>{
        alert('Los archivos fueron validados correctamente');
        this.refresh();

      },
      error=>{
        alert('Ocurrió un error: ' +error.error.message);

      }
    )
    }

    }else{
      alert('No tienes permisos suficientes');
    }


  }

  actualizarArchivos() {
    if (this.archivos && this.rfc) {
            console.log('Actualizando archivos:', this.archivos);

      this._projectService.updateArchives(this.rfc, this.archivos)
        .subscribe(
          (response: any) => {
            console.log('Archivos actualizados correctamente:', response);
            // Manejar la respuesta del servidor
            if (response && response.message === "Archivos actualizados correctamente") {
              // Actualización exitosa, realizar acciones adicionales si es necesario
            } else {
              console.error('Error al actualizar archivos: Respuesta inesperada del servidor');
            }
          },
          (error: any) => {
            console.error('Error al actualizar archivos:', error);
            // Manejar errores de la solicitud
          }
        );
    } else {
      console.error('No se proporcionaron archivos o RFC del proveedor.');
    }
  }



  refresh(): void { window.location.reload(); }
  onSubmitU(){
    if(this.changeDataEmail == true){
      var emailchange = confirm("Se detectó cambio de correo, ¿Deseas reenviar la información al nuevo correo del proveedor?");
      if(emailchange == true){
        this.changeDataEmail = true;
      }else{
        this.changeDataEmail = false;
      }

    }

    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
      this._projectService.updateVendor(this.vendor,this.changeDataEmail).subscribe(
        response=>{

          alert('El Usuario fue registrado correctamente');
          this.refresh();
          this.changeDataEmail = false;
        },
        error=>{

          alert('Ocurrió un error: ' +error.error.message);

        }

      )
    }

  }

  changeData(){
    this.changeDataEmail = true;

  }



}
