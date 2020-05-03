const express = require('express');
const sqlite3= require('sqlite3');
const seriesRouter = express.Router();
const issuesRouter = require('./issues');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');
seriesRouter.use('/:seriesId/issues',issuesRouter);

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
    const sql = 'SELECT * FROM Series WHERE id = $seriesId';
    const values = {$seriesId: seriesId};
    db.get(sql, values, (error, series) => {
        if(error){
            next(error);
        }
        else if(series){
            req.series=series;
            next();
        }
        else{
            return res.sendStatus(404);
        }
    });
});

seriesRouter.get('/',(req,res,next)=>{
    db.all('SELECT * FROM Series',(err,rows)=>{
         if(err){
             next(err);
         }  else{
             res.status(200).send({series:rows});
         }
       })

});
seriesRouter.get('/:seriesId',(req,res,next)=>{
    res.status(200).json({series:req.series});
});

seriesRouter.post('/',(req,res,next)=>{
    const name = req.body.series.name;
    const description = req.body.series.description;
    if(!name||!description){
        return res.sendStatus(400);
    }
    else{
        const sql = 'INSERT INTO Series(name,description) VALUES($name,$description)';
        const data = {$name:name,$description: description};
        db.run(sql,data,function(err){
            if(err){
                next(err);
            }else{
                db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`,
                    (error, series) => {
                        res.status(201).json({series: series});
                    });
            }
        })
    };
});

seriesRouter.put('/:seriesId',(req,res,next)=>{
    const name = req.body.series.name;
    const description = req.body.series.description;
    const seriesId=req.params.seriesId;
    if(!name||!description){
        return res.sendStatus(400);
    }else{
        const sql='UPDATE Series SET name=$name, description=$description WHERE id=$id';
        const data={$name:name,$description: description,$id:seriesId};
        db.run(sql,data,function(err){
            if(err){
                next(err);
            }
            else{
                db.get(`SELECT * FROM Series WHERE id = ${seriesId}`,
                    (error, series) => {
                        res.status(200).json({series: series});
                    });
            }
        });
    }
})
seriesRouter.delete('/:seriesId',(req,res,next)=>{
    const sql = `SELECT * FROM Issue WHERE series_id =${req.params.seriesId}`;
    db.get(sql,(err,issue)=>{
        if(err){
            next(err);
        }else if(issue){
            res.sendStatus(400);
        }else{
            db.run(`DELETE FROM Series WHERE id=${req.params.seriesId}`,(err)=>{
                if(err){
                    next(err);
                }
                else{
                    res.sendStatus(204);
                }
            })
        }
    })
})
module.exports = seriesRouter;