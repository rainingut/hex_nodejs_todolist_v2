const headers = {
  'Access-Control-Allow-Headers':'Content-Type, Content-Length, Authorization, X-Required-With',
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type':'application/json',
};


function successHandler (response, data=null) {
  response.writeHead(200, headers);
  if(data) { response.write(JSON.stringify({
    status: 'success',
    ...data
  })) }
  response.end();
}


function errorHandler(response, statusCode, data=null){
  response.writeHead(statusCode, headers);
  if(data) { response.write(JSON.stringify({
    status: 'failed',
    ...data
  })) }
  response.end();
}


function tryCatchHandler(response, cond, message=null) {
  try {
    cond();
  }
  catch(error){
    response.writeHead(400, headers)
   response.write(JSON.stringify({
     staus: 'failed',
     message: message || '格式錯誤',
   }));
   response.end(); 
  }
}


module.exports = {
  headers,
  successHandler,
  errorHandler,
  tryCatchHandler,
}