import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import {Query} from 'express-serve-static-core'
import { User } from 'src/auth/schemas/user.schema';
@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel:mongoose.Model<Book>
    ){}

    async finAll(query:Query):Promise<Book[]>{
        const resPerPage:number=2
        const currentPage=Number(query.page ) || 1
        const skip= resPerPage*(currentPage-1)
        const keyword=query.keyword?{
            title:{
                $regex:query.keyword,
                $options:'i'
            }
        }:{}
                
        const books=await this.bookModel.find({...keyword})
            .limit(resPerPage).skip(skip)
            .populate({
                path:'user',
                select:'name email'
            })
        return books;
    }

    async create(book:Book,user:User):Promise<Book>{
        const data=Object.assign(book,{user:user._id})
        //chck the book is exist in theeeee database:
        const bookExist= await this.bookModel.findOne({title:book.title})
        if(bookExist){
            throw new NotAcceptableException("Book already exist....")    
        }else{
            const res=await this.bookModel.create(data);
            // const result=res.save()
            return res
        }
    }

    async findById(id:string):Promise<Book>{
        const isValidId=mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException("Please enter correct id")
        }
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
