import React from 'react';
import '../scss/TodoInput.scss';
import { MdAdd } from 'react-icons/md';

const TodoInput = () => {
  return (
    <>
      <div className='form-wrapper'>
        <form className='insert-from'>
          <input
            type='text'
            placeholder='할 일을 입력 후, 엔터를 누르세요!'
          />
          <button className='insert-btn'>
            <MdAdd />
          </button>
        </form>
      </div>
    </>
  );
};

export default TodoInput;
