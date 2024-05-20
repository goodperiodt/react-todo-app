import React, { useState } from 'react';
import '../../scss/TodoInput.scss';
import { MdAdd } from 'react-icons/md';
import cn from 'classnames';

const TodoInput = ({ addTodo }) => {
  const [open, setOpen] = useState(false);

  // 할 일 입력창에 입력한 내용을 표현하는 상태값
  const [todoText, setTodoText] = useState('');

  // 더하기 버튼 클릭시 이벤트
  const onToggle = () => {
    // setOpen(true);
    setOpen(!open);
  };

  const todoChangeHandler = (e) => {
    setTodoText(e.target.value);
  };

  // submit 이벤트 핸들러
  const submitHandler = (e) => {
    e.preventDefault(); // 태그의 기본 기능 제한

    // 부모 컴포넌트가 전달한 함수의 매개값으로 입력 값 넘기기
    addTodo(todoText);

    // 입력이 끝나면 입력창 비우기
    setTodoText('');
  };

  return (
    <>
      {open && (
        <div className='form-wrapper'>
          <form
            // form 내부의 input 태그에서 엔터가 발생하면
            // submitHandler 작동
            className='insert-form'
            onSubmit={submitHandler}
          >
            <input
              type='text'
              placeholder='할 일을 입력 후, 엔터를 누르세요!'
              onChange={todoChangeHandler}
              value={todoText}
            />
          </form>
        </div>
      )}

      {/* cn() : 첫번째 파라미터는 항상 유지할 default 클래스
                 두번째 파라미터는 논리 상태값
                 => 논리 상태값이 true일 경우 해당 클래스 추가
                 false일 경우 제거.
                 {클래스이름: 논리값}, 
                 클래스 이름 지정 안할 시 변수명이 클래스 이름으로 사용됨.*/}
      <button
        // {클래스명: 논리값} 논리값을 담고 있는 open 변수의 상태(true or false)
        // 에 따라 클래스명 open 이 붙을지 말지가 결정된다.

        // className={cn('insert-btn', { open: open })}
        className={cn('insert-btn', { open })}
        // 빽틱으로 처리하는 방법
        // className={`insert-btn ${open ? 'open' : ''}`}

        onClick={onToggle}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
