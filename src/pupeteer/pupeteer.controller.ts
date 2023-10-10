import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('pupeteer')
export class PupeteerController {
    constructor(){}

    @Post()
    @UseInterceptors(
        FileInterceptor('htmlFile', {
          storage: diskStorage({
            destination: `/tmp/`,
            filename: (_req, file, cb) => {
              const fileName = `${file.originalname}`;
              cb(null, fileName);
            },
          }),
        }),
      )
    async generatePdf(
        @UploadedFile() htmlFile: Express.Multer.File,
        @Res() res
    ){
        console.time('executionTime');
        const pdfFilePath = '/tmp/pdf_test.pdf';
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        const pathToFile = path.join(htmlFile.destination, htmlFile.filename);

        await page.goto(`file://${pathToFile}`, { waitUntil: 'networkidle2' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await fs.promises.rm(`${pathToFile}`)
        await browser.close();

        fs.writeFileSync(pdfFilePath, pdfBuffer);
        console.timeEnd('executionTime');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
        res.send(pdfBuffer);
    } 
}
