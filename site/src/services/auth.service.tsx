import * as React from 'react'
import { useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Redirect } from 'react-router-dom'
import store from '../apollo-client'
import * as queries from '../graphql/queries'
import { Me } from '../graphql/types'
import { useSubscriptions } from './cache.service'

const MyContext = React.createContext(null)
export const useMe = () => useContext(MyContext)

export const withAuth = (Component: React.ComponentType) => {
  const { user, token } = getAuthHeader()

  return props => {
    if (!getAuthHeader()) return <Redirect to="/sign-in" />


    // Validating against server
    const fetchUser = useQuery<Me.Query, Me.Variables>(queries.me, {
      suspend: true,
      context: {
        headers: {
          Authorization: token,
          'x-hasura-user-id': user,
          'x-hasura-role': 'mine'
        }
      }
    })

    const myResult = fetchUser.data.users ? fetchUser.data.users[0] : {};

    useSubscriptions(myResult)

    return (
      <MyContext.Provider value={myResult}>
        <Component {...props} />
      </MyContext.Provider>
    )
  }
}

export const storeAuthHeader = (auth: string, user: string) => {
  localStorage.setItem('Authorization', 'Bearer ' + auth)
  localStorage.setItem('user', user)
}

export const getAuthHeader = (): { token: string, user: string } | null => {
  return {
    token: localStorage.getItem('Authorization'),
    user: localStorage.getItem('user')
  } || null
}

export const signIn = ({ username, password }) => {

  return fetch(`${process.env.REACT_APP_AUTH_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => {
      if (res.status < 400) {
        return res.json().then(({ token, user }) => {
          storeAuthHeader(token, user);
        });
      } else {
        return Promise.reject(res.statusText)
      }
    })
}

export const signUp = ({ username, password, name }) => {
  return fetch(`${process.env.REACT_APP_AUTH_URL}/signup`, {
    method: 'POST',
    body: JSON.stringify({ name, username, password, confirmPassword: password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  })
}

export const signOut = () => {
  localStorage.removeItem('Authorization')

  return store.clearStore()
}

export default {
  useMe,
  withAuth,
  storeAuthHeader,
  getAuthHeader,
  signIn,
  signUp,
  signOut,
}
