import React, { useEffect, useState } from 'react';
import '../scss/TodoTemplate.scss';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';

const TodoTemplate = () => {
  // 백엔드 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 한다.

  // 기본 요청 url을 전역변수로 선언
  const API_BASE_URL = 'http://localhost:8181/api/todos';
  const [todos, setTodos] = useState([]);

  // id값 시퀀스 함수 (DB 연동시키면 필요없게 됨.)
  /*
  const makeNewId = () => {
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1; // 맨 마지막 할 일 객체의 id보다 하나 크게
  };
  */

  /*
  TodoInput 에게 todoText 를 받아오는 함수
  자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는
  일반적인 props 사용이 불가능하다

  부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달
  자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달
  */

  const addTodo = (todoText) => {
    const newTodo = {
      title: todoText,
      // done: false, done의 값은 주어도 되고, 안주어도 된다.
      // 이미 자바에 done의 값을 false로 설정
    };

    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else {
          // status 코드에 따라 에러 처리를 다르게 진행하면 된다.
          console.log('error occured!');
        }
      })
      .then((data) => {
        console.log(data);
        setTodos(data.todos);
      });

    // ---------------------------------------------------------------------
    // const newTodo = {
    //   id: makeNewId(),
    //   title: todoText,
    //   done: false,
    // }; // 나중에는 fetch를 이용해서 백엔드에 insert 요청을 보내야 한다.

    // todos.push(newTodo); -> 리액트에서 상태변화를 감지하기 못하기 때문에 변한 값을 렌더링하지 못함
    // useState 변수는 setter로 변경해야 한다.

    // setTodos(newTodo); --> setTodos는 배열, newTodo는 객체 그래서 에러가 생김

    // react의 상태변수는 불변성(immutable)을 가지기 때문에
    // 기존 상태에서 변경은 불가능하다 새로운 상태로 만들어서 변경해야 한다.
    // 1. setTodos([...todos, newTodo]);

    // 2. 스냅샵 방식
    // setTodos((oldTodos) => {
    //   return [...oldTodos, newTodo];
    // });
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    /*
    const removedTodos = todos.filter(
      (todo) => todo.id !== id,
    );
    setTodos(removedTodos);
    */
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id) => {
    /*---------1. 반복문으로 처리
    const copyTodos = [...todos];

    for (let cTodo of copyTodos) {
      if (cTodo.id === id) {
        cTodo.done = !cTodo.done;
      }
    }

    setTodos(copyTodos);
    ---------------------------*/
    /*---------2. 배열 고차함수로 처리

    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, done: !todo.done }
          : todo,
      ),
    );

    // ------------------------------------ */

    // 내가 직접 작성한 것
    const copyTodos = [...todos];
    copyTodos.map((cTodo) => {
      if (cTodo.id === id) {
        cTodo.done = !cTodo.done;
      }
      return setTodos([...copyTodos]);
    });

    // todos.map((todo)=> todo.id === id) {
    // if (todos.filter((todo) => todo.id === id)) {
    //   return setTodos(todos.filter((todo) => !todo.done));
    // }
  };

  /*
  const count = 0;
  // 체크가 안된 task 세기
  const countRestTodo = (todos) => {
    const copyTodos2 = todos.filter(
      (todo) => todo.done === false,
    );

    count = copyTodos2.length;
    return count;
  };

  console.log(count);

  */

  /* 체크가 안 된 할 일의 개수를 카운트 하기
  1. 
  const countRestTodo = () => {
    const filteredTodos = todos.filter(
      (todo) => !todo.done,
    );
  };
  */

  // 2.
  const countRestTodo = () =>
    todos.filter((todo) => !todo.done).length;

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠다.
    fetch(API_BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setTodos(data.todos); // fetch를 통해 받아온 데이터를 상태 변수에 할당
      });
  }, []);
  // console.log(todos);
  return (
    <div className='TodoTemplate'>
      <TodoHeader count={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
