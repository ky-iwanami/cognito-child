import { http, HttpResponse } from 'msw';

// モックデータ
const mockTodos = [
  {
    id: '1',
    content: 'MSWモックTodo 1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    content: 'MSWモックTodo 2',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    content: 'MSWモックTodo 3',
    createdAt: new Date().toISOString()
  }
];

export const handlers = [
  // GET /todos エンドポイントのモック
  http.get('*/todos', () => {
    return HttpResponse.json({
      todos: mockTodos
    }, {
      status: 200,
    });
  }),

  // その他必要なエンドポイントがあれば追加
]; 