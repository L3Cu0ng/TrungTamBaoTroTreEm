import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Radio, Select, message } from 'antd';
import axios from 'axios';
import Sidebar from '../Sidebar';
import './Trangchitiet.css';

const { Option } = Select;

const EmployeeDetail = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employees/${id}`);
        setProfile(response.data);
        const birthDate = new Date(response.data.ngaySinh);
        form.setFieldsValue({
          ...response.data,
          ngaySinh: {
            day: birthDate.getDate(),
            month: birthDate.getMonth() + 1,
            year: birthDate.getFullYear()
          },
          idVaitro: String(response.data.idVaitro)
        });
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
        message.error('Failed to fetch employee data');
      }
    };
    fetchEmployee();
  }, [id, form]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    form.resetFields();
    const birthDate = new Date(profile.ngaySinh);
    form.setFieldsValue({
      ...profile,
      ngaySinh: {
        day: birthDate.getDate(),
        month: birthDate.getMonth() + 1,
        year: birthDate.getFullYear()
      }
    });
  };

  const handleSave = async (values) => {
    try {
      const formattedValues = {
        ...values,
        ngaySinh: `${values.ngaySinh.year}-${values.ngaySinh.month}-${values.ngaySinh.day}`
      };
      await axios.put(`http://localhost:5000/employees/${id}`, formattedValues);
      setProfile(formattedValues);
      setEditMode(false);
      message.success('Employee updated successfully');
    } catch (error) {
      console.error('Failed to save employee data:', error);
      message.error('Failed to save employee data');
    }
  };

  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-page-content">
        <h2>Chi Tiết Nhân Viên</h2>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Họ và Tên" name="hoVaten" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="ngaySinh"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <div style={{ display: 'flex' }}>
              <Form.Item
                name={['ngaySinh', 'day']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <Select style={{ width: 150, marginRight: 10 }}
                disabled={!editMode}>
                  {[...Array(31)].map((_, index) => (
                    <Option key={index + 1} value={`${index + 1}`}>
                      {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['ngaySinh', 'month']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
              >
                <Select style={{ width: 200, marginRight: 10 }}
                disabled={!editMode}>
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={`${index + 1}`}>
                      Tháng {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['ngaySinh', 'year']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
              >
                <Select style={{ width: 230 }}disabled={!editMode}>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={`${index + 1970}`}>
                      {index + 1970}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Email" name="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="SDT" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Giới tính" name="gioiTinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group disabled={!editMode}>
              <Radio value="M">Nam</Radio>
              <Radio value="F">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Mật khẩu" name="matkhau" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Vai trò" name="idVaitro" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
            <Radio.Group disabled={!editMode}>
              <Radio value="1">Nhân viên quản lý</Radio>
              <Radio value="2">Nhân viên phòng bảo trợ trẻ em</Radio>
              <Radio value="3">Nhân viên kiểm định</Radio>
            </Radio.Group>
          </Form.Item>
          {editMode ? (
            <div className="form-buttons">
              <Button type="primary" htmlType="submit">Lưu</Button>
              <Button type="default" onClick={handleCancel} style={{ marginLeft: '10px' }}>Hủy</Button>
            </div>
          ) : (
            <Button type="primary" onClick={handleEdit}>Chỉnh sửa</Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default EmployeeDetail;
