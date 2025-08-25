import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ETFTable = ({ etfs, setEtfs }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    etfs.forEach(code => fetchETF(code));
  }, [etfs]);

  const fetchETF = async (code) => {
    try {
      // 這裡用 Yahoo Finance API 模擬 fetch
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${code}`;
      const res = await axios.get(url);
      const quote = res.data.quoteResponse.result[0];
      setData(prev => ({
        ...prev,
        [code]: {
          price: quote.regularMarketPrice,
          changePercent: quote.regularMarketChangePercent,
          updated: new Date().toLocaleString()
        }
      }));
    } catch (e) {
      console.log("Error fetching", code, e);
    }
  };

  const handleDelete = (code) => {
    setEtfs(etfs.filter(e => e !== code));
    const newData = { ...data };
    delete newData[code];
    setData(newData);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(etfs);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setEtfs(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="etfList">
        {(provided) => (
          <table {...provided.droppableProps} ref={provided.innerRef} border="1" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
            <thead>
              <tr>
                <th>ETF</th>
                <th>Price</th>
                <th>Change %</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {etfs.map((code, index) => (
                <Draggable key={code} draggableId={code} index={index}>
                  {(provided) => (
                    <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <td>{code}</td>
                      <td>{data[code]?.price ?? 'Loading...'}</td>
                      <td>{data[code]?.changePercent?.toFixed(2) ?? '-'}</td>
                      <td>{data[code]?.updated ?? '-'}</td>
                      <td><button onClick={() => handleDelete(code)}>Delete</button></td>
                    </tr>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tbody>
          </table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ETFTable;
