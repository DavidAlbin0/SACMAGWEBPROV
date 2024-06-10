import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Proveedor } from '../../models/vendor';
import { Global } from '../../services/global';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ProjectService]
})
export class RegisterComponent implements OnInit {
  public vendor: Proveedor;
  public url: string;
  public identity:any;
  public title:string;


  constructor(
    private _projectService: ProjectService,
    private _router:Router,
    private _route: ActivatedRoute
  ) {
    this.vendor = new Proveedor('','','','','','','','',0,'',false,[''],'',false);
    this.url = Global.url;
    this.title="Registrar";
  }

  ngOnInit(): void {
    this._route.params.subscribe(params =>{
      let id = params.id;
      this.identity =this._projectService.getIdentity();
      var element = <HTMLInputElement> document.getElementById("boton");
      element.style.display= 'none';
      if(this.identity['rol'] === "administrador" || this.identity['rol'] === "usuario" ){
        element.style.display= 'block';
        this.getVendor(id);


      }
      if(this.identity['rol'] === "proveedor"){
        this.title ="Datos";
        this.vendor.rfc = this.identity['rfc'];
        this.vendor.registroPatronal = this.identity['registroPatronal'];
        var seccion = <HTMLElement>  document.querySelector('.registro');
        seccion.style.display = 'none';
      }





    })
  }
  onSubmit(form:any){
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
      this.vendor.empresa = this.identity['empresa'];

      this._projectService.saveVendor(this.vendor).subscribe(
        response=>{

          alert('El Proveedor fue registrado correctamente');
          form.reset();

        },
        error=>{
          alert('Ocurrió un error: ' +error.error.message);

        }
      )
    }


  }
  getVendor(id:any){
    this._projectService.getVendor(id).subscribe(
      response=>{

        this.vendor = response.vendor;
        if(response.vendor){
          this.title ="Datos";
        }


      }, error=>{
        console.log(<any>error);
      }
    )
  }
  valid(){
    if(this.vendor.rfc.length < 12 || this.vendor.rfc.length > 13){
      this.vendor.rfc = '';
    }
  }

}

