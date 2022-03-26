// import { v4 as uuidv4 } from 'uuid';
// import { headers, successHandler, errorHandler, tryCatchHandler } from './common';
const  { v4: uuidv4 } = require('uuid');
const  { headers, successHandler, errorHandler, tryCatchHandler } = require ('./common');

const todos = [{id: uuidv4(), title:'今天要吃早餐'}];

function todoList (request, response) {
  let body = '';
  request.on('data', (chunk) => body+=chunk);
  const uuid = request.url.split('/').pop();
  const idx = todos.findIndex(item => item.id===uuid);
  
  if      (request.url === '/todos' && request.method === 'OPTIONS') {
    successHandler(response);
  }
  else if (request.url === '/todos' && request.method === 'GET') {
    successHandler(response, { data: todos });
  }
  else if (request.url === '/todos' && request.method === 'POST') {
    request.on('end', () => {
      const cond = () => {
        const result = JSON.parse(body);
        if (result.title) {
          todos.push({ id: uuidv4(), ...result });
          successHandler( response, { data: todos} );
        }
        else { errorHandler(response, 400, { message: 'title 必要' }) }
      };
      tryCatchHandler(response, cond);
    });
  }
  else if (request.url === '/todos' && request.method === 'DELETE') { // 全刪
    todos.length = 0;
    successHandler(response, { data: todos });
  }
  else if (request.url.startsWith('/todos/') && request.method === 'PATCH') {
    request.on('end', () => {
      const result = JSON.parse(body);
      if(result.title){
        if (idx!==-1) {
          todos[idx] = {...result, id:uuid};
          successHandler(response, { data: todos });
        }
        else { errorHandler(response, 400, { message: '查無此項' }) }
      }
      else { errorHandler(response, 400, { message: 'title 必要' }) }
    });
  }
  else if(request.url.startsWith('/todos/') && request.method === 'DELETE'){ // 刪單筆
    if(idx !== -1) {
      todos.splice(idx,1);
      successHandler(response, { data: todos });
    }
    else { errorHandler(response, 400, { message: '查無此項' }) }
  }
  else {
    errorHandler(response, 404, { message: '查無此頁' })
  }
}

module.exports = {todoList};