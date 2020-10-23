import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import propsToJS from '../../../../shared/prop-to-js';
import { updateTask } from '../../../../redux/modules/tasks';
import { updateForceRender } from '../../../../redux/modules/categories';
import './task.scss';

const Task = props => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const { task, index, handleUpdateTask, handleUpdateForceRender } = props;
    const [selectedTask, setSelectedTask] = useState(task);

    useEffect(() => {
        setSelectedTask(task)
    }, []);

    const handleCloseModalEdit = () => {
        setVisible(false);
    }

    const onFinishEditTask = () => {
        const dataForm = form.getFieldsValue();
        handleUpdateTask(dataForm);
        setSelectedTask(dataForm);
        handleUpdateForceRender();
    }

    const showModalEdit = (task) => {
        setVisible(true);
        setSelectedTask(task);
    }
    return (
        <>
            <Draggable
                draggableId={task._id}
                index={index}
            >
                {provided => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className='tasks__column--panel--item'
                    >
                        {selectedTask.title}
                       
                        <Button
                            className='task__btn-delete'
                        >
                            <DeleteOutlined onClick={event => {
                                event.stopPropagation()
                            }} />
                        </Button>
                        <Button
                            className='task__btn-edit'
                        >
                            <EditOutlined onClick={event => {
                                showModalEdit(selectedTask);
                                event.stopPropagation()
                            }} />
                        </Button>
                    </div>
                )}
            </Draggable>
            <Modal
                visible={visible}
                title='Edit task'
                onOk={handleCloseModalEdit}
                onCancel={handleCloseModalEdit}
                footer={[
                    <Form.Item>
                        <Button
                            type='primary'
                            onClick={onFinishEditTask}
                        >
                            Edit
                        </Button>
                    </Form.Item>
                ]}
            >
                <Form
                    form={form}
                    name='create_task_form'
                    onFinish={onFinishEditTask}
                    autoComplete='off'
                >
                    <Form.Item
                        label="Title"
                        name='title'
                        rules={[{ required: true, message: 'Required' }]}
                        initialValue={selectedTask.title}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='id'
                        rules={[{ required: true, message: 'Required' }]}
                        initialValue={selectedTask._id}
                        hidden
                    >
                        <Input hidden />
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
    handleUpdateTask: updateTask,
    handleUpdateForceRender: updateForceRender
}

export default connect(mapStateToProps, mapDispatchToProps)(propsToJS(Task));