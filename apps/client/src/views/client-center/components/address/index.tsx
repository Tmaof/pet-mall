import { AddressDto } from '@/api/client/address/res.dto';
import { IS_DEFAULT } from '@/api/client/address/enum';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Modal, Skeleton, Space, Tag } from 'antd';
import { useState } from 'react';
import { AddressDialog } from './components/AddressDialog';
import { useAddressList } from './hooks/useAddressList';
import './index.scss';

const Address = () => {
  const { addressList, loading, loadAddressList, handleDelete, handleSetDefault } =
    useAddressList();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editAddress, setEditAddress] = useState<AddressDto>();

  /** 处理编辑地址 */
  const handleEdit = (address: AddressDto) => {
    setEditAddress(address);
    setDialogVisible(true);
  };

  /** 处理删除地址 */
  const handleDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该地址吗？',
      onOk: () => handleDelete(id),
    });
  };

  /** 处理对话框关闭 */
  const handleDialogClose = () => {
    setDialogVisible(false);
    setEditAddress(undefined);
  };

  /** 处理对话框成功 */
  const handleDialogSuccess = () => {
    handleDialogClose();
    loadAddressList();
  };

  return (
    <div className="address-page">
      <div className="address-header">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setDialogVisible(true)}>
          新增地址
        </Button>
      </div>

      <div className="address-list">
        {loading ? (
          <Card>
            <Skeleton active />
          </Card>
        ) : addressList.length === 0 ? (
          <Empty description="暂无收货地址" />
        ) : (
          addressList.map(address => (
            <Card key={address.id} className="address-item">
              <div className="address-content">
                <div className="address-info">
                  <div className="address-title">
                    <span className="name">{address.consignee}</span>
                    <span className="phone">{address.phone}</span>
                    {address.isDefault === IS_DEFAULT.YES && <Tag color="blue">默认</Tag>}
                  </div>
                  <div className="address-detail">
                    {address.province}
                    {address.city}
                    {address.district}
                    {address.detail}
                  </div>
                </div>
                <div className="address-actions">
                  <Space>
                    {address.isDefault !== IS_DEFAULT.YES && (
                      <Button type="link" onClick={() => handleSetDefault(address.id)}>
                        设为默认
                      </Button>
                    )}
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(address)}>
                      编辑
                    </Button>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteConfirm(address.id)}
                    >
                      删除
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <AddressDialog
        open={dialogVisible}
        editAddress={editAddress}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
};

export { Address };
