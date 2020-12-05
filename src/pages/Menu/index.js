import React, { PureComponent } from 'react';
// @ts-ignore
import css from './index.less';
import {Button, TreeSelect, Spin, Modal, Form, Tree, Alert, message, Icon} from "antd";
import { TableView, getSessionUser,showLoading, SplitHorizon,AuthButton,AfcUpload } from 'afc-basic-element-browser';
import * as authorityMenu from '../../db/authorityMenu';
import {
    AfcDrawer, AfcFlex, AfcFlexItem,BaseEditDrawer,RemarkInput,colTimeWidth,textOverflowRender, NumberInput, AfcForm,
    DateStringPicker, DateStringRangePicker,FilterInput,FilterSelect,FilterTextarea

 } from "afc-basic-element-browser";
import { generateMenuTreeToArray, findChildMenuTypeByMenuId } from '../../utils/util';
import {toAry} from '@wangct/util';
import { ModalType, GetHandType } from "../../utils/options";
import moment from 'moment';
import DefineComponent  from "../../components/DefineComponent";
import * as DbDic from "../../db/dic";
import {
    roleIdValidator,
    roleNameValidator,
    menuURLValidator,
    menuIconLValidator,
    orderNumValidator
} from '../../utils/validator';
import auths from "../../json/auths";
import {doImport} from "../../db/authorityMenu";

const { TreeNode } = Tree;

/**
 * 菜单
 */
export default class Menu extends DefineComponent {

    state = {
        editModal: {},
        EditModal: {},
        checkedRow: {},
        checkedKey: null,
        expandedKeys: [],
        loading: true,
        menuTreeData: [],
        treeSelectedKeys:[],
    };

    componentDidMount() {
        DbDic.getMenuTypeList().then(v => {
            this.menuTypeList = v;
        })
        this.updateTree();
    }

    updateTree = () => {
        DbDic.searchMenuTree().then(v => {
            let keys = [];
            v.length !== 0 && generateMenuTreeToArray(v, []).forEach(item => {
                if(item.menu_type === 1){
                    keys.push(item.menu_id.toString());
                }

            });
            this.setState({
                menuTreeData: v,
                expandedKeys: keys,
                loading: false,
            })
        })
    }

    getFilterOptions = () => {

        return [
            {
                title: '菜单编号',
                field: 'menu_id',
                component: FilterInput,
                props: {
                    allowClear: true,
                },
                formatter: (curValue, oldValue) => {
                    if (curValue.length > 19) {
                        return oldValue;
                    }
                    return curValue;
                }
            },
            {
                title: '菜单名称',
                field: 'menu_name',
                component: FilterInput,
                props: {
                    allowClear: true,
                },
                formatter: (curValue, oldValue) => {
                    if (curValue.length > 10) {
                        return oldValue;
                    }
                    return curValue;
                }
            },
        ]
    }

    getColumns = () => {
        return [
            {
                title: '菜单编号',
                dataIndex: 'menu_id',
                render:(v) => {
                    return <span style={{color:'rgba(211, 115, 238, 1)'}}>{v}</span>;
                },
            },
            {
                title: '上级菜单编号',
                dataIndex: 'parent_id',
                render:(v) => {
                    return <span style={{color:'rgba(243, 108, 108, 1)'}}>{v}</span>;
                },
            },
            {
                title: '菜单名称',
                dataIndex: 'menu_name',
                width: 150,
            },
            {
                title: '菜单URL',
                dataIndex: 'menu_url',
                render: textOverflowRender,
                width: 200,
            },
            {
                title: '菜单类型',
                dataIndex: 'menu_type',
                render: (text, record) => {
                    let renderStr = '';
                    this.menuTypeList.length !== 0 && this.menuTypeList.forEach(item => {
                        if (Number(item.value === Number(record.menu_type))) {
                            renderStr = item.text;
                        }
                    });
                    return renderStr;
                }
            },
            {
                title: '排序号',
                dataIndex: 'order_num',
                // width: 130,
            },
            {
                title: '菜单按钮',
                dataIndex: 'menu_icon',
                // width: 130,
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: colTimeWidth,
            },
            {
                title: '操作',
                dataIndex: 'op',
                width:100,
                render:(v,row) => {
                    return <AuthButton auth={auths.menuUpdate} render={(props) => {
                    return <a onClick={this.doEdit.bind(this,row)}>{props.title || '编辑'}</a>;
                    }
                    } />;
                },
            },
        ];
    };

    getBtn() {
        const { state } = this;
        return [
            {
                function: auths.menuCreate,
                title: '新增',
                onClick: this.openAddModal.bind(this, ModalType.add),
            },
            <AfcUpload onChange={this.doImport}>
                <AuthButton auth={auths.menuImport} title="导入" />
            </AfcUpload>,
            // {
            //     function: auths.menuUpdate,
            //     title: '编辑',
            //     onClick: this.openAddModal.bind(this, ModalType.edit),
            //     props: {
            //         disabled: state.checkedKey === null || this.state.checkedRow.menu_id === -1,
            //     }
            // },
            {
                function: auths.menuDelete,
                title: '删除',
                onClick: this.doDelete,
                props: {
                    disabled: state.checkedKey === null || this.state.checkedRow.menu_id === -1,
                }
            },
            {
                function: auths.menuSearch,
                title: '查询',
                onClick: this.search,
            },
            'reset',
        ];
    }

    doImport = (file) => {
            console.log(file)
            showLoading(doImport(file)).then(() => {
                message.success('导入成功');
                this.tableSearch();
                this.updateTree();
            });
    };

    openAddModal = (showType) => {
        const { checkedRow,treeSelectedKeys } = this.state;
        this.setState({
            editModal: {
                visible: true,
                showType,
                data: checkedRow,
                parentId:toAry(treeSelectedKeys)[0],
            }
        });
    };

    doEdit = (row) => {
        const { treeSelectedKeys } = this.state;
        this.setState({
            editModal: {
                visible: true,
                showType:ModalType.edit,
                data: row,
                parentId:toAry(treeSelectedKeys)[0],
            }
        });
    };

    search = () => {
        this.setState({
            treeSelectedKeys:[],
        });
        return this.tableView.doSearch({ searchType: 'normal' });
    }

    beforeLoad = (param) => {
        return {
            ...param,
        }
    }

    loadData = (param) => {
        return param.searchType === "normal" ? authorityMenu.search({ ...param }) : authorityMenu.searchTree({ ...param });
    }

    afterLoad = (data) => {
        this.setState({
            checkedKey: null,
            checkedRow: {},
        });
        return data;
    }

    // 删除提示
    doDelete = () => {
        Modal.confirm({
            title: '确认删除吗？',
            content: '会把该条数据和其下所有子节点全部删除！',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const { checkedRow ,treeSelectedKeys = []}: any = this.state;
                authorityMenu.deleteItem({ ...checkedRow }).then(v => {
                    message.success('删除数据成功！');
                    // this.tableView.doSearch({ searchType: 'normal' });
                    this.setState({
                        checkedKey: null,
                        checkedRow: {},
                    });
                    this.updateTree();
                    const isDeleteSelf = treeSelectedKeys[0] == checkedRow.menu_id;
                    if(isDeleteSelf){
                        this.search();
                    }else{
                        this.tableView.reload();
                    }
                })
            },
            onCancel: () => { },
        });
    }

    closeEditModal = () => {
        this.closeModal('editModal');
    };

    closeModal(field) {
        this.setState({
            [field]: {
                ...this.state[field],
                visible: false,
            },
        });
    }

    // 保存新增
    finishEdit = (formData, showType) => {
        const sendParam = {
            ...formData,
            menu_id: Number(formData.menu_id),
            node_type: Number(formData.node_type)
        }
        if (showType === ModalType.add) {
            showLoading(authorityMenu.create(sendParam)).then(v => {
                // close();
                this.updateTree();
                this.setState({
                    editModal: {
                        visible: false,
                        data: null,
                    },
                    checkedKey: null,
                    checkedRow: {},
                });
                message.success('新增成功！');
                this.tableView.reload();
            })
        } else if (showType === ModalType.edit) {
            showLoading(authorityMenu.update(sendParam)).then(v => {
                this.updateTree();
                close();
                this.setState({
                    editModal: {
                        visible: false,
                        data: null,
                    },
                    checkedKey: null,
                    checkedRow: {},
                });
                message.success('编辑成功！');

                this.tableView.reload();
            })

        }

    }

    renderTreeNodes = (data) => {
        if (data.length === 0) {
            return null;
        }
        return data.map(item => {
            if (item.sub_nodes) {
                return (
                    <TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id}>
                        {this.renderTreeNodes(item.sub_nodes)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.menu_id} title={item.menu_name} value={item.menu_id} />;
        });
    }


    getTreeContent = () => {
        const { menuTreeData } = this.state;

        return <div className={css.tree_box}>
            <div className={css.title}>
                <Icon type="appstore" />
                菜单信息
            </div>
            <div className={css.tree_content}>
                <Spin spinning={this.state.loading}>
                    <Tree
                      expandedKeys={this.state.expandedKeys}
                      onExpand={(keys) => { this.setState({ expandedKeys: keys }) }}
                      onSelect={this.onSelect}
                      style={{minHeight:60}}
                      selectedKeys={this.state.treeSelectedKeys}
                    >
                        {this.renderTreeNodes(menuTreeData)}
                    </Tree>
                </Spin>
            </div>
        </div>;
    };

    onSelect = (selectedKeys, e) => {
        const key = e.node.props.eventKey;
        this.setState({
            treeSelectedKeys: [key],
        });
        const searchPar = {
            menu_id: key,
            searchType: 'tree',
        }
        return this.tableView.doSearch({...searchPar});
    };

    getRight = () => {
        const { state } = this;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: state.checkedKey === null ? [] : [state.checkedKey],
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    checkedKey: selectedRows.length === 0 ? null : selectedRows[0].menu_id,
                    checkedRow: selectedRows.length === 0 ? {} : selectedRows[0],
                    // selectedRowKeys: [selectedRowKeys],
                });
            },
        };
        return <TableView
            columns={this.getColumns()}
            filterOptions={this.getFilterOptions()}
            ref={this.setTableView}
            btn={this.getBtn()}
            beforeLoad={this.beforeLoad}
            loadData={this.loadData}
            afterLoad={this.afterLoad}
            rowSelection={rowSelection}
            rowKey='menu_id'
        />
    }

    render() {
        const { state } = this;
        return <div className={css.container}>
            <SplitHorizon defaultWidth={280} left={this.getTreeContent()} right={this.getRight()} />
            <EditModal {...state.editModal} onOk={this.finishEdit} onCancel={this.closeEditModal} menuTreeData={state.menuTreeData} />
        </div>;
    }
}

class EditModal extends PureComponent<any, any> {
    private formRef: any;

    state = {
        formData: {
            parent_id: null,
        },
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            const { data } = nextProps;
            if (nextProps.showType !== ModalType.add) {//若为编辑模式
                this.setState({
                    formData: {
                        ...data,
                    },
                });
            } else {
                this.setState({
                    formData: { parent_id: nextProps.parentId, order_num: 1, },
                })
            }
        }
    }

    getTitle() {
        const options = [
            {
                title: '新增',
                field: ModalType.add,
            },
            {
                title: '编辑',
                field: ModalType.edit,
            },
            {
                title: '查看',
                field: ModalType.read,
            },
        ];
        const target = options.find((opt) => opt.field === this.getShowType()) || options[0];
        return target.title;
    }

    setRef = (ref) => {
        this.formRef = ref;
    }
    isTopNode = () => {
        return this.state.formData.menu_type === 1;
    }

    isCreate = () => {
        return this.getShowType() === ModalType.add;
    }
    isRead = () => {
        return this.getShowType() === ModalType.read;
    }
    isEdit = () => {
        return this.getShowType() === ModalType.edit;
    }
    getShowType() {
        return this.props.showType;
    }

    getOptions() {
        const isRead = this.isRead();
        const options = [
            {
                title:'上级菜单',
                field:'parent_id',
                component:AfcTreeSelect,
                props:{
                    options:this.props.menuTreeData,
                },
            },
            {
                title: '节点类型',
                field: 'node_type',
                component: FilterSelect,
                props: {
                    disabled: isRead,
                    loadData: DbDic.getMenuNodeTypeList,
                    allowClear: false,
                },
                width: '100%',
                required: true,
            },
            {
                title: '菜单编号',
                field: 'menu_id',
                component: FilterInput,
                props: {
                    disabled: isRead || this.isEdit(),
                    allowClear: false,
                },
                width: '100%',
                required: true,
                formatter: roleIdValidator,
            },
            {
                title: '菜单名称',
                field: 'menu_name',
                component: FilterInput,
                props: {
                    disabled: isRead,
                    allowClear: false,
                },
                width: '100%',
                required: true,
                formatter: roleNameValidator,
            },
            {
                title: '菜单类型',
                field: 'menu_type',
                component: FilterSelect,
                props: {
                    disabled: isRead,
                    loadData: DbDic.getMenuTypeList,
                    allowClear: false,
                },
                width: '100%',
                required: true,
            },
            {
                title: '排序号',
                field: 'order_num',
                component: FilterInput,
                props: {
                    disabled: isRead,
                    allowClear: false,
                },
                width: '100%',
                required: true,
                formatter: orderNumValidator,
            },
            {
                title: '菜单URL',
                field: 'menu_url',
                component: FilterInput,
                // required: true,
                props: {
                    disabled: isRead,
                    allowClear: false,
                },
                width: '100%',
                formatter: menuURLValidator,
            },
            {
                title: '菜单按钮',
                field: 'menu_icon',
                component: FilterInput,
                // required: true,
                props: {
                    disabled: isRead,
                    allowClear: true,
                },
                width: '100%',
                formatter: menuIconLValidator,
            },
        ];
        return options;
    }

    formChange = (form) => {
        this.setState({
            formData: { ...form },
        });
    }

    renderTreeSelectNode = (data) => {
        if (!data || data.length === 0) {
            return [];
        }
        return data.map(item => {
            if (item.sub_nodes && item.menu_type !== 3 && item.sub_nodes.length !== 0) {
                return (
                    <TreeSelect.TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id} disabled={item.menu_id === -1}>
                        {this.renderTreeSelectNode(item.sub_nodes)}
                    </TreeSelect.TreeNode>
                );
            }
            else if (item.sub_nodes && item.menu_type !== 3 && item.sub_nodes.length === 0) {//如果是上级结点类型，但是该节点下没有子节点。
                return <TreeSelect.TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id} />
            }
            else {
                return null;
            }
        }).filter((item) => !!item);
    }

    onTreeChange = value => {
        const { formData } = this.state;
        this.setState({
            formData: {
                ...formData,
                parent_id: value,
            }
        });
    };

    onCancel = () => {
        this.setState({
            formData: {
                parent_id: null,
            },
        });
        return this.props.onCancel();
    }

    onOk = () => {
        const { formData } = this.state;
        this.formRef.validator().then(v => {
            return this.props.onOk({ ...formData }, this.props.showType);
        });
    }

    render() {
        const { state } = this;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return <AfcDrawer
            title={this.getTitle()}
            {...this.props}
            onClose={this.onCancel}
            className={css.modal_wrap}
            width={400}
        >
            <AfcFlex mode="vertical">
                <AfcForm
                  options={this.getOptions()}
                  value={state.formData}
                  ref={this.setRef}
                  onChange={this.formChange}
                />
                <AfcFlexItem className={css.drawer_flex}></AfcFlexItem>
                {
                    this.isRead() ? <div className="afc-drawer-footer">
                        <Button onClick={this.onCancel} style={{ marginRight: 0 }}>关闭</Button>
                    </div> : <div className="afc-drawer-footer">
                            <Button onClick={this.onCancel} style={{ marginRight: 0 }}>取消</Button>
                            <Button onClick={this.onOk} type="primary"> 保存</Button>
                        </div>
                }

            </AfcFlex>
        </AfcDrawer>;
    }
}

class AfcTreeSelect extends DefineComponent {
  state = {};

    renderTreeSelectNode = (data) => {
        if (!data || data.length === 0) {
            return [];
        }
        return data.map(item => {
            if (item.sub_nodes && item.menu_type !== 3 && item.sub_nodes.length !== 0) {
                return (
                  <TreeSelect.TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id} disabled={item.menu_id === -1}>
                      {this.renderTreeSelectNode(item.sub_nodes)}
                  </TreeSelect.TreeNode>
                );
            }
            else if (item.sub_nodes && item.menu_type !== 3 && item.sub_nodes.length === 0) {//如果是上级结点类型，但是该节点下没有子节点。
                return <TreeSelect.TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id} />
            }
            else {
                return null;
            }
        }).filter((item) => !!item);
    }

  render() {
    return <TreeSelect
      {...this.props}
      showSearch
      allowClear
      filterTreeNode={(str, node) => { return node.props.title.indexOf(str) > -1 }}
      placeholder="请选择上级菜单"
      treeDefaultExpandAll
      suffixIcon={<Icon type="caret-down" />}
    >{
          this.renderTreeSelectNode(this.getOptions())
      }
  </TreeSelect>;
  }
}
