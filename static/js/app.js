window.React = require('react');
window.ReactDOM = require('react-dom');
window.ReactRouter = require('react-router');
window.Antd = require('antd');

import 'style/modules/pageA.scss';
import Index from './modules/index';

var { Router ,Route, browserHistory, IndexRoute } = ReactRouter;

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={Index}></Route>
    </Router>
), document.querySelectorAll('.main')[0]);
