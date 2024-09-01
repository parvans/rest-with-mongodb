import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel:mongoose.Model<Book>
    ){}

    async finAll():Promise<Book[]>{
        const books=await this.bookModel.find();
        return books;
    }

    async create(book:Book):Promise<Book>{
        
        //chck the book is exist in theeeee database:
        const bookExist= await this.bookModel.findOne({title:book.title})
        if(bookExist){
            throw new NotAcceptableException("Book already exist....")    
        }else{
            const res=await this.bookModel.create(book);
            const result=res.save()
            return result
        }
    }

    async findById(id:string):Promise<Book>{
        const res=await this.bookModel.findById(id)
        if(!res){
            throw new NotFoundException("Could not find the book.")
        }

        return res
      
    }

    async updateById(id:string,book:Book):Promise<Book>{
        return await this.bookModel.findByIdAndUpdate(id,book,{
            new:true,
            runValidators:true
        })
        
      
    }

    async deleteBookById(id:string):Promise<Book>{
        const res=await this.bookModel.findByIdAndDelete(id)

        if (!res){
            throw new NotFoundException("Book Not Found")
        }

        return res;
        
      
    }


}
