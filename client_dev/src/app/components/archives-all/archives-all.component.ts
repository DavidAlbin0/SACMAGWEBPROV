import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Archivo } from 'src/app/models/archive';
import * as JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-archives-all',
  templateUrl: './archives-all.component.html',
  styleUrls: ['./archives-all.component.css'],
  providers: [ProjectService]
})
export class ArchivesAllComponent implements OnInit {
  public archivos: Archivo[];
  public identity: any;
  public descargandoZIP: boolean = false; // Nueva propiedad


  constructor(private _projectService: ProjectService) {
    this.archivos = [];
  }

  ngOnInit(): void {
    if (this._projectService.getToken()) {
      this.getArchivesAll();
    } else {
      console.log("No hay archivos");
    }
  }

  async getArchivesAll(): Promise<void> {
    try {
      const response = await this._projectService.getArchivesAll().toPromise();
      if (response.archives) {
        this.archivos = response.archives;
        this.descargarZIP();
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  async descargarZIP(): Promise<void> {
    this.descargandoZIP = true;
    const zip = new JSZip();

    for (const archive of this.archivos) {
      try {
        const rfcFolder = `${archive.rfc}/`; // Carpeta para el RFC actual

        const fileContents1 = await this._projectService.getArchive(archive.archivo1).toPromise();
        zip.file(`${rfcFolder}1.Formato-Requisitado-Alta-Proveedor.pdf`, fileContents1);

        const fileContents2 = await this._projectService.getArchive(archive.archivo2).toPromise();
        zip.file(`${rfcFolder}2.Constancia-de-situacion-fiscal.pdf`, fileContents2);

        const fileContents3 = await this._projectService.getArchive(archive.archivo3).toPromise();
        zip.file(`${rfcFolder}3.Alta-IMSS-registro-patronal.pdf`, fileContents3);

        const fileContents4 = await this._projectService.getArchive(archive.archivo4).toPromise();
        zip.file(`${rfcFolder}4.INE-Representante-legal.pdf`, fileContents4);

        if (archive.archivo5) {
          const fileContents5 = await this._projectService.getArchive(archive.archivo5).toPromise();
          zip.file(`${rfcFolder}5.Acta-constitutiva-y-modificaciones.pdf`, fileContents5);
        }

        const fileContents6 = await this._projectService.getArchive(archive.archivo6).toPromise();
        zip.file(`${rfcFolder}6.Comprobante-de-domicilio.pdf`, fileContents6);

        const fileContents7 = await this._projectService.getArchive(archive.archivo7).toPromise();
        zip.file(`${rfcFolder}7.Estado-de-cuenta-con-cuenta-clabe.pdf`, fileContents7);

        const fileContents8 = await this._projectService.getArchive(archive.archivo8).toPromise();
        zip.file(`${rfcFolder}8.Opinión-de-cumplimiento-de 32D-SAT.pdf`, fileContents8);

        const fileContents9 = await this._projectService.getArchive(archive.archivo9).toPromise();
        zip.file(`${rfcFolder}9.Opinión-de-cumplimiento-de 32D-IMSS.pdf`, fileContents9);

        const fileContents10 = await this._projectService.getArchive(archive.archivo10).toPromise();
        zip.file(`${rfcFolder}10.Opinión-de-cumplimiento-de 32D-INFONAVIT.pdf`, fileContents10);

        const fileContents11 = await this._projectService.getArchive(archive.archivo11).toPromise();
        zip.file(`${rfcFolder}11.Curriculum-de-la-empresa-curriculum-cedula.pdf`, fileContents11);

        const fileContents12 = await this._projectService.getArchive(archive.archivo12).toPromise();
        zip.file(`${rfcFolder}12.Otros-requeridos-por-la-legislacion-vigente.pdf`, fileContents12);

        const fileContents13 = await this._projectService.getArchive(archive.archivo13).toPromise();
        zip.file(`${rfcFolder}13.Especificaciones-de-calibracion-de-equipos-certificados.pdf`, fileContents13);

        const fileContents14 = await this._projectService.getArchive(archive.archivo14).toPromise();
        zip.file(`${rfcFolder}14.Codigo-de-ética-firmado-por-el-representante-legal.pdf`, fileContents14);

        const fileContents15 = await this._projectService.getArchive(archive.archivo15).toPromise();
        zip.file(`${rfcFolder}15.Ultima-declaracion-anual-presentada.pdf`, fileContents15);


        // ... Repite este patrón para cada archivo

      } catch (error) {
        console.error('Error al leer el archivo:', error);
      }
    }


    zip.generateAsync({ type: 'blob' })
    .then(blob => {
      const fechaActual = new Date();
      const url = window.URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `Proveedores ${fechaActual.getFullYear()}/${fechaActual.getMonth() + 1}/${fechaActual.getDate()}.zip`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      this.descargandoZIP = false; // Finaliza la descarga
    })
    .catch(error => {
      console.error('Error al generar el archivo ZIP', error);
      this.descargandoZIP = false; // Manejo de error, finaliza la descarga
    });}


  private async readFileAsync(fileName: string): Promise<Uint8Array> {
    try {
      const response = await this._projectService.getArchive(fileName).toPromise();
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      throw error;
    }
  }

}
