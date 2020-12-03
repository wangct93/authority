import React, { PureComponent } from 'react';
// @ts-ignore
import css from './index.less';
import { Button, Spin, Select, Modal, InputNumber, Input, Tree, message } from "antd";
import { TableView, getSessionUser, showLoading } from 'afc-basic-element-browser';
import { AfcDrawer, AfcFlex, AfcFlexItem, BaseEditDrawer,AfcForm,
    DateStringPicker,
    DateStringRangePicker,
    FilterInput,
    FilterSelect,colTimeWidth, textOverflowRender, NumberInput,AuthButton,
    FilterTextarea } from "afc-basic-element-browser";
import { RemarkInput, RoleDescInput } from '../../components/BaseInput';
import * as DbDic from "../../db/dic";
import { ModalType, GetHandType } from "../../utils/options";
import { generateMenuTreeToArray, getSelectedKey } from '../../utils/util';
import  DefineComponent  from "../../components/DefineComponent";
import * as AuthorityRoleApi from '../../db/authorityRole';
// import * as DbDic from "../../../db/dic";
import {
    roleDescValidator,
    roleIdValidator,
    roleNameValidator
} from '../../utils/validator';
import auths from "../../json/auths";
import {roleNameFormatter} from "../../utils/formatter";
const { TreeNode } = Tree;

/**
 * 角色管理
 */
export default class AuthorityRole extends DefineComponent {

    state = {
        defaultFilterValues: {
        },
        editModal: {},
        checkedRow: {},
        checkedKey: null,
        menuTreeData: [],
    };

    componentDidMount() {
        DbDic.searchMenuTree().then(v => {
            this.setState({
                menuTreeData: v,
            })
        })
    }

    getFilterOptions = () => {

        return [
            {
                title: '角色编号',
                field: 'role_id',
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
                title: '角色名称',
                field: 'role_name',
                component: FilterInput,
                props: {
                    allowClear: true,
                },
                formatter: roleNameFormatter
            },
        ]
    }

    getColumns = () => {
        return [
            {
                title: '角色编号',
                dataIndex: 'role_id',
            },
            {
                title: '角色名称',
                dataIndex: 'role_name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: colTimeWidth,
            },
            {
                title: '角色描述',
                dataIndex: 'role_desc',
                render: textOverflowRender,
            },
            {
                title: '操作',
                dataIndex: 'op',
                width:100,
                render:(v,row) => {
                    return <AuthButton auth={auths.roleUpdate} title="编辑" render={(props) => {
                        return <a onClick={this.doEdit.bind(this,row)}>{props.title}</a>;
                    }
                    } />;
                },
            },
        ]
    }

    doEdit = (row) => {
        this.setState({
            editModal: {
                visible: true,
                showType:ModalType.edit,
                data: row,
            }
        });
    };

    getBtn() {
        const { state } = this;
        return [
            {
                function: auths.roleCreate,
                title: '新增',
                onClick: this.openAddModal.bind(this, ModalType.add),
            },
            // {
            //     function: auths.roleUpdate,
            //     title: '编辑',
            //     onClick: this.openAddModal.bind(this, ModalType.edit),
            //     props: {
            //         disabled: state.checkedKey === null,
            //     }
            // },
            {
                function: auths.roleWatch,
                title: '查看',
                onClick: this.openAddModal.bind(this, ModalType.read),
                props: {
                    disabled: state.checkedKey === null,
                }
            },
            {
                function: auths.roleDelete,
                title: '删除',
                onClick: this.doDelete,
                props: {
                    disabled: state.checkedKey === null,
                }
            },
            {
                function: auths.roleSearch,
                title: '查询',
                onClick: this.search,
            },
            'reset',
        ];
    }
    search = () => {
        return this.tableView.doSearch();
    }

    openAddModal = (showType) => {
        const { checkedRow } = this.state;
        this.setState({
            editModal: {
                visible: true,
                showType,
                data: checkedRow,
            }
        });
    };
    beforeLoad = (params) => {
        return params;

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
                const { checkedRow } = this.state;
                AuthorityRoleApi.deleteItem({ ...checkedRow }).then(v => {
                    message.success('删除数据成功！');
                    this.tableView.doSearch();
                    this.setState({
                        checkedKey: null,
                        checkedRow: {},
                    })
                })
            },
            onCancel: () => { },
        });

        // deleteBom

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
            showLoading((close) => {
                AuthorityRoleApi.create(sendParam).then(v => {
                    close();
                    this.setState({
                        editModal: {
                            visible: false,
                            data: null,
                        },
                        checkedKey: null,
                        checkedRow: {},
                    });
                    message.success('新增成功！');
                    this.tableView.doSearch();
                }).catch(v => close());

            })

        } else if (showType === ModalType.edit) {
            showLoading((close) => {
                AuthorityRoleApi.update(sendParam).then(v => {
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
                    this.tableView.doSearch();
                }).catch(v => close());
            })

        }

    }

    render() {
        const { state } = this;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: state.checkedKey === null ? [] : [state.checkedKey],
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    checkedKey: selectedRows.length === 0 ? null : selectedRows[0].role_id,
                    checkedRow: selectedRows.length === 0 ? {} : selectedRows[0],
                });
            },
        };
        return <React.Fragment>
            <TableView
                columns={this.getColumns()}
                filterOptions={this.getFilterOptions()}
                ref={this.setTableView}
                btn={this.getBtn()}
                beforeLoad={this.beforeLoad}
                afterLoad={this.afterLoad}
                defaultFilterValues={state.defaultFilterValues}
                loadData={AuthorityRoleApi.search}
                rowSelection={rowSelection}
                rowKey='role_id'

            />
            <EditModal {...state.editModal} onOk={this.finishEdit} onCancel={this.closeEditModal} menuTreeData={state.menuTreeData} />
        </React.Fragment>;
    }
}

class EditModal extends PureComponent<any, any> {
    private formRef: any;

    state = {
        formData: {},
        checkedKeys: [],
        expandedKeys: [],
        halfCheckedKeys: [],

    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            const { menuTreeData } = nextProps;
            let keys = [];
            menuTreeData.length !== 0 && generateMenuTreeToArray(menuTreeData, []).forEach(item => {
                if (item.menu_type === 1) {
                    keys.push(item.menu_id.toString());
                }
            });
            this.setState({ expandedKeys: keys });
            if (nextProps.showType !== ModalType.add) {//如果是编辑或者查看模式
                const { data } = nextProps;
                data && AuthorityRoleApi.getById({ ...data }).then(data => {
                    this.setState({
                        formData: { ...data },
                        //ToDo：这段代码有问题，如果后台返回了父节点，要筛选一下：如果父节点下的所有子节点没有全部选中，则需要移除父节点。
                        checkedKeys: data.menu_list === null ? [] : getSelectedKey(menuTreeData, data.menu_list),
                    });
                })
            } else {
                this.setState({
                    formData: {},
                    checkedKeys: [],
                    halfCheckedKeys: [],
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
    getShowType() {
        return this.props.showType;
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
    getOptions() {
        const isRead = this.isRead();
        const isEdit = this.isEdit();
        const roleIdCom = isRead || isEdit ? [{
            title: '角色编号',
            field: 'role_id',
            component: NumberInput,
            required: true,
            props: {
                disabled: true,
                allowClear: false,
            },
            width: '100%',
            formatter: roleIdValidator,
        },] : [];
        const options = [
            ...roleIdCom,
            {
                title: '角色名称',
                field: 'role_name',
                component: FilterInput,
                props: {
                    disabled: isRead,
                    allowClear: false,
                },
                required: true,
                formatter: roleNameFormatter,
            },
            {
                title: '角色描述',
                field: 'role_desc',
                component: RoleDescInput,
                props: {
                    autosize: { minRows: 4, maxRows: 15 },
                    disabled: isRead,
                },
                // className: css.form_line_full,
                width: '100%',
                formatter: roleDescValidator,
            },
        ];
        return options;
    }

    formChange = (form) => {
        this.setState({
            formData: { ...form },
        });
    }
    renderTreeNodes = (data) => {
        if (!data || data.length === 0) {
            return null;
        }
        return data.map(item => {
            const titleRenderEl = this.isRead() && this.state.checkedKeys.indexOf(item.menu_id) > -1 ? <span style={{ color: 'red' }}>{item.menu_name}</span> : <span>{item.menu_name}</span>
            if (item.sub_nodes) {
                return (
                  <TreeNode title={titleRenderEl} key={item.menu_id} value={item.menu_id}>
                      {this.renderTreeNodes(item.sub_nodes)}
                  </TreeNode>
                );
            }
            return <TreeNode title={titleRenderEl} key={item.menu_id} value={item.menu_id} />;
        });
    }

    onCheck = (checkedKeys, e) => {
        this.setState({
            checkedKeys,
            halfCheckedKeys: e.halfCheckedKeys
        });
    };
    onCancel = () => {
        this.setState({
            formData: {},
            checkedKeys: [],
            halfCheckedKeys: [],
        });
        return this.props.onCancel();
    }

    onOk = () => {
        const { formData, checkedKeys, halfCheckedKeys } = this.state;
        const keys = [...checkedKeys, ...halfCheckedKeys];
        const menuIdArray = keys.length === 0 ? [] : keys.map(item => {
            return Number(item);
        });
        this.formRef.validator().then(v => {
            return this.props.onOk({ ...formData, menu_list: [...menuIdArray] },
              this.props.showType
            );
        });
    }

    render() {
        const { state } = this;
        return <AfcDrawer
          title={this.getTitle()}
          {...this.props}
          onClose={this.onCancel}
          className={css.modal_wrap}
          width={900}
        >
            <AfcFlex mode="vertical">
                <AfcFlexItem className={css.drawer_flex}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ margin: '10px', width: '50%' }}>
                            <AfcForm
                              options={this.getOptions()}
                              value={state.formData}
                              ref={this.setRef}
                              onChange={this.formChange}
                            />
                        </div>
                        <div style={{ display: 'flex', width: '50%', overflow: 'auto' }}>
                            <div style={{ width: '90px', textAlign: 'right', paddingTop: '10px' ,flex:'0 0 auto'}}>菜单信息：</div>
                            <Tree
                              // disabled={this.isRead()}
                              checkable={!this.isRead()}
                              onCheck={this.onCheck}
                              checkedKeys={this.state.checkedKeys}
                              expandedKeys={this.state.expandedKeys}
                              onExpand={(keys) => { this.setState({ expandedKeys: keys }) }}
                            >
                                {this.renderTreeNodes(this.props.menuTreeData)}
                            </Tree>
                        </div>
                    </div>
                </AfcFlexItem>
                {
                    this.isRead() ? <div className={css.drawer_footer}>
                        <Button onClick={this.onCancel} style={{ marginRight: 8 }}>关闭</Button>
                    </div> : <div className={css.drawer_footer}>
                        <Button onClick={this.onCancel} style={{ marginRight: 8 }}>取消</Button>
                        <Button onClick={this.onOk} type="primary"> 保存</Button>
                    </div>
                }

            </AfcFlex>
        </AfcDrawer>;
    }
}
