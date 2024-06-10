import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders} from "@angular/common/http";
import{Observable} from 'rxjs';
import { Usuario } from '../models/user';
import { Proveedor } from "../models/vendor";
import { Archivo } from "../models/archive";
import { catchError, map } from 'rxjs/operators';

import { Global } from "./global";

@Injectable()
export class ProjectService{
    public url: string;
    public identity: any;
    public token: any;
    public rfc : any;

    constructor(public _http: HttpClient){
        this.url = Global.url;


    }
    signup(user: any, gettoken:any = null): Observable<any>{
        if(gettoken != null){
            user = Object.assign(user, {gettoken});
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'login', params,{headers: headers});

    }
    getIdentity(){
        let identity = '';
        identity = JSON.parse(localStorage.getItem('identity') || '{}');
        if(identity != null){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }
    getRfc(){
        let rfc = '';
        rfc = localStorage.getItem('rfc') || '{}';
        if(rfc != null){
            this.rfc = rfc;
        }else{
            this.rfc = null;
        }
        return this.rfc;
    }
    getToken(){
        let token = localStorage.getItem('token');
        if(token != "undefined"){
            this.token = token;
        }
        else{
            this.token = null;
        }
        return this.token;
    }
    getUSer(userId:any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.get(this.url+'usuario/'+userId, {headers:headers});



    }
    saveVendor(user:Proveedor):Observable<any>{

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.post(this.url+'subir-proveedor', params, {headers:headers});


    }
    getVendors(empresa:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedores/'+empresa, {headers:headers});

    }

    getArchivesAll(): Observable<any> {
      const token = this.getToken();
      //console.log('Token:', token);

      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

      return this._http.get(this.url + 'obtener-pdf/', { headers: headers })
                        .pipe(
                          catchError(error => {
                            console.error('Error en la solicitud:', error);
                            throw error;
                          })
                        );
    }

    getArchives22(): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
      return this._http.get(this.url + 'obtener-archivos', { headers: headers });
  }


    getVendor(id: any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedor/'+id, {headers:headers});
    }
    getVendorRfc(rfc: any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedorauth/'+rfc, {headers:headers});
    }


    getVendorNoRfc(rfc: any): Observable<any>{
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
      return this._http.get(this.url+'proveedorauth/'+rfc, {headers:headers});
  }

    saveArchives(archivo: Archivo):Observable<any>{

        let params = JSON.stringify(archivo);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.post(this.url+'subir-archivos', params, {headers:headers});


    }
    getArchives(rfc:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.get(this.url+'obtener-archivos/'+rfc, {headers:headers});

    }

    getArchive(file: any): Observable<any> {
      let headers = new HttpHeaders()
        .set('Authorization', this.getToken());

      return this._http.get(this.url + 'archivos/' + file, {
        headers: headers,
        responseType: 'blob'  // Indica que la respuesta es de tipo blob
      });
    }


    getAllArchives(rfc:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedor-archives/'+rfc, {headers:headers});
    }
    refuseArchives(rfc:any, mensaje:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());

        return this._http.delete(this.url+'archivos/'+rfc+'/'+mensaje, {headers:headers});

    }
    validateArchives(rfc:any): Observable<any>{


        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.put(this.url+'archivos/'+rfc, {headers:headers});


    }

    saveUsers(user:Usuario):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());


        return this._http.post(this.url+'registro', params, {headers:headers});

    }
    updateVendor(user:Proveedor, send:any):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.put(this.url+'proveedor/'+user._id+'/'+send,params,{headers:headers});
    }
    changePassword(user:Usuario, newPass:any):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+ 'cambiar-info/'+newPass,params, {headers:headers});

    }
    forgotPass(usuario:any):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+ 'forgot-pass/'+usuario, {headers:headers});

    }

    updateArchives(rfc: string, archivos: Archivo): Observable<any> {
      const token = localStorage.getItem('token');
      let headers = new HttpHeaders().set('Authorization', token || '');

      // Enviar directamente una solicitud PUT con los datos actualizados del proveedor
      return this._http.put(`${this.url}updateArchives/${rfc}`, archivos, { headers }).pipe(
        catchError(error => {
          console.error('Error en la solicitud:', error);
          throw error;
        })
      );
    }

}
