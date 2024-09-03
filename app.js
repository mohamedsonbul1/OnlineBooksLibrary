var express = require('express');
var path = require('path');
var app = express();
var fs =require('fs');
var session = require('express-session');
const { title } = require('process');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.get('/',function(req,res){
  res.render('login',{Login:"WELCOME"});
});

app.post('/',function(req,res){
  var user={username:req.body.username,password:req.body.password};
  var readData=fs.readFileSync('users.json');
  var arrayData=JSON.parse(readData);
  var i;
  var Flag=false;
  req.session.user=req.body.username + req.body.password;
  for(i=0;i<arrayData.length;i++){
    if(arrayData[i].username==user.username && arrayData[i].password==user.password){
       Flag=true;
    }
  }
  if(Flag){
    if(req.session.user!=null){
    res.render('home');
    console.log(req.session.user);
    }
  }else{
    res.render('login',{Login:"Please use a valid account"});
    console.log(Flag);
  }
  console.log(arrayData);
});


app.get('/registration',function(req,res){
  res.render('registration',{Registration:"Registration"});
});

app.post('/register',function(req,res){
  var user={username:req.body.username,password:req.body.password,list:[]};
  var readData=fs.readFileSync('users.json');
  var arrayData=JSON.parse(readData);
  var i;
  var Flag=false;
  req.session.user=req.body.username + req.body.password;
  for(i=0;i<arrayData.length;i++){
    if(arrayData[i].username==user.username && arrayData[i].password==user.password){
       Flag=true;
    }
  }
  if(Flag){
    console.log(Flag);
    res.render('registration',{Registration:"Sorry this account already exists please try again"});
  }else{
    arrayData.push(user);
    var stringUser=JSON.stringify(arrayData);
    fs.writeFileSync("users.json",stringUser);
    if(req.session.user!=null){
      res.render('home');
      console.log(req.session.user);
      }
  }
  console.log(user);
});

app.get("/home",function(req,res){
  res.render('home');

});

app.get("/novel",function(req,res){
  res.render('novel');
});
app.get("/poetry",function(req,res){
  res.render('poetry');
});
app.get("/fiction",function(req,res){
  res.render('fiction');
});
app.get("/flies",function(req,res){
  res.render('flies',{Error:null});
});
app.get("/grapes",function(req,res){
  res.render('grapes',{Error:null});
});
app.get("/leaves",function(req,res){
  res.render('leaves',{Error:null});
});
app.get("/sun",function(req,res){
  res.render('sun',{Error:null});
});
app.get("/dune",function(req,res){
  res.render('dune',{Error:null});
});
app.get("/mockingbird",function(req,res){
  res.render('mockingbird',{Error:null});
});
app.get("/readlist",function(req,res){
  var sessUser=req.session.user;
  var list=[];
  var readData=fs.readFileSync('users.json');
  var arrayData=JSON.parse(readData);
  var i;
  for(i=0;i<arrayData.length;i++){
    if(arrayData[i].username+arrayData[i].password==sessUser){
       var j;
       for(j=0;j<arrayData[i].list.length;j++){
        list.push(arrayData[i].list[j]); 
       }
      }
    }
  res.render('readlist',{list:list});

});
app.post("/search",function(req,res){
  var i;
  var results=[];
  var readData=fs.readFileSync('books.json');
  var books=JSON.parse(readData);
  for(i=0;i<books.length;i++){
    if(books[i].name.toLowerCase().includes(req.body.Search.toLowerCase())){
      results.push(books[i]);  
    }
   
  };
  res.render('searchresults',{results:results});
});


app.get("/searchresults",function(req,res){
  res.render('searchresults',{results:results});
});



app.post("/flies/list",function(req,res){
  var Flag=WList(req.session.user,"/flies/list");
  if(Flag){
    res.render('flies',{Error:"This Book is Already in the List"});
  }
  else
    res.redirect('/home');
});

app.post("/dune/list",function(req,res){
  var Flag=WList(req.session.user,"/dune/list");
  if(Flag){
    res.render('dune',{Error:"This Book is Already in the List"});
  }
  else
    res.redirect('/home');
});

app.post("/grapes/list",function(req,res){
  var Flag=WList(req.session.user,"/grapes/list");
  if(Flag){
    res.render('grapes',{Error:"This Book is Already in the List"});
  }
  else
    res.redirect('/home');

});

app.post("/leaves/list",function(req,res){
  var Flag=WList(req.session.user,"/leaves/list");
  if(Flag){
    res.render('leaves',{Error:"This Book is Already in the List"});
  }
  else
    res.redirect('/home');
});
app.post("/sun/list",function(req,res){
  var Flag=WList(req.session.user,"/sun/list");
  if(Flag){
    res.render('sun',{Error:"This Book is Already in the List"});
  }
  else
    res.redirect('/home');
});
app.post("/mockingbird/list",function(req,res){
  var Flag=WList(req.session.user,"/mockingbird/list");
  if(Flag){
    res.render('mockingbird',{Error:"This Book is Already in the List"});
  }
  else
    res.redirect('/home');
});

function WList(sessUser,link){
  var bookName;
  switch(link) {
      case "/flies/list":     
        bookName='Lord of the Flies';
        break;
      case "/grapes/list":
        bookName = "The Grapes of Wrath";
        break;
      case "/leaves/list":
        bookName = "Leaves of Grass";
        break;
      case "/sun/list":
        bookName = "The Sun and Her Flowers";
        break;
      case "/dune/list":
        bookName='Dune';
        break;
      case "/mockingbird/list":
        bookName='To Kill a Mockingbird';
        break;
      default:
        bookName=Null;
  }
  var Flag=false;
  var readData=fs.readFileSync('users.json');
  var arrayData=JSON.parse(readData);
  var i;
  for(i=0;i<arrayData.length;i++){
    if(arrayData[i].username+arrayData[i].password==sessUser){
       var j;
       for(j=0;j<arrayData[i].list.length;j++){
        console.log(arrayData[i].list[j]); 
        if(arrayData[i].list[j]==bookName){
          console.log("IN");
           Flag=true;
         }
         
       }
    
    if(Flag){
      console.log("tre");
      return true;
    }
      else{
       arrayData[i].list.push(bookName);
      var stringUser=JSON.stringify(arrayData);
       fs.writeFileSync("users.json",stringUser);
       console.log(arrayData[i]);
       return false;
       }
  }
}
};




if(process.env.PORT,function(){console.log("SERVER started")})
{
}else{
  app.listen(3000,function(){ console.log("Server Started on Port 3000")});
}



