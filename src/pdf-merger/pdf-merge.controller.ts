import { Controller, Post, UseInterceptors, Res, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import PDFMerger = require('pdf-merger-js');
import * as muhammara from 'muhammara';

@Controller('merge-pdf')
export class PdfMergerController {
    constructor(){}

    // issue avec le fichier du rapport protégé
    @Post('pdf-merger')
    @UseInterceptors(
        FilesInterceptor('pdfFiles', 3, {
            storage: diskStorage({
              destination: './tmp', 
              filename: (req, file, cb) => {
                const filename = `${file.originalname}`;
                return cb(null, filename);
              },
            }),
          }),
      )
    async mergePdfs(
        @UploadedFiles() pdfFiles: Express.Multer.File[],
        @Res() res
    ){
        console.log(pdfFiles)
        const pdfMerger = new PDFMerger();
        await pdfMerger.add(pdfFiles[0].path);  
        await pdfMerger.add(pdfFiles[2].path, "1");
        await pdfMerger.add(pdfFiles[1].path);
        const testFile = await pdfMerger.saveAsBuffer(); 
        res.setHeader('Content-Type', 'application/pdf');
        res.send(testFile);
    }   
    
    // https://www.npmjs.com/package/muhammara?activeTab=readme
    @Post('muhammara')
    @UseInterceptors(
        FilesInterceptor('pdfFiles', 3, {
            storage: diskStorage({
              destination: '/tmp', 
              filename: (req, file, cb) => {
                const filename = `${file.originalname}`;
                return cb(null, filename);
              },
            }),
          }),
      )
    async mergePdfsPdfLib(
        @UploadedFiles() pdfFiles: Express.Multer.File[],
        @Res() res
    ){
        // adapter les index de pdfFiles en fonction de l'ordre d'envoi
        const finalPath = "/tmp/test.pdf";
        const pdfMerger = new muhammara.Recipe(pdfFiles[0].path, finalPath);

        // pour le rapport pdf avec plusieurs pages
        const reportPages = new muhammara.Recipe(pdfFiles[2].path) as any;
        const pages: number[] = Array.from(Array(reportPages.metadata.pages), (_, index) => index + 1);

        pdfMerger.appendPage(pdfFiles[1].path, 0).appendPage(pdfFiles[2].path, pages).endPDF();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=compliance-report.pdf');
        const pdfFile = fs.createReadStream(finalPath);
        pdfFile.pipe(res);
    } 
    
}