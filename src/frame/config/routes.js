import React from 'react';import Async from '../components/Async';
export default [{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Layout')} />,
children:[{path:'/menu',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Menu')} />},
{path:'/role',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Role')} />},
{path:'/user',
component:(props) => <Async {...props} getComponent={() => import('../../pages/User')} />},
{path:'/dept',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Dept')} />}]}]