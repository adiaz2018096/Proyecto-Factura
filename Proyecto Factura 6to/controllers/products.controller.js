'use Strict'

var Products = require('../models/products.models');
var Category = require('../models/cetegory.models');

function saveProducts(req, res){
    var products = new Products();
    let userId = req.params.id;
    let paramsB = req.body;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        if(paramsB.name && paramsB.price && paramsB.stock && paramsB.nameCategory){
            products.name = paramsB.name;
            products.products = paramsB.products;
            products.price = paramsB.price;
            products.stock = paramsB.stock;

            Category.findOne({nameCategory: paramsB.nameCategory}, (err, findCategory)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                } else if(findCategory){
                    products.nameCategory = paramsB.nameCategory;
                    products.save((err, saveProduct)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        } else if(saveProduct){
                            res.status(200).send({message: saveProduct});
                        } else{
                            res.status(500).send({message: 'intente de nuevo'});
                        }
                    });
                } else{
                    res.status(404).send({message: 'Ingrese una categoría correcta'});
                }
            });
        }else{
        res.status(200).send({message: 'Ingrese datos mínimos'})
        }
    }
}

function listProducts(req, res){
    let userId = req.params.id;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Products.find({}, (err, succefull)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            } else if(succefull){
                res.status(200).send({message: 'Los productos son: ', succefull});
            } else {
                res.status(404).send({message: 'Intente mas tarde'});
            }
        })
    }
}

function findByName(req, res){
    let params = req.body;
    let userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Products.find({name: {$regex: "^" + params.name, $options: "i"}}, (err, findProduct)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            } else if(findProduct){
                if(findProduct.length == 0){
                    res.status(200).send({message: 'No existen productos'});
                } else{
                    res.status(200).send({message: 'Operación exitosa:', findProduct});
                }
            } else {
                res.status(404).send({message: 'Operacion exitosa:', products});
            }
        });
    }
}


function editProduct(req, res){
    let productId = req.params.idP;
    let userId = req.params.idU;
    let params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Products.findById(productId, (err, findProduct)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            } else if(findProduct){
                Products.findOne({name: params.name}, (err, findProduct)=>{
                    if(err){
                        res.status(500).send({message: 'Error general', err});
                    } else if(findProduct){
                        res.status(200).send({message: 'No puede almacenar un producto existente'})
                    } else{
                        if(params.nameCategory){
                            Category.findOne({nameCategory: params.nameCategory}, (err, findCategory)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general', err});
                                } else if(findCategory){
                                    var categoria = params.nameCategory;
                                    Products.findByIdAndUpdate(productId, {name: params.name, price: params.price, nameCategory: categoria},
                                    {new: true}, (err, updateProduct)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general al actualizar el producto'});
                                        } else if(updateProduct){
                                            res.status(200).send({message: 'Los datos fueron actualizados exitosamente 1', updateProduct});
                                        } else{
                                            res.status(404).send({message: 'No se pudo actualizar el producto, intente mas tarde'});
                                        }
                                    });
                                } else{
                                    res.status(500).send({message: 'No se pudo encontrar un categoría'});
                                }
                            });
                        } else{
                            Products.findByIdAndUpdate(productId, params, {new: true}, (err, updateProduct)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al actualizar el producto'});
                                    } else if(updateProduct){
                                        res.status(200).send({message: 'Los datos fueron actualizados exitosamente 2', updateProduct});
                                    } else{
                                        res.status(404).send({message: 'No se pudo actualizar el producto, intente mas tarde'});
                                    }
                            });
                        }                    
                    }
                });
            } else{
                res.status(404).send({message: 'El producto que desea actualizar no existe en la base de datos'});
            }
        });
    }
}

function deleteProducts(req, res){
    let productId = req.params.idP;
    let userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Products.findById(productId, (err, findProduct)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar los productos'});
            } else if(findProduct){
                Products.findByIdAndRemove(productId, (err, deleteProduct)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al eliminar producto'});
                    } else if(deleteProduct){
                        res.status(200).send({message: 'El producto se eliminó correctamente'});
                    } else{
                        res.status(404).send({message: 'No se pudo eliminar el producto, intente mas tarde'});
                    }
                });
            } else{
                res.status(500).send({message: 'El producto no exite en la base de datos'});
            }
        });
    }
}

function editStock(req, res){
    let productId = req.params.idP;
    let userId = req.params.idU;
    let params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        Products.findById(productId, (err, findProduct)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el producto'});
            } else if(findProduct){
                let updateStock = parseInt(findProduct.stock) + parseInt(params.quantity);
                Products.findByIdAndUpdate(productId, {stock: updateStock}, {new:true}, (err, updateProduct)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al actualizar el producto'});
                    } else if(updateProduct){
                        res.status(200).send({message: 'El stock se actualizó correctamente', updateProduct});
                    } else{
                        res.status(500).send({message: 'No se ha podido actualizar el stock, intente de nuevo'});
                    }
                });
            } else{
                res.status(500).send({message: 'No existe el producto en la base de datos'});
            }
        });
    }
}

module.exports = {
    saveProducts,
    listProducts,
    editProduct,
    deleteProducts,
    findByName,
    editStock
};