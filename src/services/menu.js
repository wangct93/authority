import { request as requestFunc ,getSessionUser,getFixedFullNodeId} from 'afc-basic-element-browser';
import requestAuth from './auth';

export const APIhost = '/api';
export function request(url, ...args) {
    return requestFunc(APIhost + url, ...args);
}

/**
 * 菜单请求
 * @author wangchuitong
 */
export function requestMenu(url, options = {},...args) {
    return requestFunc('/api/auth/menu' + url, {
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
    return requestAuth(`/menu/query`, {
        method: 'post',
        body: params
    })
}
//查询本节点及子节点
export function searchTree(params) {
    return requestAuth(`/menu/nodeQuery`, {
        method: 'post',
        body: params
    })
}

//增加单条数据
export function create(params) {
    return requestAuth(`/menu/create`, {
        method: 'post',
        body: params
    })
}


//编辑单条数据
export function update(params) {
    return requestAuth(`/menu/update`, {
        method: 'post',
        body: params
    })
}

//删除单条数据
export function deleteItem(params) {
    return requestAuth(`/menu/delete?menu_id=${params.menu_id}`, {
        method: 'post',
        // body: params
    })
}

/**
 * 菜单导入
 * @author wangchuitong
 */
export async function doImport(file) {
    if(!file){
        throw '文件不存在';
    }
    const formData = new FormData();
    formData.append('file',file);
    return requestAuth('/menu/import', {
        method: 'post',
        body: formData,
    });
}
