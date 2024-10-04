import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Radio, message, Select } from 'antd';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Trangchitiet.css';

const { Option } = Select;

const NVPBTChildDetail = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const [hasNgaySinh, setHasNgaySinh] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/children/${id}`);
          // Kiểm tra nếu ngày sinh là null
        if(response.data.ngaysinh === null){
          setHasNgaySinh(false);
          setProfile(response.data);
          // Thiết lập giá trị cho form, bao gồm ngày nhận nuôi
          const adoptionDate = new Date(response.data.ngayNhanNuoi);
          form.setFieldsValue({
            ...response.data,
            ngayNhanNuoi: {
              day: adoptionDate.getDate(),
              month: adoptionDate.getMonth() + 1,
              year: adoptionDate.getFullYear()
            },
            trangthai: Number(response.data.trangthai),
          });
        }else{
          setProfile(response.data);
          // Nếu có ngày sinh, thiết lập cả ngày sinh và ngày nhận nuôi
          const birthDate = new Date(response.data.ngaysinh);
          const adoptionDate = new Date(response.data.ngayNhanNuoi);
          form.setFieldsValue({
            ...response.data,
            ngaySinh: {
              day: birthDate.getDate() ,
              month: birthDate.getMonth() + 1,
              year: birthDate.getFullYear()
            },
            ngayNhanNuoi: {
              day: adoptionDate.getDate(),
              month: adoptionDate.getMonth() + 1,
              year: adoptionDate.getFullYear()
            },
            trangthai: Number(response.data.trangthai),
          });
        }      
      } catch (error) {
        console.error('Failed to fetch child data:', error);
        message.error('Failed to fetch child data');
      }
    };
    fetchChild();
  }, [id, form]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    form.resetFields();
    const birthDate = new Date(profile.ngaysinh);
    const adoptionDate = new Date(profile.ngayNhanNuoi);
    form.setFieldsValue({
      ...profile,
      ngaySinh: {
        day: birthDate.getDate(),
        month: birthDate.getMonth() + 1,
        year: birthDate.getFullYear()
      },
      ngayNhanNuoi: {
        day: adoptionDate.getDate(),
        month: adoptionDate.getMonth() + 1,
        year: adoptionDate.getFullYear()
      }
    });
  };

  const handleSave = async (values) => {
    try {
      const formatDate = (dateObj) => {
        const { day, month, year } = dateObj;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      };

      const formattedValues = {
        ...values,
        ngaysinh: hasNgaySinh ? formatDate(values.ngaySinh) : null,
        ngayNhanNuoi: formatDate(values.ngayNhanNuoi),
      };

      await axios.put(`http://localhost:5000/children/${id}`, formattedValues);
      setProfile(formattedValues);
      setEditMode(false);
      message.success('Child updated successfully');
    } catch (error) {
      console.error('Failed to save profile data:', error);
      message.error('Failed to save child data');
    }
  };

  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-page-content">
        <h2>Chi Tiết Trẻ</h2>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Họ và Tên" name="hovaten" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <Radio.Group 
              className='hasNgaySinh'
              onChange={(e) => setHasNgaySinh(e.target.value === 1)}
              value={hasNgaySinh ? 1 : 2}
              disabled={!editMode} 
            >
              <Radio value={1}>Có ngày sinh</Radio>
              <Radio value={2}>Không có ngày sinh</Radio>
            </Radio.Group>
            {hasNgaySinh && (
            <Form.Item
              className='itemNgaySinh'  
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <div style={{ display: 'flex' }}>
                {/* Combobox cho ngày */}
                <Form.Item
                  name={['ngaySinh', 'day']}
                  noStyle
                  rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                  <Select style={{ width: 150, marginRight: 10 }} disabled={!editMode}>
                    {[...Array(31)].map((_, index) => (
                      <Option key={index + 1} value={index + 1}>
                        {index + 1}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Combobox cho tháng */}
                <Form.Item
                  name={['ngaySinh', 'month']}
                  noStyle
                  rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
                >
                  <Select style={{ width: 200, marginRight: 10 }} disabled={!editMode}>
                    {[...Array(12)].map((_, index) => (
                      <Option key={index + 1} value={index + 1}>
                        Tháng {index + 1}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>                

                {/* Combobox cho năm */}
                <Form.Item
                  name={['ngaySinh', 'year']}
                  noStyle
                  rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
                >
                  <Select style={{ width: 230 }} disabled={!editMode}>
                    {[...Array(100)].map((_, index) => (
                      <Option key={index + 1970} value={index + 1970}>
                        {index + 1970}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>
          )}           
          </Form.Item>
          <Form.Item label="Giới tính" name="gioitinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group disabled={!editMode}>
              <Radio value="M">Nam</Radio>
              <Radio value="F">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Ngày nhận nuôi"
            name="ngayNhanNuoi"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Vui lòng chọn ngày nhận nuôi!' }]}
          >
            <div style={{ display: 'flex' }}>
              <Form.Item
                name={['ngayNhanNuoi', 'day']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <Select style={{ width: 150, marginRight: 10 }}>
                  {[...Array(31)].map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
                      {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['ngayNhanNuoi', 'month']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
              >
                <Select style={{ width: 200, marginRight: 10 }}>
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
                      Tháng {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['ngayNhanNuoi', 'year']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
              >
                <Select style={{ width: 230 }}>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={index + 1970}>
                      {index + 1970}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangthai" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Radio.Group disabled={!editMode}>
              <Radio value={1}>Chưa được nhận nuôi</Radio>
              <Radio value={2}>Đang chờ nhận nuôi</Radio>
              <Radio value={3}>Đã được nhận nuôi</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghichu">
            <Input disabled={!editMode} />
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

export default NVPBTChildDetail;
