import { AddressDto } from '@/api/client/address/res.dto';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchClientAddresses } from '@/store/modules/client';
import { HomeOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Radio, RadioChangeEvent, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export type Props = {
  /**
   * 选择地址后触发 ;
   * 有默认地址时，第一次触发；
   */
  onSelect?: (address: AddressDto) => void;
};

export const SelectClientAddress = (props: Props) => {
  const { onSelect } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { clientAddresses: addressList } = useAppSelector(state => state.client);
  const [selectId, setSelectId] = useState<number>();

  // 如果没有地址列表，可能没有获取过，先获取地址列表
  useEffect(() => {
    if (addressList.length === 0) {
      dispatch(fetchClientAddresses());
    }
  }, []);

  // 设置默认地址
  useEffect(() => {
    const defaultAdd = addressList.find(item => item.isDefault);
    if (defaultAdd) {
      onSelect?.(defaultAdd);
      setSelectId(defaultAdd.id);
    }
  }, [addressList, onSelect]);

  /** 跳转至地址管理页面 */
  const handleToAddress = () => {
    setTimeout(() => {
      navigate('/client-center?tabKey=address');
    }, 200);
  };

  const handleChange = useCallback(
    (e: RadioChangeEvent) => {
      const id = e.target.value;
      setSelectId(id);
      const address = addressList.find(item => item.id === id);
      if (address) {
        onSelect?.(address);
      }
    },
    [addressList, onSelect]
  );

  return (
    <div className="select-client-address-container">
      {addressList.length > 0 ? (
        <Radio.Group className="address-radio-group" value={selectId} onChange={handleChange}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {addressList.map(address => (
              <Radio key={address.id} value={address.id} className="address-radio-card">
                <div className="address-card">
                  <div className="address-header">
                    <span className="contact-name">{address.consignee}</span>
                    <span className="contact-phone">{address.phone}</span>
                  </div>
                  <div className="address-content">
                    <HomeOutlined className="address-icon" />
                    <span className="address-text">
                      {address.province} {address.city} {address.district} {address.detail}
                    </span>
                  </div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      ) : (
        <div className="no-address-tips" onClick={handleToAddress}>
          <PlusSquareOutlined className="tips-icon" />
          <div className="tips-text">添加收货地址</div>
        </div>
      )}
    </div>
  );
};
