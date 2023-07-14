import { Request, Response } from "express";

export async function getHotels(req:Request,res:Response){
    res.send('tome hoteis')
}

export async function getHotelById(req:Request,res:Response){
    res.send(`tome hotel pelo id ${req.params.hotelId}`)
}