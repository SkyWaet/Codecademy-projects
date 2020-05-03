const express = require ('express');
const sqlite3= require('sqlite3');
const issuesRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

issuesRouter.param('issueId',(req,res,next)=>{
    const sql = 'SELECT * FROM Issue WHERE id = $id';
    const data={$id:req.params.issueId};
    db.get(sql,data,function(err,issue){
        if(err){
            next(err);
        }
        else if(issue){
            next();
        }
        else{
            return res.sendStatus(404);
        }
    })
});

issuesRouter.get('/',(req,res,next)=>{
    const seriesId = req.params.seriesId;
    const data ={$seriesId:seriesId};
    db.all('SELECT * FROM Issue WHERE series_id=$seriesId',data,(err,issues)=>{
        if(err){
            next(err);
        }
        else{
            res.status(200).json({issues: issues});
        }
    });
});
issuesRouter.post('/',(req,res,next)=>{
    const name =req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const authorId = req.body.issue.artistId;
    if(!name||!issueNumber||!publicationDate||!authorId){
        return res.sendStatus(400);
    }
    else{
        const sql = 'INSERT INTO Issue (name,issue_number,publication_date,artist_id,series_id) VALUES ($name,$issueNumber,$publicationDate,$authorId,$seriesId)';
        const data = {$name: name,$issueNumber: issueNumber, $publicationDate: publicationDate, $authorId: authorId,$seriesId: req.params.seriesId};
        db.run(sql,data,function (err) {
            if(err){
                next(err);
            }
            else{
                db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`,function (err,issue) {
                    if(err){
                        next(err);
                    }
                    else{
                        res.status(201).json({issue: issue});
                    }
                })
            }
        })
    }
})
issuesRouter.put('/:issueId',(req,res,next)=>{
    const name =req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const authorId = req.body.issue.artistId;
    if(!name||!issueNumber||!publicationDate||!authorId){
        return res.sendStatus(400);
    }else{
        const sql = 'UPDATE Issue SET name=$name,issue_number=$issueNumber,publication_date=$publicationDate,artist_id=$authorId,series_id=$seriesId WHERE id=$issueId';
        const data = {$name:name,$issueNumber: issueNumber,$publicationDate: publicationDate,$authorId: authorId,$seriesId: req.params.seriesId,$issueId:req.params.issueId};
        db.get(sql,data,function (err,row) {
            if(err){
                next(err);
            }
            else{
                db.get(`SELECT * FROM Issue WHERE id=${req.params.issueId}`,(err,issue)=>{
                    res.status(200).json({issue:issue});
                })
            }
        })
    }
})
issuesRouter.delete('/:issueId',(req,res,next)=>{
    db.run(`DELETE FROM Issue WHERE id=${req.params.issueId}`,(err)=>{
        if(err){
            next(err);
        }else{
            res.sendStatus(204);
        }
    })
})
module.exports = issuesRouter;
