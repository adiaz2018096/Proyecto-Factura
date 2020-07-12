'use strict'

var Category = require('../models/cetegory.models');
var Products = require('../models/products.models');

function saveCategory(req, res){
    let userId = req.params.id;
    let category = new Category();
    let params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos necesarios'});
    } else{
        if(params.nameCategory){
            Category.findOne({nameCategory: params.nameCategory}, (err, successful)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err});
                } else if(successful){
                    res.status(500).send({message: 'No puede almacenar una categoría repetida'});
                } else{ 
                    category.nameCategory = params.nameCategory;

                    category.save((err, categorySaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general', err});
                        } else if(categorySaved){
                            res.status(200).send({message: 'Se ha completado la acción', categorySaved});
                        } else{
                            res.send({message: 'Intente más tarde'});
                        }
                    });
                }
            });
        } else {
            res.status(500).send({message: 'Ingrese todos los datos'});
        }  
    }
}

function listCategories(req, res){
        Category.find({}, (err, successful)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            } else if(successful){
                res.status(200).send({message: 'Estas son las categorías:', successful});
            } else {
                res.send({message: 'No se pudo listar las categorías'});
            }
        });
}

function editCategory(req, res){
    let categoryId = req.params.idC;
    let userId = req.params.idU;
    let params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos necesarios'});
    } else{
        Category.findOne({nameCategory: params.nameCategory}, (err, successful)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                } else if(successful){
                    res.status(500).send({message: 'No puede guardar una categoría repetida'});
                } else{
                    Category.findByIdAndUpdate(categoryId, params, {new: true}, (err, updateCategory)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        } else if(updateCategory){
                            res.status(500).send({message: 'Operación exitosa', updateCategory});
                        } else{
                            res.status(404).send({message: 'Intente de nuevo'})
                        }
                    });
                }
        });
    }
}

function deleteCategory(req, res){
    let categoryId = req.params.idC;
    let userId = req.params.idU;
    let params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
            Products.update({nameCategory: params.nameCategory}, {nameCategory: 'default'}, {multi: true}, (err, finded)=>{
                if(err){
                    res.send({message: 'error general'});
                } else if(finded){
                    Category.findByIdAndRemove(categoryId, (err, deleteCategory)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        } else if(deleteCategory){
                            res.status(200).send({message: 'Operacion exitosa', deleteCategory});
                        } else{
                            res.status(500).send({message: 'intente más tarde'});
                        }
                    });
                } else{
                    res.send({message: 'no se pudo eliminar'});
                }
            });      
    }
}

module.exports = {
    saveCategory,
    listCategories,
    editCategory,
    deleteCategory
}