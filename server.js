const http = require('http');
const { todoList } = require('./api/todolist');
const { sendNEnd } = require('./api/common');

const requireListener = (require, response) => {
  if (require.url.startsWith('/todos')) {
    todoList(require, response);
  }
  else {
    const options = {
      require, response,
      statusCode: 404,
      content: '查無此頁'
    };
    sendNEnd(options);
  }
}

const server = http.createServer(requireListener);
server.listen(process.env.PORT || 3005);