import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class UploadController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage(
            {
                destination: './uploads',
                filename: (req, file, cb) => {
                    // Generating a 32 random chars long string
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    //Calling the callback passing the random name generated with the original extension name
                    return cb(null, `${randomName}${extname(file.originalname)}`)
                }
            }
        )
    }))

    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `http://localhost:8000/api/${file.path}`
        }
    }

    @Get("uploads/:path")
    async getImage(
        @Param("path") path : string,
        @Res() res: Response
    ) {
        res.sendFile(path, { root: 'uploads' });
    }    
}
