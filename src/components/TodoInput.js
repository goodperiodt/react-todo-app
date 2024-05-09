import React, { useState } from 'react';
import '../scss/TodoInput.scss';
import { MdAdd } from 'react-icons/md';
import cn from 'classnames';

const TodoInput = () => {
  const [open, setOpen] = useState(false);

  // 더하기 버튼 클릭시 이벤트
  const onToggle = () => {
    // setOpen(true);
    setOpen(!open);
  };

  return (
    <>
      {open && (
        <div className='form-wrapper'>
          <form className='insert-form'>
            <input
              type='text'
              placeholder='할 일을 입력 후, 엔터를 누르세요!'
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
        // 빽틱으로 처리하는 방법도 작성해볼 것!!

        onClick={onToggle}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
