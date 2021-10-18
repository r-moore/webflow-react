import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <div>This is a React component inside of Webflow!</div>;

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById('react-target')
);
