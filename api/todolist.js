const { v4: uuidv4 } = require('uuid');
const  { sendNEnd, contentWrap, tryCatchWrap } =  require('./common');

const todos = [{id:uuidv4(), title: '今天要做什麼'}];

function todoList(require, response) {
  let body = '';
  require.on('data', chunk => body += chunk);
  let options = { require, response, statusCode:200};
  const uuid = require.url.split('/').pop();
  const idx = todos.findIndex(item => item.id === uuid);
  if(require.url === '/todos'){  // 絕對等於
    switch (require.method) {
      case 'OPTIONS': sendNEnd(options);
        break;
      case 'GET':  contentWrap(options,todos);
        break;
      case 'POST': 
        require.on('end',() => {
          tryCatchWrap(options, ()=>{
            const result = JSON.parse(body);
            if(result.title) {
              todos.push({...result, id: uuidv4()})
              contentWrap(options,todos);
            }
            else {  contentWrap(options,'title必要', 400); }
          })
        });
        break;
      case 'DELETE': // 全刪
        todos.length = 0;
        contentWrap(options,todos);
        break;
      default:  contentWrap(options,'查無此頁',404);
        break;
    }
  }
  else if(require.url.startsWith('/todos/')){ // 曖昧符合
    switch (require.method) {
      case 'PATCH': 
        require.on('end',() => {
          tryCatchWrap(options, ()=>{
            const result = JSON.parse(body);
            if(idx !== -1){
              todos[idx] = {...result, id: uuid};
              contentWrap(options,todos);
            }
            else{  contentWrap(options,'查無此項',400); }
          })
        });
        break;
      case 'DELETE':  // 刪單筆
        if (idx !== -1) {
          todos.splice(idx,1);
          contentWrap(options,todos);
        }
        else { contentWrap(options,'查無此項',400); }
        break;
      default:  contentWrap(options,'查無此頁',404);
        break;
    }
  }
  else { contentWrap(options,'查無此頁',404); }
}

module.exports = {todoList};