import React, { useState } from 'react';
import { Collapse, Button, Modal, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { createTask } from '../../../redux/modules/categories';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Droppable } from 'react-beautiful-dnd';
import propsToJS from '../../../shared/prop-to-js';
import Task from './task';

const { Panel } = Collapse;

const renderExtra = (showModalCreate) => (
    <>
        <Button>
            <PlusOutlined onClick={event => {
                showModalCreate();
                event.stopPropagation();
            }} />
        </Button>
        <Button>
            <EditOutlined onClick={event => {
                event.stopPropagation()
            }} />
        </Button>
        <Button>
            <DeleteOutlined onClick={event => {
                event.stopPropagation()
            }} />
        </Button>
    </>
)
const Column = props => {
    const [visible, setVisible] = useState(false);
    const { category, tasks, handleCreateTask } = props;
    const [form] = Form.useForm();

    const onFinishCreateTask = () => {
        const dataForm = form.getFieldsValue();
        const dataSubmit = {
            title: dataForm.title,
            category: category._id
        }
        handleCreateTask(dataSubmit);
    }

    const showModalCreate = () => {
        setVisible(true);
    };

    const handleCloseModalCreate = () => {
        setVisible(false);
    };

    return (
        <>
            <Collapse
                defaultActiveKey={[category._id]}
            >
                <Panel
                    header={category.title}
                    key={category._id}
                    extra={renderExtra(showModalCreate)}
                    className='tasks__column--panel'
                >
                    <Droppable
                        droppableId={category._id}
                    >
                        {provided => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {
                                    tasks.map((task, index) => (
                                        <Task key={task._id} task={task} index={index} />
                                    ))
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Panel>
            </Collapse>

            <Modal
                visible={visible}
                title='Create task'
                onOk={handleCloseModalCreate}
                onCancel={handleCloseModalCreate}
                footer={[
                    <Form.Item>
                        <Button
                            type='primary'
                            onClick={onFinishCreateTask}
                        >
                            Create
                        </Button>
                    </Form.Item>
                ]}
            >
                <Form
                    form={form}
                    name='create_task_form'
                    onFinish={onFinishCreateTask}
                    autoComplete='off'
                >
                    <Form.Item
                        label="Title"
                        name='title'
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = {
    handleCreateTask: createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(propsToJS(Column));
