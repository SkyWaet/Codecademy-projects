const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.param('timesheetId',(req,res,next,timesheetId)=>{
    const sql = 'SELECT * FROM Timesheet WHERE id=$id';
    const data={$id:timesheetId};
    db.get(sql,data,(err,timesheet)=>{
        if(err){
            next(err);
        }else if(timesheet){
            next();
        }else{
            res.sendStatus(404);
        }
    })
});

timesheetsRouter.get('/',(req,res,next)=>{
    const sql = 'SELECT * FROM Timesheet WHERE employee_id=$id';
    const data = {$id:req.params.employeeId};
    db.all(sql,data,(err,timesheets)=>{
        if(err){
            next(err);
        }else{
            res.status(200).send({timesheets:timesheets});
        }
    })
});

timesheetsRouter.post('/',(req,res,next)=>{
   const hours = req.body.timesheet.hours;
   const rate = req.body.timesheet.rate;
   const date = req.body.timesheet.date;
   const employeeId=req.params.employeeId;
   if(!hours||!rate||!date){
       res.sendStatus(400);
   }else{
       const sql = 'INSERT INTO Timesheet (hours,rate,date,employee_id) VALUES ($hours,$rate,$date,$employee_id)';
   const data={$hours:hours, $rate:rate,$date:date ,$employee_id:employeeId};
   db.run(sql,data,function (err) {
        if(err){
            next(err);
        }else{
            db.get(`SELECT * FROM Timesheet WHERE id=${this.lastID}`,(err,timeSheet)=>{
                if(err){
                    next(err);
                }else{
                    res.status(201).send({timesheet:timeSheet});
                }
            })
        }
   })
   }
});
timesheetsRouter.put('/:timesheetId',(req,res,next)=>{
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;
    if(!hours||!rate||!date||!employeeId){
        res.sendStatus(400);
    }else{
        const sql = 'UPDATE Timesheet SET hours=$hours, rate=$rate,date=$date,employee_id=$employeeId WHERE id=$timesheetId';
        const data={$hours:hours,$rate:rate,$date:date,$employeeId: employeeId,$timesheetId: req.params.timesheetId};
        db.run(sql,data,function (err) {
            if(err){
                next(err);
            }else{
                db.get(`SELECT * FROM Timesheet WHERE id=${req.params.timesheetId}`,(err,timesheet)=>{
                    if(err){
                        next(err);
                    }else{
                        res.status(200).send({timesheet:timesheet});
                    }
                })
            }
        })
    }
});

timesheetsRouter.delete('/:timesheetId',(req,res,next)=>{
    const sql = 'DELETE FROM Timesheet WHERE id=$id';
    const data={$id: req.params.timesheetId};
    db.run(sql,data,(err)=>{
        if(err){
            next(err);
        }else{
            res.sendStatus(204);
        }
    })
});


module.exports = timesheetsRouter;
