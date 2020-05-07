const express = require('express');
const menuRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemsRouter = require('./menuItemsRouter');

menuRouter.param('menuId',(req,res,next,menuId)=>{
    const sql=`SELECT * FROM Menu WHERE id=${menuId}`;
    db.get(sql,(err,menu)=>{
        if(err){
            next(err);
        }else if(menu){
            next();
        }else{
            res.sendStatus(404);
        }
    })
});
menuRouter.use('/:menuId/menu-items',menuItemsRouter);

menuRouter.get('/',(req,res,next)=>{
    const sql = 'SELECT * FROM Menu';
    db.all(sql,(err,menus)=>{
        if(err){
            next(err);
        }else{
            res.status(200).send({menus:menus});
        }
    })
});

menuRouter.post('/',(req,res,next)=>{
    const title = req.body.menu.title;
    if(!title){
        res.sendStatus(400);
    }else{
        const sql='INSERT INTO Menu (title) VALUES($title)';
        const data = {$title:title};
        db.run(sql,data,function (err) {
            if(err){
                next(err);
            }else{
                db.get(`SELECT * FROM Menu WHERE id=${this.lastID}`,(err,menu)=>{
                    res.status(201).send({menu:menu});
                })
            }
        })
    }
});
menuRouter.get('/:menuId',(req,res,next)=>{
   const sql = `SELECT * FROM Menu WHERE id = ${req.params.menuId}`;
   db.get(sql,(err,menu)=>{
       if(err){
           next(err);
       }else{
           res.status(200).send({menu:menu});
       }
   })
});

menuRouter.put('/:menuId',(req,res,next)=>{
    const title = req.body.menu.title;
    if(!title){
        res.sendStatus(400);
    }else{
        const sql = 'UPDATE Menu SET title=$title WHERE id=$menuId';
        const data = {$title:title,$menuId:req.params.menuId};
        db.run(sql,data,function (err) {
            if(err){
                next(err);
            }else{
                db.get(`SELECT * FROM Menu WHERE id=${req.params.menuId}`,(err,menu)=>{
                    if(err){
                        next(err);
                    }else{
                        res.status(200).send({menu:menu});
                    }
                })
            }
        })
    }
});

menuRouter.delete('/:menuId',(req,res,next)=>{
    const sql = `SELECT * FROM MenuItem WHERE menu_id=${req.params.menuId}`;
    db.get(sql,(err,menuItems)=>{
        if(err){
            next(err);
        }else if(menuItems) {
            res.sendStatus(400);
        }else{
            db.run(`DELETE FROM Menu WHERE id=${req.params.menuId}`,(err)=>{
                if(err){
                    next(err);
                }else{
                    res.sendStatus(204);
                }
            })
        }

    })
});

module.exports = menuRouter;