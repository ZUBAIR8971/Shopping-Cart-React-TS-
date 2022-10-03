import React from 'react';
import { Col, Row } from 'react-bootstrap';
import StoreItem from '../components/StoreItem';
import StoreItems from "../data/items.json";

const Store = () => {
  return (
    <>
      <h1>Store</h1>
      <Row md={2} xs={1} lg={3} className={'g-3'}>
        {
          StoreItems.map(item => (
            <Col key={item.id}>
              {
                <StoreItem {...item} />
                // JSON.stringify(item)
              }
            </Col>
          ))
        }
      </Row>
    </>
  )
}

export default Store;