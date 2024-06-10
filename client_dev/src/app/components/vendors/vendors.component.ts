import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../models/vendor';
import { ProjectService } from '../../services/project.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
  providers: [ProjectService]
})
export class VendorsComponent implements OnInit {
  public vendors: Proveedor[];
  public identity;
  public originalVendors: Proveedor[] = [];
  public mosaicoView: boolean = true; // Variable para controlar la vista

  search = new FormControl('');
  filtroValor = '';
  regimenFiltroActivo: boolean = false;
  filtroValind: boolean = false;

  constructor(private _projectService: ProjectService) {
    this.vendors = [];
    this.identity = this._projectService.getIdentity();
  }

  ngOnInit(): void {
    if (this._projectService.getToken() != undefined) {
      this.getVendors();
    }

    this.search.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.searchVendors(value);
    });
  }

  descargarZIP(): void {
    const zip = new JSZip();

    this.vendors.forEach((vendor, index) => {
      zip.file(`proveedor_${index + 1}.txt`, JSON.stringify(vendor));
    });

    zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'proveedores.zip';
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
      })
      .catch((error) => console.error('Error al generar el archivo ZIP', error));
  }

  getVendors() {
    this._projectService.getVendors(this.identity['empresa']).subscribe(
      response => {
        if (response.vendors) {
          this.vendors = response.vendors;
          this.originalVendors = [...this.vendors];
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  handleSearch(value: any) {
    this.filtroValor = value;
  }
  searchVendors(value: string) {
    // Convertir el valor de búsqueda a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas
    const searchValue = value.toLowerCase();

    // Filtrar la lista de proveedores originales en base al valor de búsqueda
    this.vendors = this.originalVendors.filter(vendor =>
      // Realizar la búsqueda en todas las propiedades del proveedor
      Object.values(vendor).some(prop =>
        // Convertir el valor de la propiedad a texto en minúsculas y verificar si incluye el valor de búsqueda
        prop.toString().toLowerCase().includes(searchValue)
      )
    );
  }





  //Aqui empiezan los filtros de la botonera


  //Filtros valido e invalido
  filterValidArchives() {
    this.filtroValind = !this.filtroValind;

    if (this.filtroValind) {

      this.vendors = this.vendors.filter(vendor => vendor.verificado);
    }    else
    {
      this.vendors = [...this.originalVendors];

    }

  }

//Invalido
  filterInvalidArchives() {
    this.filtroValind = !this.filtroValind;
    if (this.filtroValind) {

      this.vendors = this.vendors.filter(vendor => !vendor.verificado && !vendor.verificado);
    }    else
    {
      this.vendors = [...this.originalVendors];

    }
  }

  //Regresas a todos
  showAllVendors() {
    this.vendors = [...this.originalVendors];
  }



  //Filtros regimen fiscal
  filterRegimenM(){
    this.regimenFiltroActivo = !this.regimenFiltroActivo;

    if(this.regimenFiltroActivo){
      this.vendors = [...this.originalVendors];

      this.vendors = this.vendors.filter(vendor => vendor.regimenFiscal == "moral");
    } else if(this.filtroValind || !this.regimenFiltroActivo){

      this.vendors = this.vendors.filter(vendor => vendor.regimenFiscal == "moral");
    }
    else
    {
      this.vendors = [...this.originalVendors];

    }
  }


  filterRegimenF() {
    this.regimenFiltroActivo = !this.regimenFiltroActivo;

    if(this.regimenFiltroActivo){
      this.vendors = [...this.originalVendors];

      this.vendors = this.vendors.filter(vendor => vendor.regimenFiscal == "fisica");
    } else if(this.filtroValind || this.regimenFiltroActivo){

      this.vendors = this.vendors.filter(vendor => vendor.regimenFiscal == "fisica");
    }
    else
    {
      this.vendors = [...this.originalVendors];

    }
  }

  filterRegimenR() {
    this.regimenFiltroActivo = !this.regimenFiltroActivo;

    if(this.regimenFiltroActivo){
      this.vendors = [...this.originalVendors];

      this.vendors = this.vendors.filter(vendor => vendor.regimenFiscal == "repse");
    } else if(this.filtroValind || this.regimenFiltroActivo){

      this.vendors = this.vendors.filter(vendor => vendor.regimenFiscal == "repse");
    }
    else
    {
      this.vendors = [...this.originalVendors];

    }
  }

  // Método para alternar entre vistas
  toggleView() {
    this.mosaicoView = !this.mosaicoView;
  }
}
