import { request as requestFunc} from 'afc-basic-element-browser';
import requestAuth from './auth';

export const APIhost = '/api';
export function request(url, ...args) {
    return requestFunc(APIhost + url, ...args);
}

/**
 * 组织机构请求
 * @author wangchuitong
 */
export function requestOrganize(url, options = {},...args) {
    return requestFunc('/api/auth/dept' + url, {
        method:'post',
      ...options,
    },...args);
}

export function formatTable(data = {}) {
    //@ts-ignore
    const { total = 0 } = data;
    return {
        ...data,
        total_count: total
    }
}
//查询单条
export function search(params) {
    return requestAuth(`/dept/query`, {
        method: 'post',
        body: params
    })
}
//查询本节点及子节点
export function searchTree(params) {
    return requestAuth(`/dept/nodeQuery`, {
        method: 'post',
        body: params
    })
}

//增加单条数据
export function create(params) {
    return requestAuth(`/dept/create`, {
        method: 'post',
        body: params
    })
}


//编辑单条数据
export function update(params) {
    return requestAuth(`/dept/update`, {
        method: 'post',
        body: params
    })
}

//删除单条数据
export function deleteItem(params) {
    return requestAuth(`/dept/delete?dept_id=${params.dept_id}`, {
        method: 'post',
        // body: params
    })
}
