const http = require('http');
const { todoList } = require('./api/todolist');
const { sendNEnd } = require('./api/common');

const requireListener = (request, response) => {
  if (request.url.startsWith('/todos')) {
    todoList(request, response);
  }
  else {
    const options = {
      request, response,
      statusCode: 404,
      content: '查無此頁'
    };
    sendNEnd(options);
  }
}

const server = http.createServer(requireListener);
server.listen(process.env.PORT || 3005);