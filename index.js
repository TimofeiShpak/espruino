const http = require("http");
const fs = require("fs");
  
http.createServer(function(request, response){
      
    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша
    const filePath = request.url.substr(1);
    fs.readFile(filePath, function(error, data){
              
        if(error){
                  
            response.statusCode = 404;
            response.end("Resourse not found!");
        }   
        else{
          handlePOST(request)
            response.end(data);
        }
    });
}).listen(3000, function(){
    console.log("Server started at 3000");
});

function handlePOST(req) {
  var data = "";
  req.on('data', function(d) { data += d; console.log(data) });
  req.on('end', function() {
    postData = {};
    data.split("&").forEach(function(el) {
      var els = el.split("=");
      postData[els[0]] = decodeURIComponent(els[1]);
    });
    // console.log('code-1', postData.code);
    // eval(postData.code)
  });
}