// components/SetUpForm.tsx
import React, { useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';

const SetUpForm: React.FC = () => {
  const [numbers, setNumbers] = useState([0, 0, 0]);
  const [response, setResponse] = useState('');
  const client = useClient(ZkMokuService);

  const handleNumberChange = (index: number, value: number) => {
    setNumbers((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers[index] = value;
      return newNumbers;
    });
  };

  const handleAddNumber = () => {
    setNumbers([...numbers, 0]);
  };

  const handleRemoveNumber = () => {
    if (numbers.length > 1) {
      setNumbers(numbers.slice(0, -1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted numbers:', numbers);
    client
      .setUp({
        ids: numbers.map((number) => BigInt(number)),
      })
      .then((resp) => {
        console.log("OK!", resp.toJsonString());
        setResponse(resp.toJsonString());
      }).catch((err) => { console.log(err) })
  };

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          {numbers.map((number, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => handleNumberChange(index, parseInt(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleAddNumber}>+</button>
      <button type="button" onClick={handleRemoveNumber}>-</button>
      <button type="submit">Submit</button>
      {response && <p>{response}</p>}
    </form>
  );
};

export default SetUpForm;
