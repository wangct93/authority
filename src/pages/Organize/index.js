import React, { PureComponent } from 'react';
// @ts-ignore
import css from './index.less';
import {Button, TreeSelect, Spin, Modal, Form, Tree, Alert, message, Icon} from "antd";
import { TableView, getSessionUser,showLoading, SplitHorizon } from 'afc-basic-element-browser';
import * as authorityOrganize from '../../db/organize';
import { AfcDrawer, AfcFlex, AfcFlexItem, BaseEditDrawer,FilterInput,DateStringPicker,
    DateStringRangePicker,colTimeWidth, textOverflowRender, NumberInput,AfcForm,AuthButton,
    FilterSelect,FilterTextarea } from "afc-basic-element-browser";
import { generateOrganizeTreeToArray, } from '../../utils/util';
import { OrganizeDescInput } from '../../components/BaseInput';

import { ModalType, GetHandType } from "../../utils/options";
import moment from 'moment';
import  DefineComponent from "../../components/DefineComponent";
import * as DbDic from "../../db/dic";
import {
    roleIdValidator,
    organizeNameValidator
} from '../../utils/validator';
import auths from "../../json/auths";

const { TreeNode } = Tree;

/**
 * 组织机构
 */
export default class Organize extends DefineComponent {

    state = {
        editModal: {},
        checkedRow: {},
        checkedKey: null,
        expandedKeys: [],
        loading: true,
        organizeTreeData: [],
        treeSelectedKeys:[],
    };

    componentDidMount() {
        this.updateTree();
    }

    updateTree = () => {
        DbDic.deptDicTree().then(v => {
            let keys = [];
            v.length !== 0 && generateOrganizeTreeToArray(v, []).forEach((item) => {
                keys.push(item.dept_id.toString());
            });
            this.setState({
                organizeTreeData: v,
                expandedKeys: keys,
                loading: false,
            })
        })
    }

    getFilterOptions = () => {

        return [
            {
                title: '部门编号',
                field: 'dept_id',
                component: FilterInput,
                props: {
                    allowClear: true,
                },
                formatter: (curValue, oldValue) => {
                    if (curValue.length > 19) {
                        return oldValue;
                    }
                    return curValue;
                },
            },
            {
                title: '部门名称',
                field: 'dept_name',
                component: FilterInput,
                props: {
                    allowClear: true,
                },
                formatter: (curValue, oldValue) => {
                    if (curValue.length > 20) {
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
                title: '部门编号',
                dataIndex: 'dept_id',
            },
            {
                title: '上级部门编号',
                dataIndex: 'parent_id',
            },
            {
                title: '部门名称',
                dataIndex: 'dept_name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: colTimeWidth,
            },
            {
                title: '部门描述',
                dataIndex: 'dept_desc',
                render: textOverflowRender,
            },
            {
                title: '操作',
                dataIndex: 'op',
                width:100,
                render:(v,row) => {
                    return <AuthButton auth={auths.organizeUpdate} title="编辑" render={(props) => {
                        return <a onClick={this.doEdit.bind(this,row)}>{props.title}</a>;
                    }
                    } />;
                },
            },
        ]
    }

    doEdit = (row) => {
        const { treeSelectedKeys} = this.state;
        this.setState({
            editModal: {
                visible: true,
                showType:ModalType.edit,
                data: row,
                parentId:treeSelectedKeys && treeSelectedKeys[0],
            }
        });
    };

    getBtn() {
        const { state } = this;
        return [
            {
                function: auths.organizeCreate,
                title: '新增',
                onClick: this.openAddModal.bind(this, ModalType.add),
            },
            // {
            //     function: auths.organizeUpdate,
            //     title: '编辑',
            //     onClick: this.openAddModal.bind(this, ModalType.edit),
            //     props: {
            //         disabled: state.checkedKey === null,
            //     }
            // },
            {
                function: auths.organizeWatch,
                title: '查看',
                onClick: this.openAddModal.bind(this, ModalType.read),
                props: {
                    disabled: state.checkedKey === null,
                }
            },
            {
                function: auths.organizeDelete,
                title: '删除',
                onClick: this.doDelete,
                props: {
                    disabled: state.checkedKey === null,
                }
            },
            {
                function: auths.organizeSearch,
                title: '查询',
                onClick: this.search,
            },
            'reset',
        ];
    }

    openAddModal = (showType) => {
        const { checkedRow ,treeSelectedKeys} = this.state;
        this.setState({
            editModal: {
                visible: true,
                showType,
                data: checkedRow,
                parentId:treeSelectedKeys && treeSelectedKeys[0],
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
        // delete param.searchType;
        return {
            ...param,
        }
    }

    loadData = (param) => {
        return param.searchType === "normal" ? authorityOrganize.search({ ...param }) : authorityOrganize.searchTree({ ...param });
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
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const { checkedRow,treeSelectedKeys }: any = this.state;
                authorityOrganize.deleteItem({ ...checkedRow }).then(v => {
                    message.success('删除数据成功！');
                    this.setState({
                        checkedKey: null,
                        checkedRow: {},
                    })
                    this.updateTree();
                    const isDeleteSelf = treeSelectedKeys[0] == checkedRow.dept_id;
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
        }
        if (showType === ModalType.add) {
            showLoading(authorityOrganize.create(sendParam)).then(v => {
                this.setState({
                    editModal: {
                        visible: false,
                        data: null,
                    },
                    checkedKey: null,
                    checkedRow: {},
                });
                message.success('新增成功！');
                this.updateTree();
                this.tableView.reload();
            })

        } else if (showType === ModalType.edit) {
            showLoading(authorityOrganize.update(sendParam)).then(v => {
                this.setState({
                    editModal: {
                        visible: false,
                        data: null,
                    },
                    checkedKey: null,
                    checkedRow: {},
                });
                message.success('编辑成功！');
                this.updateTree();
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
                    <TreeNode title={item.dept_name} key={item.dept_id} value={item.dept_id}>
                        {this.renderTreeNodes(item.sub_nodes)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.dept_id} title={item.dept_name} value={item.dept_id} />;
        });
    }


    getTreeContent = () => {
        const { organizeTreeData } = this.state;
        return <div className={css.tree_box}>
            <div className={css.title}>
                <Icon type="appstore" />
                组织机构
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
                        {this.renderTreeNodes(organizeTreeData)}
                    </Tree>
                </Spin>
            </div>
        </div>;
    }
    onSelect = (selectedKeys, e) => {
        const key = e.node.props.eventKey;
        this.setState({
            treeSelectedKeys: [key],
        });
        const searchPar = {
            dept_id: key,
            searchType: 'tree',
        }
        return this.tableView.doSearch({ ...searchPar }, this.props.showType);
    };

    getRight = () => {
        const { state } = this;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: state.checkedKey === null ? [] : [state.checkedKey],
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    checkedKey: selectedRows.length === 0 ? null : selectedRows[0].dept_id,
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
            rowKey='dept_id'
        />
    }

    render() {
        const { state } = this;
        return <React.Fragment>
            <SplitHorizon defaultWidth={280} left={this.getTreeContent()} right={this.getRight()} />
            <EditModal {...state.editModal} onOk={this.finishEdit} onCancel={this.closeEditModal} organizeTreeData={state.organizeTreeData} />
        </React.Fragment>;
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
            if (nextProps.showType !== ModalType.add) {//若为编辑或者查看模式
                this.setState({
                    formData: {
                        ...data,
                    },
                });
            } else {
                this.setState({
                    formData: { parent_id: nextProps.parentId },
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
        return this.state.formData.dept_id === -1;
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
            // {
            //     title: '部门编号',
            //     field: 'dept_id',
            //     component: FilterInput,
            //     props: {
            //         disabled: isRead,
            //         allowClear: false,
            //     },
            //     width: '100%',
            //     required: true,
            //     formatter: roleIdValidator,
            // },
            {
                title:'上级部门',
                field:'parent_id',
                component:AfcTreeSelect,
                props:{
                    options:this.props.organizeTreeData,
                },
            },
            {
                title: '部门名称',
                field: 'dept_name',
                component: FilterInput,
                props: {
                    disabled: isRead,
                    allowClear: false,
                },
                width: '100%',
                required: true,
                formatter: organizeNameValidator,
            },
            {
                title: '部门描述',
                field: 'dept_desc',
                component: OrganizeDescInput,
                props: {
                    autosize: { minRows: 4, maxRows: 15 },
                    disabled: isRead,
                },
                width: '100%',
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
            if (!item.sub_nodes || item.sub_nodes.length !== 0) {
                return (
                    <TreeSelect.TreeNode title={item.dept_name} key={item.dept_id} value={item.dept_id} disabled={item.dept_id === -1}>
                        {this.renderTreeSelectNode(item.sub_nodes)}
                    </TreeSelect.TreeNode>
                );
            }
            return <TreeSelect.TreeNode title={item.dept_name} key={item.dept_id} value={item.dept_id} />
        });
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
            selectedRows: [],
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
                        <Button onClick={this.onCancel} style={{ marginRight: 8 }}>关闭</Button>
                    </div> : <div className="afc-drawer-footer">
                            <Button onClick={this.onCancel} style={{ marginRight: 8 }}>取消</Button>
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
            if (!item.sub_nodes || item.sub_nodes.length !== 0) {
                return (
                  <TreeSelect.TreeNode title={item.dept_name} key={item.dept_id} value={item.dept_id} disabled={item.dept_id === -1}>
                      {this.renderTreeSelectNode(item.sub_nodes)}
                  </TreeSelect.TreeNode>
                );
            }
            return <TreeSelect.TreeNode title={item.dept_name} key={item.dept_id} value={item.dept_id} />
        });
    }

    render() {
        return <TreeSelect
          {...this.props}
          showSearch
          allowClear
          filterTreeNode={(str, node) => { return node.props.title.indexOf(str) > -1 }}
          placeholder="请选择上级部门"
          treeDefaultExpandAll
          suffixIcon={<Icon type="caret-down" />}
        >{
            this.renderTreeSelectNode(this.getOptions())
        }
        </TreeSelect>;
    }
}
