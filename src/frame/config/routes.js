import React from 'react';import Async from '../components/Async';
export default [{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Layout')} />,
children:[{path:'/home',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Home')} />},
{path:'/library',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Library')} />},
{path:'/book/:id',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Book')} />},
{path:'/chapter/:id',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Chapter')} />},
{path:'/bookshelf',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Bookshelf')} />}],
indexPath:'/home'}]