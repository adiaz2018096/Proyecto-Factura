'use strict'

var User = require('../models/user.models');
var Products = require('../models/products.models');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res){
    let user = new User();
    let params = req.body;

    if(params.name && params.address && params.email && params.password){
        User.findOne({$or: [{name: params.name}, {email: params.email}]}, (err, successful)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            } else if(successful){
                res.status(500).send({message: 'Usuario existentes'});
            } else{
                user.name = params.name;
                user.address = params.address;
                user.phone = params.phone;
                user.email = params.email;
                user.role = params.role;
                
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al encriptar contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.save((err, saveUser)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'});
                            } else if(saveUser){
                                res.status(200).send({message: 'Usuario guardado', saveUser});
                            } else{
                                res.status(418).send({message: 'Intente mas tarde'});
                            }
                        });
                    }else{
                        res.status(418).send({message: 'Intente encriptar mas tarde'});
                    }
                });
            }
        });
    } else{
        res.status(500).send({message: 'Ingrese los datos mínimos'});
    }
}

function registerLogin(req, res){
    let params = req.body;
    
    if(params.election == 'login'){
            if(params.email && params.password){
                User.findOne({email: params.email}, (err, successful)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(successful){
                        bcrypt.compare(params.password, successful.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar contraseñas'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createToken(successful)});
                                }else{
                                    res.send({message: 'Bienvenido', user:successful});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta, intente de nuevo'});
                            }
                        });
                    } else{
                        res.send({message: 'El Email no existe, ingrese una correcto'});
                    }
                });
            } else{
                res.send({message: 'Ingrese los datos mínimos'});
            }
    } else if(params.election == 'register'){
            let user = new User();
            if(params.name && params.address && params.email && params.password){
                User.findOne({$or: [{name: params.name}, {email: params.email}]}, (err, successful)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    } else if(successful){
                        res.status(500).send({message: 'Usuario existente'});
                    } else{
                        user.name = params.name;
                        user.address = params.address;
                        user.phone = params.phone;
                        user.email = params.email;
                        user.role = 'USER';
                        
                        bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                            if(err){
                                res.status(500).send({message: 'Error al encriptar contraseña'});
                            }else if(passwordHash){
                                user.password = passwordHash;
                                user.save((err, saveUser)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general'});
                                    } else if(saveUser){
                                        res.status(200).send({message: 'Usuario guardado', saveUser});
                                    } else{
                                        res.status(418).send({message: 'Intente mas tarde'});
                                    }
                                });
                            }else{
                                res.status(418).send({message: 'Intente mas tarde'});
                            }
                        });
                    }
                });
            } else{
                res.status(500).send({message: 'Ingrese los datos mínimos'});
            }
    }
}

function findByName(req, res){
    let params = req.body;
 
    Products.find({name: {$regex: "^" + params.name, $options: "i"}}, {_id: 0, stock:0}, (err, findProduct)=>{
        if(err){
            res.status(500).send({message: 'Error General'});
        } else if(findProduct){
            if(findProduct.length == 0){
                res.status(200).send({message: 'No se puede efectuar la busquedad'})
            } else{
                res.status(200).send({message: 'Estas son las coincidencias: ', findProduct});
            }
        } else {
            res.status(404).send({message: 'Los productos existentes son: ', products});
        }
});
}

function findByCategory(req, res){
    let params = req.body;

    Products.find({nameCategory: {$regex: "^" + params.nameCategory, $options: "i"}}, (err, successful)=>{
            if(err){
                res.status(500).send({message: 'Error General'});
            } else if(successful){
                if(successful.length == 0){
                    res.status(200).send({message: 'No hay coincidencias'})
                } else{
                    res.status(200).send({message: 'Las coincidencias son: ', successful});
                }
            } else {
                res.status(404).send({message: 'Los productos existentes son: ', products});
            }
    });
}

function editUsers(req, res){
    let userId = req.params.idU;
    let userUpdateId = req.params.idP;
    let params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        User.findOne({_id: userUpdateId}, (err, findUser)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            } else if(findUser){
                if(findUser.role == 'USER'){
                    User.findOne({name: params.name}, (err, findUser)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al hacer la Busquedad'});
                        } else if(findUser){
                            res.status(500).send({message: 'Usuario ya existente'});
                        } else{
                            if(req.user.role == 'ADMIN'){
                                var roleByUser = params.role;
                            } else if(req.user.role == 'USER'){
                                var roleByUser = 'USER';
                            }
                            User.findByIdAndUpdate(userUpdateId, {name: params.name, address: params.address, phone: params.phone, role: roleByUser}, 
                                {new: true}, (err, updateUser)=>{
                                if(err){
                                    res.status(500).send({message: 'Error al actualizar'});
                                } else if(updateUser){
                                    res.status(200).send({message: 'El usuario fue actualizado', updateUser})
                                } else{
                                    res.status(500).send({message: 'Error al actualizar'});
                                }
                            });
                        }
                    });
                } else{
                    User.findByIdAndUpdate(userUpdateId, {role: params.role}, {new:true}, (err, updateUser)=>{
                        if(err){
                            res.status(500).send({message: 'Error General'});
                        } else if(updateUser){
                            res.status(200).send({message: 'Usuario actualizado correctamente', updateUser});
                        } else{
                            res.status(500).send({message: 'Error al actualizar'});
                        }
                    });
                }
            } else{
                res.status(500).send({message: 'No se encuentra el usuario en la base de datos'});
            }
        });
    }
}

function listUsers(req, res){
    User.find({}, (err, users)=>{
        if(err){
            res.status(500).send({message: 'Error al enlistar la informacion'});
        } else if(users){
            res.status(500).send({message: users});
        } else{
            res.status(500).send({message: 'No se pudo listar, intente de nuevo'});
        }
    });
}


function deleteUsers(req, res){
    let userId = req.params.idU;
    let userDeleteId = req.params.idD;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos'});
    } else{
        User.findOne({_id: userDeleteId}, (err, findUserAndAdmin)=>{
            if(err){
                res.status(500).send({message: 'Error  al listar usuarios'});
            } else if(findUserAndAdmin){
                if((userId == userDeleteId) || (req.user.role == 'ADMIN' && findUserAndAdmin.role == 'USER')){
                    User.findByIdAndRemove(userDeleteId, (err, successful)=>{
                        if(err){
                            res.status(500).send({message: 'Error General'});
                        } else if(successful){
                            res.status(500).send({message: 'Usuario eliminado correctamente'});
                        } else{
                            res.status(500).send({message: 'Error al eliminar la informacion'});
                        }
                    });
                } else{
                    res.status(500).send({message: 'No se puede eliminar el ADMIN'});
                }
            } else{
                res.status(500).send({message: 'Error en la busquedad, intente de nuevo'});
            }

        });
    }
}

module.exports = {
    saveUser,
    registerLogin,
    findByName,
    findByCategory,
    editUsers,
    listUsers,
    deleteUsers
}