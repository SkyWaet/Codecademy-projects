const express = require('express');
const employeeRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const timesheetsRouter = require('./timesheetsRouter');

employeeRouter.param('employeeId',(req,res,next,employeeId)=>{
   const sql = 'SELECT * FROM Employee WHERE id=$id';
   const data = {$id:employeeId};
   db.get(sql,data,(err,employee)=>{
       if(err){
           next(err);
       }else if(employee){
           next();
       }else{
           res.sendStatus(404);
       }

   })
});
employeeRouter.use('/:employeeId/timesheets',timesheetsRouter);

employeeRouter.get('/',(req,res,next)=>{
    const sql = 'SELECT * FROM Employee WHERE is_current_employee=1';
    db.all(sql,(err,employees)=>{
        if(err){
            next(err);
        }
        else{
            res.status(200).send({employees:employees});
        }
    })
});

employeeRouter.post('/',(req,res,next)=>{
    const name =req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
    if(!name||!position||!wage){
        res.sendStatus(400);
    }else{
        const sql = 'INSERT INTO Employee (name,position,wage,is_current_employee) VALUES ($name,$position ,$wage,$isEmployee)';
        const data = {$name: name, $position: position, $wage: wage, $isEmployee: isEmployee};
        db.run(sql,data,function(err,row){
            if(err){
                next(err);
            }
            else{
                db.get(`SELECT * FROM Employee WHERE id=${this.lastID}`,(err,employee)=>{
                    if(err){
                        next(err);
                    }
                    else{
                        res.status(201).send({employee: employee});
                    }
                })
            }
        })
    }
});1

employeeRouter.get('/:employeeId',(req,res,next)=>{
    const sql = 'SELECT * FROM Employee WHERE id=$id';
    const data = {$id: req.params.employeeId};
    db.get(sql,data,(err,employee)=>{
        if(err){
            next(err);
        }else{
            res.status(200).send({employee: employee});
        }
    })
});

employeeRouter.put('/:employeeId',(req,res,next)=>{
    const name =req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isEmployee = req.body.employee.isCurrentEmployee ===0?0:1;
    if(!name||!position||!wage){
        res.sendStatus(400);
    }else{
        const sql='UPDATE Employee SET name=$name, position=$position, wage=$wage, is_current_employee=$isEmployee WHERE id=$id';
        const data={$id: req.params.employeeId, $name:name,$position: position, $wage:wage,$isEmployee: isEmployee};
        db.run(sql,data,function (err) {
            if(err){
                next(err);
            }else{
                db.get(`SELECT * FROM Employee WHERE id=${req.params.employeeId}`,(err,employee)=>{
                    if(err){
                        next(err);
                    }else{
                        res.status(200).json({employee:employee});
                    }
                })
            }
        })
    }
});

employeeRouter.delete('/:employeeId',(req,res,next)=>{
   const sql = 'UPDATE Employee SET is_current_employee=0 WHERE id=$id';
   const data = {$id:req.params.employeeId};
   db.run(sql,data,(err)=>{
       if(err){
           next(err);
       }else{
           db.get(`SELECT * FROM Employee WHERE id=${req.params.employeeId}`,(err,employee)=>{
               if(err){
                   next(err);
               }else{
                   res.status(200).send({employee});
               }
           });
       }
   })
});

module.exports = employeeRouter;