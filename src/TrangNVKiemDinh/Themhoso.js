import React, {useState} from 'react';
import { Form, Input, Button, Radio, Upload, Row, Col, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar'; 
import './Themhoso.css'; 
import axios from 'axios';

const { Option } = Select;
const NVKDAddAdoptionProfile = () => {

  const [form] = Form.useForm();
  const [fileListChungNhanKetHon, setFileListChungNhanKetHon] = useState([]);
  const [fileListGiayKhamSucKhoe, setFileListGiayKhamSucKhoe] = useState([]);

  const handleCancel = () => {
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();  
    formData.append('yeuCau', values.yeuCau);
    formData.append('TinhTrangChoo', values.tinhTrangChoO);
    formData.append('MucThuNhapHangThang', values.mucThuNhapHangThang);
    formData.append('NgheNghiep', values.ngheNghiep);
    formData.append('trangThai', values.trangThai);
    formData.append('CCCD', values.cccd);
  
    if (fileListChungNhanKetHon.length > 0) {
      formData.append('chungNhanKetHon', fileListChungNhanKetHon[0]);
    }
  
    if (fileListGiayKhamSucKhoe.length > 0) {
      formData.append('giayKhamSucKhoe', fileListGiayKhamSucKhoe[0]);
    }
  
    try {
      console.log(formData)
      await axios.post('http://localhost:5000/submit-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('Profile submitted successfully');
    } catch (error) {
      console.error('Failed to submit profile:', error);
      message.error('Failed to submit profile');
    }

  };
  return (
    <div className="add-adoption-profile-container">
      <Sidebar />
      <div className="add-adoption-profile-content">
        <h2>Thêm Hồ Sơ Nhận Nuôi</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Người gửi hồ sơ (CCCD)" name="cccd" >
           <Input.TextArea />
          </Form.Item>
          <Form.Item label="Yêu cầu" name="yeuCau">
            <Input.TextArea />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Chứng Nhận Kết Hôn" name="chungNhanKetHon" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                <Upload 
                  fileList={fileListChungNhanKetHon}
                  beforeUpload={file => {
                    setFileListChungNhanKetHon([file]);
                    return false;
                  }}
                  onRemove={() => setFileListChungNhanKetHon([])}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giấy Khám Sức Khỏe" name="giayKhamSucKhoe" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                <Upload 
                  fileList={fileListGiayKhamSucKhoe}
                  beforeUpload={file => {
                    setFileListGiayKhamSucKhoe([file]);
                    return false;
                  }}
                  onRemove={() => setFileListGiayKhamSucKhoe([])}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tình trạng chỗ ở" name="TinhTrangChoo" rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}>
            <Radio.Group>
              <Radio value="Y">Có nhà ở</Radio>
              <Radio value="N">Chung cư/trọ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Mức thu nhập hằng tháng" name="mucThuNhapHangThang" rules={[{ required: true, message: 'Vui lòng nhập mức thu nhập' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Nghề nghiệp" name="ngheNghiep" rules={[{ required: true, message: 'Vui lòng nhập nghề nghiệp' }]}>
            <Input.TextArea />
          </Form.Item>         
          <div className="form-buttons">
            <Button type="default" onClick={handleCancel}>Quay lại</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>Thêm</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default NVKDAddAdoptionProfile;
