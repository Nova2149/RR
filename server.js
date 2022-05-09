const express=require('express')
const fs=require('fs')
const path=require('path')
const mysql=require('mysql2')
const { Console } = require('console')
const { fileURLToPath } = require('url')
const upload=require('express-fileupload')
const jwt=require('jsonwebtoken')


const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true,parameterLimit:100000,limit:"500mb"}))
//The below line is use to upload 
app.use(upload())
//Temp code to resolve payload too large
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
//#################################################
//Sandrakotos ila krotos attack
//zedline
//###################################################
app.use(express.static(path.join(__dirname,'views')))
//Sandrakotos Il a Krotos attack Daraius
/*api for loading the html pages */
//Starts Here
app.get("/immigration-canada/application",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/user_application.html'))
})
app.get("/immigration-canada/processingTime",authenticate_admin,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'views/html/processingtime-admin.html'))
})
app.get("/immigration-canada/help-section",authenticate_admin,(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/helpsection-admin.html'))
})
app.get("/immigration-canada/news-section",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/newssection-admin.html'))
})
app.get("/immigration-canada/users",authenticate_admin,(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/users-admin.html'))
})
app.get("/immigration-canada/applications-admin",authenticate_admin,(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/application-admin.html'))
})
app.get("/immigration-canada/application-detail-admin",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/application-detail-admin.html'))
})
app.get("/immigration-canada/submit-webform",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/user_webform.html'))
})
app.get("/immigration-canada/webforms",authenticate_admin,(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/webform-admin.html'))
})
app.get("/immigration-canada/webform-detail-admin",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/webform-detail-admin.html'))
})
app.get("/immigration-canada/admin-login",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/admin-login.html'))
})
app.get("/immigration-canada/news-home-admin",authenticate_admin,(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/news-home-admin.html'))
})
app.get("/immigration-canada/news-edit-admin",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/edit-news-admin.html'))
})
//To load loginned user home page
app.get("/immigration-canada/home-user",authenticateToken,(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/homepage-login-user.html'))
})
app.get("/immigration-canada/account-profile",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/account_profile.html'))
})
app.get("/immigration-canada/home",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/homepage-user.html'))
})
app.get("/immigration-canada/processing-time-user",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/processingtime-user.html'))
})
app.get("/immigration-canada/current",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/currentnews-user.html'))
})
app.get("/immigration-canada/search",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/search_news.html'))
})
app.get("/immigration-canada/user-login",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/myapplication.html'))
})
app.get("/immigration-canada/forgot-password",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/forgot-password.html'))
})

app.get("/immigration-canada/help-section-user",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/helpsection-user.html'))
})
app.get("/immigration-canada/current-help-user",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/currenthelp-user.html'))
})
//Ends Here
console.log(path.join(__dirname,'views'))

//Connection to the database.
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'host',
    database:'ic419',
    multipleStatements:true
})

app.listen(7000,()=>
{
    console.log("The Server is running on port 7000");

})

//Post Request to register a new user to the ic_register table in the database

app.post("/immigration-canada/register",(req,res)=>
{
    let data=req.body
    console.log(data)

    connection.query(`select user_email from ic_register where user_email=?`,[data.user_email],(err,result)=>
    {
        if(err) throw err
        if(result==""||result==null)
        {
            let sql=`insert into ic_register(user_family_name,user_given_name,user_phone,user_email,user_password,user_status,user_security1,user_security2,user_security3)
            values(?,?,?,?,?,true,?,?,?)`
            connection.query(sql,[
                data.user_family_name,
                data.user_given_name,
                data.user_phone,
                data.user_email,
                data.user_password,
                data.user_security1,
                data.user_security2,
                data.user_security3
            ],(err,result)=>
            {
                if (err) throw err;
                console.log("Number of Records Inserted "+result.affectedRows)
            })
            res.send({
                "counter":0
            })
        }
        else{
           // console.log(result)
            console.log("User already exists")
            res.send({
                "counter":1
            })
        }
    })
})

//Get Request to get the list of all users

app.get("/immigration-canada/get-all-users",(req,res)=>
{
    let sql=`select * from ic_register where user_id>1`
    connection.query(sql,(err,result)=>
    {
        if (err) throw err;
        console.log(result)
        res.send(result)
    })
})
//Post Request for Sign In
app.post("/immigration-canada/login",(req,res)=>
{
    let data=req.body
    console.log(data)

    let sql=`select * from ic_register where user_email=? and user_password=?`
    connection.query(sql,[data.user_email,data.user_password],(err,result)=>
    {
        if (err) throw err;
        if(result==""||result==null)
        {
            console.log("Login Unsuccessfull")
            res.send({

                "count":1
            })
        }
        else{
            console.log("Login Successfull")
            let user_id=result[0].user_id
            console.log(user_id)
            fs.writeFileSync("JSON/user_id.json",JSON.stringify({"user_id":user_id}))
            res.send({
                "count":0
            })
        }
    })
})

//Post Request to create a Token
//This will write the toke in two files  one is called as token.json and one is called as SignInToken.json
let refreshToken=[]
app.post("/immigration-canada/create-token",(req,res)=>
{
        let user_email=req.body.user_email
        console.log(user_email)
        const user={"user_email":user_email}

        const accessToken=jwt.sign(user,"Mayank")
      


        fs.writeFileSync('JSON/token.json',JSON.stringify({"Authorization":"Bearer "+accessToken}))
        fs.writeFileSync('JSON/SignInToken.json',JSON.stringify({"Authorization":"Bearer "+accessToken}))
        res.send({
                "access_token":accessToken
        })
})


//middleware
//for the user side .In order for Account Security
function authenticateToken(req,res,next)
{       
        console.log(refreshToken)
        let mydata=fs.readFileSync('JSON/token.json')
        let data=JSON.parse(mydata)
        console.log(data)
        const authHeader=data.Authorization
        const token=authHeader && authHeader.split(" ")[1]
        console.log(token)

        let mySignInToken=fs.readFileSync("JSON/SignInToken.json")
        let SignIndata=JSON.parse(mySignInToken)
        console.log(SignIndata)
        const SignInAuthHeader=SignIndata.Authorization
        const SignInToken=SignInAuthHeader && SignInAuthHeader.split(" ")[1]
        console.log(SignInToken)


        if(token==null)
        {
                return res.sendStatus(401)
        }
        else if(token!=SignInToken)
        {
                return res.send(401)
        }
        else{
               jwt.verify(token,"Mayank",(err,user)=>
               {
                       if(err) return res.sendStatus(403)
                       req.user=user
                       next()

               })
        }

        //Working on the Middleware
}
//Get To Request to Remove the token this will be basically called on logout 
app.get("/remove-token",(req,res)=>
{
        const accessToken=jwt.sign(
                "sasenaidpaagolEmpirejuna","Mayank"
        )
        fs.writeFileSync('JSON/token.json',JSON.stringify({"Authorization":"Bearer "+accessToken}))
        res.send({
                "access_token":accessToken        })
})
//Get Request to get the Current User Id
app.get("/immigration-canada/user_id",(req,res)=>
{
    let appData=fs.readFileSync('JSON/user_id.json')
    let data=JSON.parse(appData)
    console.log(data)
    res.send(data)

})
//Post Request to update the Applicant Info
app.post("/immigration-canada/update-applicant-info",(req,res)=>
{
    let data=req.body
    console.log(data)
    //Get the Current User Id

    let appData=fs.readFileSync('JSON/user_id.json')
    let my_data=JSON.parse(appData)
    let u_id=my_data.user_id


    let sql=`update ic_register set user_email=?,user_phone=? where user_id=?`
    connection.query(sql,[data.user_email,data.user_password,u_id],(err,result)=>
    {
        if(err) throw err;
        console.log(result)

    })
    
})

//Api for saving the application to the database
//This api will save the details to the database
app.post("/immigration-canada/submit-application",(req,res)=>
{
    console.log("Inside Application")
    let data=req.body
    console.log(data)
   
    //Read the User Id as of now
    let appData=fs.readFileSync('JSON/user_id.json')
    let my_data=JSON.parse(appData)
    let u_id=my_data.user_id


    let sql="select * from ic_application where file_name=?"
   connection.query(sql,[data.file_name],(err,result)=>
    {
        if(err) throw err;
        if(result==""||result==null)
        {
            let sql1=`insert into ic_application(user_id,application_type,ques1,ques2,ques3,date_of_birth,file_name,application_status,medical_status,background_status)
            values(?,?,?,?,?,?,?,?,?,?)`;
            connection.query(sql1,[u_id,
            data.application_type,
            data.ques1,
            data.ques2,
            data.ques3,
            data.date_of_birth,
            data.file_name,"submitted","submitted","submitted"],(er1,rs1)=>
            {
                if(er1) throw er1;
                console.log(rs1)
                console.log("New Application Submitted Successfully")
               
                
            })
            res.send({"count":0})

        }
        else{
            //File Name is already in use ,choose a different File Name
            console.log("File Name is already in use,Choose a different File Name")
            
            res.send({"count":1})
        }
    })

})

app.post("/immigration-canada/upload-doc",(req,res)=>
{   
    console.log("Inside Upload doc")
   console.log(req.files)

   const file=req.files.file;
   const fileName=file.name
   console.log(fileName)

   //Move the File to the uploads folder
    file.mv('./uploads/'+fileName,(err)=>
    {
        if(err)
        {
            res.send(err)
        }
        else{
            res.send("File Uploaded successfully")
        }
    })
})
//Submit Webform
app.post("/immigration-canada/submit-webform",(req,res)=>
{
    let data=req.body
    console.log(data)

     //Read the User Id as of now
     let appData=fs.readFileSync('JSON/user_id.json')
     let my_data=JSON.parse(appData)
     let u_id=my_data.user_id
     let sql_initial=`select * from ic_register where user_email=?`
     connection.query(sql_initial,[data.email],(error,result)=>
     {
         if(error) throw error;
         if(result==""||result==null)
         {
             res.send({
                 "count":1
             })
         }
         else{
            let sql=`select * from ic_application where application_number=?`
            connection.query(sql,[data.application_number],(error,result)=>
            {
                if(error) throw error;
                if(result==null||result=="")
                {
                    console.log("Wrong Application Number ,This Application doesn't exists")
                    res.send({
                        "count":1
                    })
                }
                else{
                    let sql1=`insert into ic_webform(user_id,webform_type,
                        webform_message,
                        email,date_of_birth,application_number,mobile) values(?,?,?,?,?,?,?)`
        
                    connection.query(sql1,[u_id,
                        data.webform_type,
                        data.webform_message,
                        data.email,
                        data.date_of_birth,
                    data.application_number,
                    data.mobile],(error1,result1)=>
                    {
                        if(error1) throw error1;
                        console.log("Webform Submitted Successfully")
                        console.log(result1)
                        res.send({
                            "count":0
                        })
                    })
                }
            })
         }

     })

    
})


//Rough api for s3 with aws
//Read the News.json So We are having a get Request for that
app.get("/immigration-canada/getnews",(req,res)=>
{
    let appData=fs.readFileSync('JSON/news.json')
    let my_data=JSON.parse(appData)
    console.log(my_data)
    res.send(my_data)
})

//Processing Time
//To get the Processing Time
app.get("/immigration-canada/processing-time",(req,res)=>
{
    let appData=fs.readFileSync("JSON/processing_time.json")
    let data=JSON.parse(appData)
    console.log(data)
    res.send(data)
})

app.post("/immigration-canada/processing-time",(req,res)=>
{
    let data=req.body
    console.log(data)

    fs.writeFileSync('JSON/processing_time.json',JSON.stringify(data))
    res.send({
        message:'The processing time  has been updated'
    })


})
//To write help to the help.section file
app.post("/immigration-canada/add-help",(req,res)=>
{
    let data=req.body
    console.log(data)
    //Read from the JSON File
    let appData=fs.readFileSync("JSON/help.json")
    let user_data=JSON.parse(appData)
    var myArray=[]
    for(let i=0;i<user_data.length;i++)
    {
        myArray.push(user_data[i])
    }
    myArray.push(data)
    //Write to the help.json file
    fs.writeFileSync("JSON/help.json",JSON.stringify(myArray))
    res.send({
        "msg":"Help Added"
    })
})
//Post Request for Blocking and Unblocking a user
app.post("/immigration-canada/block-user",(req,res)=>
{
    let data=req.body
    console.log(data)

    let u_email=data.user_email
    let sql='select * from ic_register where user_email=?';
    connection.query(sql,[u_email],(er,rs)=>
    {       
            if(er) throw er;
            console.log(rs)
            console.log(rs[0].user_status)
            //1 is considered true whereas the 0 is considered as false
            
            if(rs[0].user_status==1)
            {
                    //User is unblocked and we have to block it
                    sql=`update ic_register set user_status=false where user_email=?`;
                    connection.query(sql,[u_email],(er1,rs1)=>
                    {       
                            if(er1) throw er1;
                            console.log(rs1);


                    })
            }
            else{
                    //User is bloacked and we have to unblock it
                    sql=`update ic_register set user_status=true where user_email=?`;
                    connection.query(sql,[u_email],(er2,rs2)=>
                    {       
                            if(er2) throw er2;

                            console.log(rs2);

                    })
            }
            res.sendStatus(200)
           
    })

})
//Post Request to remove an IRCC Registered User
app.post("/immigration-canada/removeuser",(req,res)=>
{
    let data=req.body
    console.log(data)
    let u_email=data.user_email

    let sql=`delete  from ic_register where user_email=?`
    connection.query(sql,[u_email],(error,result)=>
    {
        if(error) throw error
        console.log(result)

    })
res.send({
    "message":"user deleted successfully"
    
})
})

//Get Request to get all the applications from the database
app.get("/immigration-canada/get-all-applications",(req,res)=>
{
    let sql=`select * from ic_application`;
    connection.query(sql,(error,result)=>
    {
        if (error) throw error;
        console.log(result)
        res.send(result)
    })
})
//Get Detail about a particular application
app.post("/immigration-canada/get-application",(req,res)=>
{
    let data=req.body
    let user_application_number=data.application_number

    let sql=`select * from ic_application where application_number=?`
    connection.query(sql,[user_application_number],(error,result)=>
    {
        if (error) throw error;
        console.log(result)
        if(result==""||result==null)
        {
            console.log("This is avery hard scenario to happen")
        }
        else
        {
           // console.log(result)
           //Write the details to the JSON application
           fs.writeFileSync('JSON/current_application.json',JSON.stringify(result))
           res.send(result)

        }
    })
})
//Read the content from the JSON File
app.get("/immigration-canada/get-application",(req,res)=>
{
    let appData=fs.readFileSync("JSON/current_application.json")
    let data=JSON.parse(appData)
    console.log(data)
    res.send(data)

})
//Post Request to Update the Application Status
app.post("/immigration-canada/update-application-status",(req,res)=>
{
    let data=req.body
    let application_status=data.application_status
    let medical_status=data.medical_status
    let background_status=data.background_status
    let application_number=data.application_number
    let sql=`update ic_application set application_status=?,medical_status=?,background_status=? where 
    application_number=?`;
    connection.query(sql,[application_status,medical_status,background_status,application_number],(error,result)=>
    {
        if(error) throw error;
        console.log(result)
        res.send({
            "message":"Application Status updated"
        })
    })
})

//Get Request to get all the applications
app.get("/immigration-canada/get-all-webforms",(req,res)=>
{
    let sql=`select * from ic_webform`
    connection.query(sql,(error,result)=>
    {
        if(error) throw error;
        console.log(result)
        res.send(result)

    })
})

//Post Request to view a particular WebForm
app.post("/immigration-canada/get-webform",(req,res)=>
{   
    let data=req.body
    console.log(data)
    let webform_id=data.webform_id
    console.log(webform_id)

    let sql=`select * from ic_webform where webform_id=?`;
    connection.query(sql,[webform_id],(error,result)=>
    {
        if(error) throw error;
        console.log(result)

        //Write the contents to a JSON File
        fs.writeFileSync('JSON/current_webform.json',JSON.stringify(result))
        res.send(result)
    })
})
app.get("/immigration-canada/get-webform",(req,res)=>
{
    let appData=fs.readFileSync('JSON/current_webform.json')
    let data=JSON.parse(appData)
    console.log(data)
    res.send(data)
})
//Post Request for Admin Login
app.post("/immigration-canada/admin-login",(req,res)=>
{
    let data=req.body
    console.log(data)
    let sql=`select * from ic_register where  user_id=1 and user_email=? and user_password=?`;

    connection.query(sql,[data.user_email,data.user_password],(error,result)=>
    {
        if(error) throw error
        console.log(result)
        if(result==""||result==null)
        {
            console.log("Admin Login Unsuccessfull")
            res.send({"count":0})
        }
        else{
            console.log("Login successfull")
            
            fs.writeFileSync("JSON/admin_status.json",JSON.stringify({"status":"on"}))
            res.send({"count":1})
        }
    })

})

function authenticate_admin(req,res,next)
{
    let appData=fs.readFileSync("JSON/admin_status.json")
    let my_data=JSON.parse(appData)
    console.log(my_data)
    if(my_data.status=="on")
    {
        
        next()

    }
    else if(my_data.status=="off"){
        res.sendStatus(401)

    }
    else{
        res.sendStatus(401)
       
    }
   

}

app.get("/immigration-canada/admin-logout",(req,res)=>
{
    fs.writeFileSync("JSON/admin_status.json",JSON.stringify({
        "status":"off"
    }))
})
//Edit Current News Post Request

app.post("/immigration-canada/current-news",(req,res)=>
{
    let news_heading=req.body.news_heading
    console.log(news_heading)

    var my_array=[]
    let appData=fs.readFileSync("JSON/news.json")
    let data=JSON.parse(appData)
 

    for(let i=0;i<data.length;i++)
    {
        if(data[i].news_heading === news_heading)
        {
            my_array.push(data[i])
        }
    }
    fs.writeFileSync('JSON/current_news.json',JSON.stringify(my_array))
    res.send(my_array)
})

app.get("/immigration-canada/current-news",(req,res)=>
{
    let appData=fs.readFileSync("JSON/current_news.json")
    let data=JSON.parse(appData)
    console.log(data)
    res.send(data)
})
//update News
app.post("/immigration-canada/update-news",(req,res)=>
{   
    let news_heading=req.body.news_heading
    let news_description=req.body.news_description
    console.log(news_heading)
    console.log(news_description)

    let appData=fs.readFileSync("JSON/news.json")
    let data=JSON.parse(appData)
    console.log(data)
    
  


    for(let i=0;i<data.length;i++)
    {
        if(data[i].news_heading === news_heading)
        {
            data[i].news_description=news_description
        }
    }
    fs.writeFileSync("JSON/news.json",JSON.stringify(data))
    res.send({
        messgae:"News updated"
    })
})

//-----------------------------------------------Changes begin from here
app.get("/immigration-canada/get-user-name",(req,res)=>
{
    let appData=fs.readFileSync("JSON/user_id.json")
    let data=JSON.parse(appData)
    let u_id=data.user_id
    console.log(u_id)
 
    let sql=`select user_given_name from ic_register where user_id=?`
    connection.query(sql,u_id,(error,result)=>
    {
       if(error) throw error;
       console.log(result)
       res.send(result)  
    })

})

//---
//Get Request to get all the applications of a particular user
app.get("/immigration-canada/get-user-applications",(req,res)=>
{
    let appData=fs.readFileSync("JSON/user_id.json")
    let data=JSON.parse(appData)
    let u_id=data.user_id
    console.log(u_id)

    let sql=`select * from ic_application where user_id=?`
    connection.query(sql,u_id,(error,result)=>
    {
        if(error) throw error;
        console.log(result)
        res.send(result)
    })
})
//---
//Get Request for getting the account info
app.get("/immigration-canada/get-account-info",(req,res)=>
{
    let appData=fs.readFileSync("JSON/user_id.json")
    let data=JSON.parse(appData)
    let u_id=data.user_id
    console.log(u_id)

    let sql=`select * from ic_register where user_id=?`
    connection.query(sql,u_id,(error,result)=>
    {
        if(error) throw error
        console.log(result)
        res.send(result)
    })
})
//Post Request to Update the Account Info 

app.post("/immigration-canada/update-account-info",(req,res)=>
{
    let appData=fs.readFileSync("JSON/user_id.json")
    let data=JSON.parse(appData)
    let u_id=data.user_id
    console.log(u_id)

    let user_email=req.body.user_email
    let user_phone=req.body.user_phone
    console.log(user_email)
    console.log(user_phone)


    let sql=`update ic_register set user_email=?,user_phone=? where user_id=?;`
    connection.query(sql,[user_email,user_phone,u_id],(error,result)=>
    {
        if(error) throw error;
        console.log(result)
        res.send({
            "message":"Account Info Updated"
        })
    })
})
//------------------
app.post("/immigration-canada/get-processing-time",(req,res)=>
{
    let current_application=req.body.application_type
    console.log(current_application)

    let appData=fs.readFileSync("JSON/processing_time.json")
    let data=JSON.parse(appData)
    
    console.log(data[current_application])
   res.send({
       "processing_time":data[current_application]
   })
})
//Get Request to write the data to current-user-news

app.post("/immigration-canada/current-user-news",(req,res)=>
{
    let news_heading=req.body.news_heading
    console.log(news_heading)

    let appData=fs.readFileSync('JSON/news.json')
    let data=JSON.parse(appData)
    for(let i=0;i<data.length;i++)
    {
        if(data[i].news_heading==news_heading)
        {
            fs.writeFileSync('JSON/current_user_news.json',JSON.stringify(data[i]))
            res.send(data[i])
        }
    }
    
})
app.get("/immigration-canada/current-user-news",(req,res)=>
{
    let appData=fs.readFileSync('JSON/current_user_news.json')
    let data=JSON.parse(appData)
    console.log(data)
    console.log(data['news_heading'])
    res.send(data)

})
//Search News Utility
app.post("/immigration-canada/search-news",(req,res)=>
{
    let search_text=req.body.text
    console.log(search_text)
    // final_search_text=search_text.toLowerCase()
    // console.log(final_search_text)


    let heading_array=[]
    let appData=fs.readFileSync("JSON/news.json")
    let data=JSON.parse(appData)
    data.forEach((item)=>
    {
       
        heading_array.push(item.news_heading)
    })
    //convert array items to lower case
    // const lower_heading_array=heading_array.map(element=>{
    //     return element.toLowerCase();

    // })

  // console.log(lower_heading_array)

    let final_array=[]
   
    heading_array.forEach((item)=>
    {   
        let t1=item.toLowerCase()
        let t2=search_text.toLowerCase()
        if(t1.includes(t2))
        {
            final_array.push(item)
        }
    })

    console.log(final_array)

    // search_array=[]
    // let appData=fs.readFileSync("JSON/news.json")
    // let data=JSON.parse(appData)
  
    // if((data[i].news_heading.toLowerCase())includes(search_text))
    // {

  res.send(final_array)
})

//Texting api
app.post("/rough",(req,res)=>
{   
    search_text=req.body.text
    final_array=[]
    let a=['Mayank Tagra','Janak Patel','Simranjit Kaur','Pargol Poshtaeh']
    a.forEach((item)=>
    {
        if(item.includes(search_text)){
            final_array.push(item)
        }
    })
    res.send(final_array)
})
//post request
app.post("/immigration-canada/search-entered-news",(req,res)=>
{
    let search_text=req.body.search_text
    console.log(search_text)

  fs.writeFileSync('JSON/search.json',JSON.stringify({
      "search_text":search_text
  }))
  res.send({


    "search_text":search_text
  })

})
//get request
app.get("/immigration-canada/search-entered-news",(req,res)=>
{
    let appData=fs.readFileSync('JSON/search.json')
    let data=JSON.parse(appData)
    console.log(data)
    res.send(data)

})
//Post Request to check if you can update password
app.post("/immigration-canada/check-reset-password",(req,res)=>
{
    let ques=req.body.user_ques
    let ans=req.body.user_ans
    let user_email=req.body.user_email
    console.log(ques)
    console.log(ans)
    console.log(user_email)

    let sql1=`select * from ic_register where user_security1=? and user_email=?`
    let sql2=`select * from ic_register where user_security2=? and user_email=?`
    let sql3=`select * from ic_register where user_security3=? and user_email=?`

    if(ques==="ques1")
    {
        connection.query(sql1,[ans,user_email],(error,result)=>
        {
            if(error) throw error
            console.log(result)
            res.send(result)
        })
    }
    else if(ques==="ques2")
    {
        connection.query(sql2,[ans,user_email],(error,result)=>
        {
            if(error) throw error
            console.log(result)
            res.send(result)
        })
    }
    else
    {
        connection.query(sql3,[ans,user_email],(error,result)=>
        {
            if(error) throw error
            console.log(result)
            res.send(result)
        })
    }
})
app.post("/immigration-canada/write-reset-password",(req,res)=>
{
    let user_email=req.body.user_email
    console.log(user_email)
    fs.writeFileSync('JSON/forgotpassword.json',JSON.stringify({
        "user_email":user_email
    }))
    res.send({
        "message":"done"
    })
})
//Post Request to Reset Password
app.post("/immigration-canada/set-reset-password",(req,res)=>
{
    let password=req.body.user_password
    console.log(password)
    let appData=fs.readFileSync('JSON/forgotpassword.json')
    let data=JSON.parse(appData)
    let user_email=data['user_email']
    console.log(user_email)
    let sql=`update ic_register set user_password=? where user_email=?`

    connection.query(sql,[password,user_email],(error,result)=>
    {
        if(error) throw error;
        console.log(result)
    })
    res.send({
        "status":"updated"
    })

})
//Post Request for Search Help
app.post("/immigration-canada/search-help",(req,res)=>
{
    let text=req.body.text
    console.log(text)

    let heading_array=[]

    let appData=fs.readFileSync("JSON/help.json")
    let data=JSON.parse(appData)
    //Here we have extracted all the data 
    data.forEach((item)=>
    {
        heading_array.push(item.help_heading)
    })
    console.log(heading_array)
    let final_array=[]
    heading_array.forEach((item)=>
    {
        let t1=item.toLowerCase()
        console.log(t1)

        let t2=text.toLowerCase()
        console.log(t2)
        if(t1.includes(t2))
        {
            final_array.push(item)
        }
   })
    console.log(final_array)
    res.send(final_array)
})

//Post Request for CurrentHelp
//To write the data to the current_help.json file
app.post("/immigration-canada/current-help",(req,res)=>
{
    let help_heading=req.body.help_heading
    console.log(help_heading)

    var my_array=[]

    let appData=fs.readFileSync("JSON/help.json")
    let data=JSON.parse(appData)

    for(let i=0;i<data.length;i++)
    {
        if(data[i].help_heading === help_heading)
        {
            my_array.push(data[i])
        }
    }
    fs.writeFileSync('JSON/current_help.json',JSON.stringify(my_array))
    res.send(my_array)
})

    //To read the data from the current_help.json file
app.get("/immigration-canada/current-help",(req,res)=>
{
    let appData=fs.readFileSync("JSON/current_help.json")
    let data=JSON.parse(appData)
    console.log(data)

    res.send(data)

})    
//
app.post("/immigration-canada/add-new-news",(req,res)=>
{
    let news_heading=req.body.news_heading
    let news_description=req.body.news_description
    console.log(news_heading)
    console.log(news_description)

    let appData=fs.readFileSync('JSON/news.json')
    let data=JSON.parse(appData)

    data.push({
        "news_heading":news_heading,
        "news_description":news_description
    })
    //Write again to the JSON File
    fs.writeFileSync('JSON/news.json',JSON.stringify(data))
    res.send({
        "msg":"news  inserted"
    })
})
//-------------------------
app.post("/immigration-canada/check-password",(req,res)=>
{
    let old_password=req.body.old_password
    console.log(old_password)

    let appData=fs.readFileSync('JSON/user_id.json')
    let data=JSON.parse(appData)
    let u_id=data.user_id
    console.log(u_id)

    let sql=`select * from ic_register where user_password=? and user_id=?`
    connection.query(sql,[old_password,u_id],(error,result)=>
    {
        if(error) throw error;
        console.log(result)
        res.send(result)
    })
})

//post request to set new password
app.post("/immigration-canada/set-new-password",(req,res)=>
{
    let appData=fs.readFileSync('JSON/user_id.json')
    let data=JSON.parse(appData)
    let u_id=data.user_id
    console.log(u_id)

    let new_password=req.body.new_password
    console.log(new_password)

    let sql=`update ic_register set user_password=? where user_id=?`
    connection.query(sql,[new_password,u_id],(error,result)=>
    {
        if(error) throw error
        console.log(result)
    })

    res.send({
        "msg":"Password Updated"
    })

})