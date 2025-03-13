import { createAddress, updateAddress } from '@/api/client/address';
import { useAppDispatch, useAppSelector } from '@/store';
import { Button, Cascader, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { ADDRESS_FORM_FIELDS, ADDRESS_FORM_LABELS } from '../constants';
import { AddressFormValues } from '../types';
import './AddressDialog.scss';
import { rules } from './rules';
import { AddressDialogProps } from './types';
import { fetchRegionTree } from '@/store/modules/client';

const AddressDialog = ({ open, editAddress, onClose, onSuccess }: AddressDialogProps) => {
  const [form] = Form.useForm<AddressFormValues>();
  const [areaData, setArea] = useState<object>({});
  const dispatch = useAppDispatch();
  const regionTree = useAppSelector(state => state.client.regionTree);

  /** 处理区域选择变化 */
  const handleAreaChange = (_: (string | number)[], selectedOptions: any[]) => {
    if (selectedOptions.length === 3) {
      const [province, city, district] = selectedOptions;
      const data = {
        province: province.name,
        provinceCode: province.code,
        city: city.name,
        cityCode: city.code,
        district: district.name,
        districtCode: district.code,
      };
      setArea(data);
    }
  };

  /** 关闭 */
  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  /** 成功 */
  const handleSuccess = () => {
    onSuccess();
    form.resetFields();
  };

  /** 确定 */
  const handleOk = () => {
    form.validateFields().then(async values => {
      const data = { ...values, ...areaData };
      if (editAddress) {
        await updateAddress(editAddress.id, data);
      } else {
        await createAddress(data);
      }
      handleSuccess();
    });
  };

  /** 初始化表单数据 */
  useEffect(() => {
    if (!open) return;
    let formData = {};
    if (editAddress) {
      const area = [editAddress.provinceCode, editAddress.cityCode, editAddress.districtCode];
      formData = {
        ...editAddress,
        // 省市区 级联选择器 数据特殊处理
        area: area,
      };
      const areaData = {
        province: editAddress.province,
        provinceCode: editAddress.provinceCode,
        city: editAddress.city,
        cityCode: editAddress.cityCode,
        district: editAddress.district,
        districtCode: editAddress.districtCode,
      };
      setArea(areaData);
    }
    form.setFieldsValue(formData);
  }, [open, editAddress]);

  // 初始化省市区数据
  useEffect(() => {
    if (regionTree.length) return;
    dispatch(fetchRegionTree());
  }, [regionTree, dispatch]);

  return (
    <Modal
      title={editAddress ? '编辑地址' : '新增地址'}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
      className="address-dialog"
    >
      <Form form={form} layout="vertical" initialValues={{ isDefault: false }}>
        <Form.Item
          label={ADDRESS_FORM_LABELS[ADDRESS_FORM_FIELDS.CONSIGNEE]}
          name={ADDRESS_FORM_FIELDS.CONSIGNEE}
          rules={rules.consignee}
        >
          <Input placeholder="请输入收货人姓名" />
        </Form.Item>

        <Form.Item
          label={ADDRESS_FORM_LABELS[ADDRESS_FORM_FIELDS.PHONE]}
          name={ADDRESS_FORM_FIELDS.PHONE}
          rules={rules.phone}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>

        <Form.Item
          label={ADDRESS_FORM_LABELS[ADDRESS_FORM_FIELDS.PROVINCE]}
          required
          // 数据特殊处理
          name="area"
          rules={rules.area}
        >
          <Cascader
            options={regionTree}
            onChange={handleAreaChange}
            placeholder="请选择所在地区"
            fieldNames={{ label: 'name', value: 'code', children: 'children' }}
          />
        </Form.Item>

        <Form.Item
          label={ADDRESS_FORM_LABELS[ADDRESS_FORM_FIELDS.DETAIL]}
          name={ADDRESS_FORM_FIELDS.DETAIL}
          rules={rules.detail}
        >
          <Input.TextArea placeholder="请输入详细地址" rows={3} />
        </Form.Item>

        <div className="dialog-footer">
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export { AddressDialog };
