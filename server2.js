'use strict'

import React from 'react'
import Express from 'express'
import path from 'path'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import storeManager from './src/client/store/storeManager.js'
import { match, RoutingContext } from 'react-router';
import routes from './src/client/routes/routes.js'

const app = new Express()
const port = 8080

// This is fired every time the server side receives a request
app.use(handleRender);

function handleRender(request, response) {

  //for every request create a new Redux store instance
  const store = storeManager();

  //compile an initial state from store
  const initialState = store.getState()

  //Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      //  {routes}
   </Provider>
    )

  response.send(renderFullPage(html, initialState))
}

// this function is suppose to inject the initial HTML and initial state into a template to be rendered client side

function renderFullPage(html, initalState) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
        <title>Bootstrap Package</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="IE=10">
        <link rel="stylesheet" href="/resources/styles.css"/>
        <script src="/resources/jquery-2.1.3.min.js"></script>
    </head>
    <body>
    <script>
    </script>
    <div id="content"></div>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
    </script>
    <script src="/resources/bundle.js"></script>
    </body>
  </html>
  `
 }

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
