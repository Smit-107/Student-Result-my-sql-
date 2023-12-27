var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');


var app = express()
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}))

// database connection

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"student_result_demo"
});

con.connect();
// app.set('views', path.join(__dirname, 'views'));

app.get('/',function(req,res) {
    res.sendFile(__dirname+'/index.html');
})


app.get('/ejs',function(req,res) {
    var select_query = "select * from student_result"
    con.query(select_query,function(error,result,field){
        if(error)throw error;
        res.render('index',{result});
    })
})

app.post('/ejs',function(req,res){
    var name = req.body.name
    var english = req.body.english
    var maths = req.body.maths
    var account = req.body.account
    var economics = req.body.economics
    var logicalQuents = req.body.logicalQuents
    var total = parseInt(english) + parseInt(maths) + parseInt(account) + parseInt(economics) + parseInt(logicalQuents);
    var Parcentage = total/5
    var passFail = Parcentage >= 35 && english >= 35 && maths >= 35 && account >= 35 && economics >= 35  ? 'Pass' : 'Fail';

    var insert_query = "insert into student_result(Name,English,Maths,Account,Economics,LogicalQuents,Total,Parcentage,PassFail)values('" + name + "', '" + english + "', '" + maths + "', '" + account + "', '" + economics + "', '" + logicalQuents + "', '" + total + "', '" + Parcentage + "', '" + passFail + "')"
    con.query(insert_query,function(error,result,field){
        if(error)throw error;
        res.redirect('/ejs');
    })
})

app.get('/delete/:id',function(req,res) {
    var id = req.params.id;
    var delete_query = "delete from student_result where id="+id;
    con.query(delete_query,function(error,result,field){
        if(error)throw error;
        res.redirect('/ejs');
    })
})

app.get('/edit/:id', function (req, res) {
    var id = req.params.id;

    var select_query = "SELECT * FROM student_result WHERE id = " + id;
    
    con.query(select_query, function (error, result, fields) {
        if (error) throw error;

        res.render('edit_page', { result: result[0] });
    });
});

app.post('/update/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name
    var english = req.body.english
    var maths = req.body.maths
    var account = req.body.account
    var economics = req.body.economics
    var logicalQuents = req.body.logicalQuents
    var total = parseInt(english) + parseInt(maths) + parseInt(account) + parseInt(economics) + parseInt(logicalQuents);
    var Parcentage = total/5
    var passFail = Parcentage >= 35 && english >= 35 && maths >= 35 && account >= 35 && economics >= 35  ? 'Pass' : 'Fail';

    var edit_query = "UPDATE student_result SET Name = '"+ name +"', English = '"+ english +"', Maths = '"+ maths +"', Account = '"+ account +"',Economics = '"+ economics +"', LogicalQuents = '"+ logicalQuents +"',Total = '"+ total +"', Parcentage = '"+ Parcentage +"', PassFail = '"+ passFail +"' WHERE id=" + id;

    con.query(edit_query, function (error, result, fields) {
        if (error) throw error;
        res.redirect('/ejs');
    });
});

app.get('/ejs/pass',function(req,res) {
    var pass_query = "select * from student_result where PassFail = 'pass'";
    con.query(pass_query,function(error,result,field){
        if(error)throw error;
        res.render('index',{result});
    })
})

app.get('/ejs/fail',function(req,res) {
    var pass_query = "select * from student_result where PassFail = 'fail'";
    con.query(pass_query,function(error,result,field){
        if(error)throw error;
        res.render('index',{result});
    })
})

app.get('/ejs/top5',function(req,res) {
    var top5_query = "select * from student_result order by total desc limit 5";
    con.query(top5_query,function(error,result,field){
        if(error)throw error;
        res.render('index',{result});
    })
})

app.get('/ejs/top10',function(req,res) {
    var top10_query = "select * from student_result order by total desc limit 10";
    con.query(top10_query,function(error,result,field){
        if(error)throw error;
        // res.send(result);
        res.render('index',{result});
    })
})

app.listen(2003);