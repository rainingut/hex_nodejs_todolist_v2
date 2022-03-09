const headers = {
  'Access-Control-Allow-Headers':'Content-Type, Content-Length, Authorization, X-Required-With',
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type':'application/json',
};

/* 參數格式
  options = {
    request
    response
    statusCode
    [content] optional
  }
*/


// 成功 || 失敗 送資料
function sendNEnd (options) {
  console.log(options.statusCode, options.request.url, options.content)
  const isSuccess = options.statusCode===200;
  options.response.writeHead(options.statusCode || 400, headers);
  if(options.content) {
    options.response.write(JSON.stringify({
      status: isSuccess ? 'success' : 'failure',
      [isSuccess?'data':'message']: options.content,
    }));
  }
  options.response.end();
}


// 使用 sendNEnd  ( 因為要一直寫三行，所以包起來-- )
function contentWrap (options, content=null, statusCode=200) {
  options.statusCode = statusCode;
  options.content = content;
  sendNEnd(options);
}


// try catch 專用 😂「codition」是一個函式
function tryCatchWrap(options, condition) {
  try {  condition(); } 
  catch{ contentWrap(options,'格式錯誤', 400); }
}



module.exports = {
  headers,
  sendNEnd,
  contentWrap,
  tryCatchWrap,
}