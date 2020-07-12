'use strict'

var Product = require('../models/products.models');
var Category = require('../models/cetegory.models');
var User = require('../models/user.models');
var Bill = require('../models/bill.model');

function saveBill(req, res){
    let bill = new Bill();
    let params = req.body;
    let userId = req.params.idU;
    
    if(params.client && params.name && params.quantity && params.productPrice){

        bill.numberBill = params.numberBill;
        bill.client = params.client;

        Bill.findOne({numberBill: params.numberBill}, (err, findNumberBill)=>{
            if(err){
                res.status(500).send({message: 'Error genera al buscar numero de factura'});
            } else if(findNumberBill){
                Product.findOne({name: params.name}, (err, findProduct)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al buscar producto'});
                    } else if(findProduct){
                      
                        Bill.findOne({'product.name': params.name, numberBill: params.numberBill}, (err, findProductName)=>{
                            if(err){
                                res.status(500).send({message: 'Error genera al buscar factura', err});
                            } else if(findProductName){
                                res.status(500).send({message: 'Producto existente'});
                            } else{
                                let total = Number(params.quantity) * Number (findProduct.price);
                                if(findProduct.stock >= params.quantity){
                                    let descuento = findProduct.stock - params.quantity;
                                    Bill.findOneAndUpdate({numberBill: params.numberBill}, {$push: {product: [{name: findProduct.name, 
                                                                                                               quantity: params.quantity, 
                                                                                                               price: findProduct.price,
                                                                                                               total: total}]}},
                                        {new: true}, (err, updateBill)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general al actualizar factura 1', err});
                                            } else if(updateBill){
                                                Product.findOneAndUpdate({name: params.name}, {stock: descuento}, 
                                                    {new: true}, (err, updateProduct)=>{
                                                        if(err){
                                                            res.status(500).send({message: 'Error general al buscar producto1', err});
                                                        } else if(updateProduct){
                                                            res.status(500).send({message: 'se generó la factura exitosamente', updateBill});
                                                        } else{
                                                            res.status(500).send({message: 'Error general al buscar producto2'});
                                                        }
                                                    });
                                            } else{
                                                res.status(500).send({message: 'No se generó la factura, intente mas tarde'});
                                            }
                                        });
                                }else if(findProduct.stock < params.quantity){
                                    res.status(500).send({message: 'No hay artículos suficientes'});
                                }               
                            }                    
                        }) 
                    } else{
                        res.status(500).send({message: 'No se ha encontrado ningún producto con el nombre'});
                    }
                }); 
            } else{
                Product.findOne({name: params.name}, (err, findProduct1)=>{
                    let total = parseInt(params.quantity) * parseInt(findProduct1.price);

                        if(findProduct1.stock > params.quantity){
                        let descuento = findProduct1.stock - params.quantity;
                            if(err){
                                res.status(500).send({message: 'Error genera al buscar numero de factura'});
                            } else if(findProduct1){
                                bill.save((err, saveBill)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al guardar factura', err});
                                    } else if(saveBill){
                                        Bill.findOneAndUpdate({numberBill: params.numberBill}, {$push: {product: [{name: findProduct1.name, 
                                                                                                                   quantity: params.quantity, 
                                                                                                                   price: findProduct1.price,
                                                                                                                   total: total}]}},
                                        {new: true}, (err, updateBill)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general al actualizar factura 2', err});
                                            } else if(updateBill){
                                                Product.findOneAndUpdate({name: params.name}, {stock: descuento}, 
                                                    {new: true}, (err, updateProduct)=>{
                                                        if(err){
                                                            res.status(500).send({message: 'Error general al buscar producto1', err});
                                                        } else if(updateProduct){
                                                            res.status(500).send({message: 'se generó la factura exitosamente', updateBill});
                                                        } else{
                                                            res.status(500).send({message: 'Error general al buscar producto2'});
                                                        }
                                                    });
                                            } else{
                                                res.status(500).send({message: 'No se pudo efectuar la  factura, intente mas tarde'});
                                            }
                                        }); 
                                    } else{
                                        res.status(500).send({message: 'No se puede guardar la factura, intente mas tarde'});
                                    }
                            });
                            } else{
                                res.status(500).send({message: 'No se pudo encontrar el producto'});
                            }
                    } else if(findProduct1.stock <= params.quantity){
                        res.status(200).send({message: 'No hay artículos suficientes'})
                    }   
                });
            }
        });
        } else{
            res.status(500).send({message: 'Ingrese los datos necesarios'});
        }
}

function listBills(req, res){
    let userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Bill.find({}, (err, bills)=>{
            if(err){

            } else if(bills){
                res.status(200).send({message: bills})
            } else{
            }
        });
    }
}

function listProductsBills(req, res){
    let userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Bill.find({}, {total: 0, client: 0, numberBill: 0}, (err, bills)=>{
            if(err){

            } else if(bills){
                res.status(200).send({message: bills})
            } else{

            }
        });
    }
}

//Listar Productos Agotados
function productsAgoted(req, res){
    let userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Product.find({stock: 0}, (err, findProduct)=>{
            if(err){
                res.status(500).send({message: 'Error General'});
            } else if(findProduct){
                if(findProduct.length == 0){
                    res.status(200).send({message: 'No hay productos agotados'})
                } else{
                    res.status(200).send({message: 'Estos son los productos agotados: ', findProduct});
                }
            } else {
                res.status(404).send({message: 'Intente mas tarde'});
            }
        });
    }
} 


module.exports = {
    saveBill,
    listBills,
    listProductsBills,
    productsAgoted
}