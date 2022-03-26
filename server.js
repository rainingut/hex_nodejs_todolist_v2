const http = require( 'http');
const  { errorHandler } = require ('./api/common');
const  { todoList } = require ('./api/todolist');

const requireListener = ( request, response ) => {
  if (request.url.startsWith('/todos')) {
    todoList(request, response);
  }
  else {
    errorHandler(response, 404, { message: '查無此頁🐇' });
  }
}

const server = http.createServer(requireListener);
server.listen(process.env.PORT || 3005);