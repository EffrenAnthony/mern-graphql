import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/client';
import { useForm } from '../hooks/useForm';
import { LOGIN_USER } from '../graphQL/Mutations';
import { AuthContext } from '../context/auth';


const Login = (props) => {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username:'',
    password: ''
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: useData } }){
      context.login(useData)
      props.history.push('/')
    },
    onError(err){
      // console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function registerUser(){
    loginUser()
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type='submit' primary>
          Login
        </Button>
      </Form>
      {
        Object.keys(errors).length > 0 &&
        <div className="ui error message">
        <ul className='list'>
          {
            Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))
          }
        </ul>
      </div>
      }
    </div>
  );
};


export default Login;