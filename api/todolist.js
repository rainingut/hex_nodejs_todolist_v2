const { v4: uuidv4 } = request('uuid');
const  { sendNEnd, contentWrap, tryCatchWrap } =  request('./common');

const todos = [{id:uuidv4(), title: '今天要做什麼'}];

function todoList(request, response) {
  let body = '';
  request.on('data', chunk => body += chunk);
  let options = { request, response, statusCode:200};
  const uuid = request.url.split('/').pop();
  const idx = todos.findIndex(item => item.id === uuid);
  if(request.url === '/todos'){  // 絕對等於
    switch (request.method) {
      case 'OPTIONS': sendNEnd(options);
        break;
      case 'GET':  contentWrap(options,todos);
        break;
      case 'POST': 
        request.on('end',() => {
          tryCatchWrap(options, ()=>{
            const res = JSON.parse(body);
            if(res.title) {
              todos.push({...res, id: uuidv4()})
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
  else if(request.url.startsWith('/todos/')){ // 曖昧符合
    switch (request.method) {
      case 'PATCH': 
        request.on('end',() => {
          tryCatchWrap(options, ()=>{
            const res = JSON.parse(body);
            if(idx !== -1){
              todos[idx] = {...res, id: uuid};
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