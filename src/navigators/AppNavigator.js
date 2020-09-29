// import React from 'react';
// import { compose, createStore, applyMiddleware } from 'redux'
// import { createLogger } from 'redux-logger'
// import { connect } from 'react-redux'
// import thunkMiddleware from 'redux-thunk';
// import reducer from '../redux/reducers'
// import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers'
// import AppRouteConfigs from './AppRouteConfigs';

// const middleware = createReactNavigationReduxMiddleware(
//     'root',
//     state => state.nav,
// );

// const App = reduxifyNavigator(AppRouteConfigs, 'roots');
// const mapStateToProps = state =({
//     state: state.nav
// })

// const AppWithNavigationState = connect(mapStateToProps)(App)
// const loggerMiddleware = createLogger({ predicate : () => __DEV__});
// const configureStore = ( initialState ) => {
//     const enhancer = compose(
//         applyMiddleware(
//             middleware,
//             thunkMiddleware,
//             loggerMiddleware
//         ),
//     );
//     return createStore(reducer, initialState, enhancer)
// }

// const Root = () => <AppWithNavigationState />

// export {
//     Root,
//     configureStore
// }