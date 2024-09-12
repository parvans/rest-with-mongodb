import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
@Controller('books')
export class BookController {
    constructor(private bookService:BookService){}

    @Get()
    @Roles(Role.Moderator,Role.Admin) //custom made for multiple roles
    @UseGuards(AuthGuard(),RolesGuard)

    async getAllBooks(
        @Query()
        query:ExpressQuery
    ):Promise<Book[]>{
        return this.bookService.finAll(query);
    }

    @Post('new')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(),RolesGuard)
    async createBook(
        @Body()
        book:CreateBookDto,
        @Req() req
    ):Promise<Book>{
        return this.bookService.create(book,req.user)
    }

    @Get(':id')
    async getBooksById(
        @Param('id')
        id:string
    ):Promise<Book>{
        return this.bookService.findById(id);
    }

    @Put('update/:id')
    async updateBook(
        @Param('id')
        id:string,
        @Body()
        book:UpdateBookDto,
    ):Promise<Book>{
        return this.bookService.updateById(id,book)
    }

    @Delete('delete/:id')
    async deleteBook(
        @Param('id')
        id:string,
        
    ):Promise<Book>{
        return this.bookService.deleteBookById(id)
    }
}
