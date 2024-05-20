import React from 'react';
import '../../scss/TodoHeader.scss';

const TodoHeader = ({ count }) => {
  // Thu May 09 2024 16:29:58 GMT+0900 (한국 표준시)
  const today = new Date();
  // console.log('today: ', today);
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long',
  });

  // console.log('dateString: ', dateString);

  return (
    <header>
      <h1>{dateString}</h1>
      <div className='day'>{dayName}</div>
      <div className='tasks-left'>
        할 일 {count()}개 남음
      </div>
    </header>
  );
};

export default TodoHeader;
