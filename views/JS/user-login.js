function l1()
{
    console.log("li clicked success")
    $.ajax({
        url:"http://localhost:7000/immigration-canada/home-user",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/immigration-canada/user-login"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/immigration-canada/home-user'
            }
        }

    })
}
function LogoutUser()
{
    $.ajax({
        url:"http://localhost:7000/remove-token",
        type:"GET",
        datatype:"json",
        success:function(response)
        {
            console.log(response)
        }
    })
    window.location.href="/immigration-canada/user-login"
}