/* import {
  Link,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Container } from 'reactstrap';

const Join = () => {
  // 상태 변수로 회원가입 입력값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: '',
  });

  // 검증 메세지에 대한 상태변수 관리
  // 입력 값과 메세지는 따로 상태 관리 (메세지는 백엔드로 보내줄 필요 없다.)
  // 메세지 영역은 각 입력창마다 존재(이름, 이메일, 비밀번호)하기 때문에 객체 형태로 한번에 관리.
  const [message, setMessage] = useState({
    userName: '',
    password: '',
    passwordCheck: '',
    email: '',
  });

  // 검증 완료 체크에 대한 상태변수 관리
  // 각각의 입력창마다 유효성 검증 상태를 관리해야 하기 때문에 객체로 선언.
  // 상태를 유지하려는 이유 -> 스타일, 마지막에 회원가입 버튼 누를 때까지 검증 상태를 유지해야 하기 때문이다.
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false,
  });

  // 검증된 데이터를 각각의 상태변수에 저장해주는 함수
  const saveInpustState = ({
    key,
    inputValue,
    msg,
    flag,
  }) => {
    // 기존의 객체는 사용하되
    // 객체의 속성에 변화된 값을 적용한다.
    // 입력 값 세팅
    setUserValue((oldVal) => {
      return { oldVal, [key]: inputValue };
    });

    // 메세지 세팅
    setMessage((oldMsg) => {
      return {...oldMsg, [key]: msg}; // key 변수의 값을 프로퍼티 키로 활용하는 중
    });

    // 입력 값 검증 상태 세팅
    setCorrect((oldCorrect) => {
      {...oldCorrect, [key]: flag};
    });
  };

  // 변경이 발생할 때마다 nameHandler가 발생한다.
  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    const nameRegex = /^[가-힣]{2,5}$/; // 정규 표현식 준비
    const inputValue = e.target.value; // 사용자가 입력창에 입력한 값

    let msg; // 검증 메시지를 저장할 변수
    let flag; // 입력값 검증 여부를 체크할 변수

    if (!inputValue) {
      // 입력창에 변화를 감지했는데,
      // 입력창의 값이 비어있다면
      msg = '유저이름은 필수 입니다.';
    } else if (!nameRegex.test(inputValue)) {
      msg = '2~5글자 사이의 한글로 작성하세요!';
    } else {
      msg = '사용 가능한 이름입니다.';
      flag = true;
    }

    // saveInputState() 함수에게
    // 이 핸들러에서 처리한 여러가지 값을 객체로 한 번에 넘기기
    saveInpustState({
      key: 'userName',
      inputValue,
      msg,
      flag,
    });
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component='h1' variant='h5'>
              계정 생성
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete='fname'
              name='username'
              variant='outlined'
              required
              fullWidth
              id='username'
              label='유저 이름'
              autoFocus
              onChange={nameHandler}
            />
            <span = {
              correct.userName? {color:'green'} : {color:'red'}
            }></span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='이메일 주소'
              name='email'
              autoComplete='email'
            />
            <span></span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='패스워드'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <span></span>
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password-check'
              label='패스워드 확인'
              type='password'
              id='password-check'
              autoComplete='check-password'
            />
            <span></span>
          </Grid>

          <Grid item xs={12}>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              style={{ background: '#38d9a9' }}
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid container justify='flex-end'>
          <Grid item>
            <Link href='/login' variant='body2'>
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;
*/

import {
  Link,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useReducer } from 'react';
import {
  API_BASE_URL,
  USER,
} from '../../config/host-config';
import { initialState, joinReducer } from './joinReducer';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  // 리다이렉트 효과 사용하기
  const navigate = useNavigate();

  // useReducer를 사용해서 리듀서 함수 등록, state와 dispatch를 전달받음.
  const [state, dispatch] = useReducer(
    joinReducer,
    initialState,
  );

  // 상태 객체에서 각각의 상태 객체값을 분해 할당.
  const { userValue, message, correct } = state;

  // 각각의 핸들러에서 호출하는 dispatch 처리를 중앙화 하자.
  const updateState = (key, inputValue, msg, flag) => {
    key !== 'passwordCheck' &&
      dispatch({
        type: 'SET_USER_VALUE',
        key,
        value: inputValue,
      });
    dispatch({
      type: 'SET_MESSAGE',
      key,
      value: msg,
    });
    dispatch({
      type: 'SET_CORRECT',
      key,
      value: flag,
    });
  };

  // 각각의 핸들러에 붙어 있는 디바운스 함수를 일괄적 처리
  // useCallback: 함수의 메모이제이션을 위한 훅. (함수의 선언을 기억했다가 재사용하기 위한 훅)
  // 상태값 변경에 의해 화면의 재 렌더링이 발생할 때, 컴포넌트의 함수들도 재 선언이 됩니다.
  // useCallback으로 함수를 감싸 주시면 이전에 생성된 함수를 기억했다가 재 사용하도록 하기 때문에
  // 불필요한 함수 선언을 방지할 수 있습니다. (성능 최적화에 도움이 됩니다.)
  const debouncedUpdateState = useCallback(
    debounce((key, inputValue, msg, flag) => {
      console.log('debounce called! key: ', key);
      updateState(key, inputValue, msg, flag);
    }, 500),
    [],
  ); // 의존성 배열을 비워놓으면, 첫 렌더링 때 함수가 선언되고 다시는 재선언되지 않습니다.
  // 만약 함수의 선언이 특정 상태가 변할 때 재선언 되어야 한다면, 의존성 배열에 상태 변수를 선언하시면 됩니다.

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    console.log('nameHandler가 동작함!');
    const inputValue = e.target.value;
    const nameRegex = /^[가-힣]{2,5}$/;

    // 입력값 검증
    let msg; // 검증 메세지를 저장할 변수
    let flag = false; // 입력값 검증 여부 체크 변수

    if (!inputValue) {
      msg = '유저 이름은 필수입니다.';
    } else if (!nameRegex.test(inputValue)) {
      msg = '2~5글자 사이의 한글로 작성하세요!';
    } else {
      msg = '사용 가능한 이름입니다.';
      flag = true;
    }

    debouncedUpdateState('userName', inputValue, msg, flag);
  };

  // 이메일 중복 체크 서버 통신 함수
  const fetchDuplicateCheck = (email) => {
    let msg = '';
    let flag = false;

    fetch(`${API_BASE_URL}${USER}/check?email=${email}`)
      .then((res) => res.json())
      .then((result) => {
        console.log('result: ', result);
        if (result) {
          msg = '이메일이 중복되었습니다.';
        } else {
          msg = '사용 가능한 이메일 입니다.';
          flag = true;
        }
        debouncedUpdateState('email', email, msg, flag);
      });
  };

  // 이메일 입력창 체인지 이벤트 핸들러
  const emailHandler = (e) => {
    const inputValue = e.target.value;
    const emailRegex =
      /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수값 입니다!';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일 형식이 올바르지 않습니다.';
    } else {
      // 이메일 중복 체크
      fetchDuplicateCheck(inputValue);
      return;
    }

    debouncedUpdateState('email', inputValue, msg, flag);
  };

  // 패스워드 입력창 체인지 이벤트 핸들러
  const passwordHandler = (e) => {
    const inputValue = e.target.value;
    // 패스워드가 변경됐다? -> 패스워드 확인란도 초기화 시킨다.
    document.getElementById('password-check').value = '';
    updateState('passwordCheck', '', '', false);

    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '비밀번호는 필수입니다.';
    } else if (!pwRegex.test(inputValue)) {
      msg =
        '8글자 이상의 영문, 숫자, 특수문자를 포함해 주세요.';
    } else {
      msg = '사용 가능한 비밀번호 입니다.';
      flag = true;
    }

    debouncedUpdateState('password', inputValue, msg, flag);
  };

  // 비밀번호 확인란 체인지 이벤트 핸들러
  const pwCheckHandler = (e) => {
    const inputValue = e.target.value;
    let msg;
    let flag = false;
    if (!inputValue) {
      msg = '비밀번호 확인란은 필수입니다.';
    } else if (userValue.password !== inputValue) {
      msg = '비밀번호가 일치하지 않습니다.';
    } else {
      msg = '비밀번호가 일치합니다.';
      flag = true;
    }

    debouncedUpdateState(
      'passwordCheck',
      'pass',
      msg,
      flag,
    );
  };

  // 4개의 입력창이 모두 검증에 통과했는지 여부를 검사
  const isValid = () => {
    for (let key in correct) {
      const flag = correct[key];
      if (!flag) return false;
    }
    return true;
  };

  // 회원 가입 처리 서버 요청
  const fetchSignUpPost = () => {
    fetch(`${API_BASE_URL}${USER}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(
          `${data.userName}(${data.email})님 회원가입에 성공했습니다.`,
        );
        // 로그인 페이지로 리다이렉트
        // window.location.href = '/login';
        navigate('/login');
      })
      .catch((err) => {
        console.log('err: ', err);
        alert(
          '서버와의 통신이 원활하지 않습니다. 관리자에게 문의하세요.',
        );
      });
  };

  // 회원 가입 버튼 클릭 이벤트 핸들러
  const joinButtonClickHandler = (e) => {
    e.preventDefault();

    if (isValid()) {
      // fetch를 사용한 회원 가입 요청.
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해 주세요!');
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component='h1' variant='h5'>
              계정 생성
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete='fname'
              name='username'
              variant='outlined'
              required
              fullWidth
              id='username'
              label='유저 이름'
              autoFocus
              onChange={nameHandler}
            />
            <span
              style={
                correct.userName
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.userName}
            </span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='이메일 주소'
              name='email'
              autoComplete='email'
              onChange={emailHandler}
            />
            <span
              style={
                correct.email
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.email}
            </span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='패스워드'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={passwordHandler}
            />
            <span
              style={
                correct.password
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.password}
            </span>
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password-check'
              label='패스워드 확인'
              type='password'
              id='password-check'
              autoComplete='check-password'
              onChange={pwCheckHandler}
            />
            <span
              id='check-span'
              style={
                correct.passwordCheck
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.passwordCheck}
            </span>
          </Grid>

          <Grid item xs={12}>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              style={{ background: '#38d9a9' }}
              onClick={joinButtonClickHandler}
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid container justify='flex-end'>
          <Grid item>
            <Link href='/login' variant='body2'>
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;
