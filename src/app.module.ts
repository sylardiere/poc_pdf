import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PupeteerController } from './pupeteer/pupeteer.controller';
import { PdfMergerController } from './pdf-merger/pdf-merge.controller';

@Module({
  imports: [],
  controllers: [AppController, PupeteerController, PdfMergerController],
  providers: [AppService],
})
export class AppModule {}
