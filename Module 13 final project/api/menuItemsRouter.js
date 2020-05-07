const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId',(req,res,next,menuItemId)=>{
   const sql=`SELECT * FROM MenuItem WHERE id=${menuItemId}`;
   db.get(sql,(err,menuItem)=>{
       if(err){
           next(err);
       }else if(menuItem){
           next();
       }else{
           res.sendStatus(404);
       }
   })
});

menuItemsRouter.get('/',(req,res,next)=>{
   const sql='SELECT * FROM MenuItem WHERE menu_id=$menuId';
   const data={$menuId: req.params.menuId};
   db.all(sql,data,(err,items)=>{
       if(err){
           next(err);
       }else{
           res.status(200).send({menuItems:items});
       }
   })
});

menuItemsRouter.post('/',(req,res,next)=>{
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.params.menuId;
    if(!name||!inventory||!price){
        res.sendStatus(400);
    }else{
        const sql='INSERT INTO MenuItem (name,description,inventory,price,menu_id) VALUES ($name,$description,$inventory,$price,$menuId)';
        const data={$name:name,$description:description,$inventory:inventory,$price:price,$menuId: menuId};
        db.run(sql,data,function (err) {
            if(err){
                next(err);
            }else{
                db.get(`SELECT * FROM MenuItem WHERE id=${this.lastID}`,(err,menuItem)=>{
                    if(err){
                        next(err);
                    }else{
                        res.status(201).send({menuItem:menuItem});
                    }
                })
            }

        })
    }
});

menuItemsRouter.put('/:menuItemId',(req,res,next)=>{
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.params.menuId;
    const menuItemId=req.params.menuItemId;
    if(!name||!inventory||!price){
        res.sendStatus(400);

    }else{
        const sql='UPDATE MenuItem SET name=$name,description=$description,inventory=$inventory,price=$price,menu_id=$menuId WHERE id=$menuItemId';
        const data={$name:name,$description: description,$inventory: inventory,$price:price,$menuId:menuId,$menuItemId:menuItemId};
        db.run(sql,data,function (err) {
            if(err){
                next(err);}

                else{
                    db.get(`SELECT * FROM MenuItem WHERE id=${menuItemId}`,(err,menuItem)=>{
                        if(err){
                            next(err);
                        }else{
                            res.status(200).send({menuItem:menuItem});
                        }
                    })
                }

        })
    }
});

menuItemsRouter.delete('/:menuItemId',(req,res,next)=>{
    const sql = 'DELETE FROM MenuItem WHERE id = $menuItemId';
    const data={$menuItemId: req.params.menuItemId};
    db.run(sql,data,(err)=>{
        if(err){
            next(err);
        }else{
            res.sendStatus(204);
        }
    })
});

module.exports = menuItemsRouter;